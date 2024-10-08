#' Generic for server generation
#'
#' Calls shiny modules for the given element (workspace, stack, block).
#'
#' @param x Object for which to generate a [moduleServer()]
#' @param ... Generic consistency
#'
#' @export
#' @import shiny
generate_server <- function(x, ...) {
  UseMethod("generate_server")
}

#' @rdname generate_server
#' @export
generate_server.result_field <- function(x, ...) {
  function(id, init = NULL, data = NULL) {
    moduleServer(id, function(input, output, session) {
      get_result <- function(inp) {
        req(inp)
        res <- get_stack_result(
          get_workspace_stack(inp)
        )

        attr(res, "result_field_stack_name") <- inp

        res
      }

      workspace_stacks <- attr(get_workspace(), "reactive_stack_directory")

      exportTestValues(
        stacks = workspace_stacks()
      )

      if (is.null(workspace_stacks)) {
        workspace_stacks <- function() {
          list_workspace_stacks()
        }
      }

      observeEvent(
        workspace_stacks(),
        updateSelectInput(
          session,
          "select-stack",
          choices = result_field_stack_opts(session$ns, workspace_stacks()),
          selected = input[["select-stack"]]
        )
      )

      reactive({
        get_result(input[["select-stack"]])
      })
    })
  }
}

update_blk <- function(b, value, is_srv, input, data) {
  for (field in names(b)) {
    if (field %in% names(is_srv)[is_srv]) {
      b[[field]] <- update_field(b[[field]], value[[field]])
    } else {
      env <- c(
        list(data = data),
        value[-which(names(value) == field)]
      )
      b[[field]] <- update_field(b[[field]], value[[field]], env)
    }
  }
  b
}

update_ui <- function(b, is_srv, session, l_init) {
  for (field in names(b)) {
    if (field %in% names(is_srv)[is_srv]) {
      # update reactive value that tiggers module server update
      l_init[[field]](b[[field]])
    } else {
      ui_update(b[[field]], session, field, field)
    }
  }
}

generate_server_block <- function(
    x,
    in_dat = NULL,
    id,
    display = c("table", "plot"),
    is_prev_valid) {
  display <- match.arg(display)

  # if in_dat is NULL (data block), turn it into a reactive expression that
  # returns NULL
  if (is.null(in_dat)) {
    in_dat <- reactive(NULL)
    is_prev_valid <- reactive(NULL)
  }

  obs_expr <- function(x) {
    splice_args(
      list(in_dat(), ..(args)),
      args = rapply(input_ids(x), quoted_input_entries, how = "replace")
    )
  }

  moduleServer(
    id,
    function(input, output, session) {
      ns <- session$ns
      blk <- reactiveVal(x)
      obs <- list()

      ns <- session$ns

      is_valid <- reactiveValues(
        block = FALSE,
        message = NULL
      )

      # Idea:
      # - If a field has a generate_server() method, initialize it and use
      #   its return value.
      # - If not, use existing code
      # - combine both to r_values()
      # - to update ui, use ui_update(), or update module init reactive value

      is_srv <- vapply(x, has_method, TRUE, generic = "generate_server")

      # initialize server modules (if fields have generate_server)
      x_srv <- x[is_srv]

      # a list with reactive values (module server input)
      l_init <- lapply(x_srv, \(x) reactiveVal(x))

      l_values_module <- list() # a list with reactive values (module server output)
      for (name in names(x_srv)) {
        l_values_module[[name]] <-
          generate_server(x_srv[[name]])(name, init = l_init[[name]], data = in_dat)
      }

      # proceed in standard fashion (if fields have no generate_server)
      r_values_default <- reactive({
        # if (!is.null(is_prev_valid)) req(is_prev_valid)
        blk_no_srv <- blk()
        blk_no_srv[is_srv] <- NULL # to keep class etc
        eval(obs_expr(blk_no_srv))
      })

      r_values <- reactive({
        values_default <- r_values_default()[names(r_values_default()) != ""]
        values_module <- lapply(l_values_module, \(x) x())
        # keep sort order of x
        c(values_module, values_default)[names(x)]
      })

      # This will also trigger when the previous block
      # valid status changes.
      obs$update_blk <- observeEvent(c(r_values(), in_dat(), is_prev_valid()),
        {
          # 1. upd blk,
          b <- update_blk(
            b = blk(),
            value = r_values(),
            is_srv = is_srv,
            input = input,
            data = in_dat()
          )
          blk(b)
          log_debug("Updating block ", class(x)[[1]])

          # 2. Update UI
          update_ui(b = blk(), is_srv = is_srv, session = session, l_init = l_init)
          log_debug("Updating UI of block ", class(x)[[1]])

          # Validating
          is_valid$block <- validate_block(blk())
          is_valid$message <- attr(is_valid$block, "msg")
          is_valid$fields <- attr(is_valid$block, "fields")
          log_debug("Validating block ", class(x)[[1]])
        },
        priority = 1000
      )

      # Propagate message to user
      obs$surface_error <- observe({
        send_error_to_ui(blk(), is_valid, session)
        log_debug("Sending error message to UI for block ", class(x)[[1]])
      }) |> bindEvent(is_valid$block)

      # For submit blocks like filter, summarise,
      # join that can have computationally intense tasks
      # and have nested fields, we require to click on
      # the action button before doing anything.
      if (attr(x, "submit") > -1) {
        # Increment submit attribute for serialization
        # So that if a block is serialised with submit = TRUE
        # computations are automatically triggered on restore
        # Only do it once.
        observeEvent(input$submit,
          {
            tmp <- blk()
            attr(tmp, "submit") <- TRUE
            blk(tmp)
          },
          once = TRUE
        )
      }

      out_dat <- if (attr(x, "submit") > -1) {
        eventReactive(input$submit,
          {
            req(is_valid$block)
            if (is.null(in_dat())) {
              evaluate_block(blk())
            } else {
              evaluate_block(blk(), data = in_dat())
            }
            # Trigger computation if submit attr is > 0
            # useful when restoring workspace
          },
          ignoreNULL = !attr(x, "submit") > 0
        )
      } else {
        reactive({
          req(is_valid$block)
          if (is.null(in_dat()) && !inherits(x, "transform_block")) {
            evaluate_block(blk())
          } else {
            evaluate_block(blk(), data = in_dat())
          }
        })
      }

      if (display == "plot") {
        output$plot <- server_output(x, out_dat, output)
      } else {
        output$res <- server_output(x, out_dat, output)
      }

      output$code <- server_code(x, blk, output)

      if (display != "plot") {
        output$nrow <- renderText({
          prettyNum(nrow(out_dat()), big.mark = ",")
        })

        output$ncol <- renderText({
          prettyNum(ncol(out_dat()), big.mark = ",")
        })
      }

      # TO DO: cleanup module inputs (UI and server side)
      # and observers. PR 119
      observeEvent(input$copy, {
        session$sendCustomMessage(
          "blockr-copy-code",
          list(
            code = generate_code(blk()) |>
              deparse() |>
              as.character() |>
              as.list()
          )
        )
      })

      download(x, session, out_dat)

      # For shinytest2
      # Note: no need to export data as
      # they are reflected in the shinytest2
      # output elements
      exportTestValues(
        block = blk(),
        # res may be a ggplot object
        res = out_dat()
      )

      return(
        list(
          block = blk,
          data = out_dat,
          # Needed by the stack to block
          # computations for the next block
          is_valid = reactive(is_valid$block)
        )
      )
    }
  )
}

#' @rdname generate_server
#' @export
generate_server.data_block <- function(x, id, ...) {
  generate_server_block(x = x, in_dat = NULL, id = id, is_prev_valid = NULL)
}

#' @param in_dat Reactive input data
#' @param is_prev_valid Useful to validate the current block
#' @rdname generate_server
#' @export
generate_server.transform_block <- function(x, in_dat, id, is_prev_valid, ...) {
  generate_server_block(x = x, in_dat = in_dat, id = id, is_prev_valid = is_prev_valid)
}

#' @rdname generate_server
#' @export
generate_server.plot_block <- function(x, in_dat, id, is_prev_valid, ...) {
  generate_server_block(
    x = x,
    in_dat = in_dat,
    id = id,
    display = "plot",
    is_prev_valid = is_prev_valid
  )
}

#' @param id Unique module id. Useful when the stack is called as a module.
#' @param new_block For dynamically inserted blocks.
#' @param workspace Stack workspace
#'
#' @rdname generate_server
#' @export
generate_server.stack <- function(x, id = NULL, new_block = NULL,
                                  workspace = get_workspace(), ...) {
  stopifnot(...length() == 0L)

  id <- coal(id, get_stack_name(x))

  get_block_val <- function(b) b$block()

  get_block_vals <- function(x) lapply(x, get_block_val)

  get_last_block_data <- function(x) {
    len <- length(x)
    if (len) x[[len]]$data else \() list()
  }

  moduleServer(
    id = id,
    function(input, output, session) {
      vals <- reactiveValues(
        stack = x,
        blocks = vector("list", length(x)),
        removed = FALSE
      )
      # Don't remove: needed by shinytest2
      exportTestValues(
        stack = vals$stack,
        n_blocks = length(vals$blocks),
        removed = vals$removed
      )

      init(x, vals, session)

      # For advanced usage. Add new block when not using
      # the stack UI/add button from blockr.
      observeEvent(
        {
          req(new_block)
          new_block()
        },
        {
          add_block_stack(new_block()$block, new_block()$position, vals = vals)
        }
      )

      observeEvent(input$copy, {
        session$sendCustomMessage(
          "blockr-copy-code",
          list(
            code = generate_code(vals$stack) |>
              deparse() |>
              as.character() |>
              as.list()
          )
        )
      })

      observeEvent(input$newTitle, {
        vals$stack <- set_stack_title(vals$stack, input$newTitle)
      })

      # TBD: The stack could have attributes like: add_block = TRUE.
      # If yes, we can call the corresponding modules/func on the UI/Server side.
      block_to_add <- add_block_server(x, "add-block", vals)
      # This can only be done from the stack level
      observeEvent(block_to_add$selected(), {
        add_block_stack(
          block_to_add = available_blocks()[[block_to_add$selected()]], # pass in block constructor
          position = NULL,
          vals = vals
        )
      })

      # Any block change: data or input should be sent
      # up to the stack so we can properly serialise.
      observeEvent(
        c(
          get_block_vals(vals$blocks),
          get_last_block_data(vals$blocks)()
        ),
        {
          vals$stack <- set_stack_blocks(
            vals$stack,
            get_block_vals(vals$blocks),
            get_last_block_data(vals$blocks)
          )
        }
      )

      observeEvent(vals$stack, {
        log_debug("UPDADING WORKSPACE with stack ", id)
        add_workspace_stack(id, vals$stack,
          force = TRUE,
          workspace = workspace
        )
      })

      # Handle stack removal
      remove_stack_server(vals, input, session, id, workspace)

      observeEvent(input$rendered, {
        session$sendCustomMessage(
          "blockr-render-stack",
          list(
            stack = session$ns(NULL),
            locked = is_locked(session)
          )
        )
      })

      vals
    }
  )
}

#' Helper function that removes a stack
#' @keywords internal
#' @noRd
remove_stack_server <- function(vals, input, session, id, workspace) {
  observeEvent(input$remove, {
    showModal(
      modalDialog(
        title = "Remove stack",
        p("Are you sure you want to remove this stack?"),
        div(
          class = "d-flex",
          div(
            class = "flex-grow-1",
            actionButton(
              session$ns("cancelRemove"),
              "Cancel",
              icon = icon("times")
            )
          ),
          div(
            class = "flex-shrink-1",
            actionButton(
              session$ns("acceptRemove"),
              "Confirm",
              class = "bg-danger",
              icon = icon("trash")
            )
          )
        ),
        footer = NULL
      )
    )
  })

  observeEvent(input$cancelRemove, {
    removeModal()
  })

  observeEvent(input$acceptRemove, {
    on.exit(removeModal())
    removeUI(
      sprintf("#%s", session$ns(NULL))
    )
    vals$removed <- TRUE
    rm_workspace_stack(id, workspace = workspace)
  })
}

#' Add block server generic
#'
#' This modules aims at showing extra info in the
#' offcanvas menu to add blocks. Blocks are added
#' at the stack level with another function, add_block_stack.
#'
#' @rdname add_block
#' @export
add_block_server <- function(x, ...) {
  stopifnot(inherits(x, "stack"))
  UseMethod("add_block_server", x)
}

#' Default add block server module
#'
#' This modules aims at showing extra info in the
#' offcanvas menu to add blocks. Blocks are added
#' at the stack level with another function, add_block_stack.
#'
#' @param vals Reactive values.
#' @rdname add_block
#' @export
add_block_server.default <- function(x, id, vals, ...) {
  moduleServer(id, function(input, output, session) {
    ns <- session$ns

    # Triggers on init
    blk_choices <- reactiveVal(NULL)
    observeEvent(
      {
        req(input$add > 0)
        c(input$add, vals$blocks)
      },
      {
        # Pills are dynamically updated from the server
        # depending on the block compatibility
        blk_choices(get_compatible_blocks(vals$stack))

        choices <- blk_choices()
        choices$name <- paste(choices$package, sep = "::", choices$ctor)

        shinyWidgets::updateVirtualSelect(
          "search",
          choices = shinyWidgets::prepare_choices(
            choices,
            .data$name,
            .data$ctor,
            group_by = .data$category,
            description = .data$description
          )
        )

        removeUI(sprintf("#%s", ns("status-message")))
        if (length(vals$blocks) == 0) {
          shiny::insertUI(
            sprintf("#%s", ns("status-messages")),
            ui = div(
              class = "alert alert-primary",
              role = "alert",
              id = ns("status-message"),
              "Stack has no blocks. Start by adding a data block."
            )
          )
        }
      }
    )

    return(
      list(
        selected = reactive({
          req(nchar(input$search) > 0)
          input$search
        })
      )
    )
  })
}

#' Remove stack/block generic
#'
#' Generic for stack/block removal
#'
#' @inheritParams generate_server
#'
#' @export
#' @rdname handle_remove
handle_remove <- function(x, ...) {
  UseMethod("handle_remove")
}

#' Attach an observeEvent to the given block
#'
#' Necessary to be able to remove the block from the stack.
#'
#' @param vals Internal reactive values.
#' @param session Shiny session object.
#' @export
#' @rdname handle_remove
handle_remove.block <- function(x, vals,
                                session = getDefaultReactiveDomain(), ...) {
  input <- session$input

  id <- attr(x, "name")

  observeEvent(
    {
      input[[sprintf("remove-block-%s", id)]]
    },
    {
      # We can't remove the data block if there are downstream consumers...
      to_remove <- which(chr_ply(vals$stack, \(x) attr(x, "name")) == id)
      message(sprintf("REMOVING BLOCK %s", to_remove))
      removeUI(
        selector = sprintf(
          "[data-value='%s%s-block']",
          session$ns(""),
          attr(vals$stack[[to_remove]], "name")
        )
      )

      vals$blocks[[to_remove]] <- NULL
      # Reinitialize all the downstream stack blocks with new data ...
      if (to_remove < length(vals$stack)) {
        vals$stack[[to_remove]] <- NULL
        for (i in to_remove:length(vals$stack)) {
          attr(vals$stack[[i]], "position") <- i
          vals$blocks[[i]] <- init_block(i, vals)
        }
      } else {
        vals$stack[[to_remove]] <- NULL
      }
    }
  )
}

#' @rdname generate_server
#' @param id Unique module id. Useful when the workspace is called as a module.
#' @export
generate_server.workspace <- function(x, id, ...) {
  stopifnot(...length() == 0L)

  is_stack_removed <- function(s) {
    if (s$removed) s
  }

  are_stacks_removed <- function(stacks) {
    dropNulls(lapply(stacks, is_stack_removed))
  }

  moduleServer(
    id = id,
    function(input, output, session) {
      vals <- reactiveValues(stacks = list(), new_block = list())
      # Required by shinytest2: don't remove
      # Note: we can't check vals$stack as this is
      # a nested reactiveVal which does not play well
      # with shinytest2 ...
      n_stacks <- reactive(length(vals$stacks))
      exportTestValues(
        stacks = {
          n_stacks()
        }
      )

      # Init existing stack modules
      init(x, vals, session)

      output$n_stacks <- renderText(n_stacks())

      # Listen when stack are removed
      observeEvent(req(length(are_stacks_removed(vals$stacks)) > 0), {
        to_remove <- are_stacks_removed(vals$stacks)
        vals$stacks[[names(to_remove)]] <- NULL
        removeUI(
          sprintf("#%sStackCol", names(to_remove))
        )
      })

      # Add stack
      observeEvent(input$add_stack, {
        stck <- new_stack()

        stack_id <- get_stack_name(stck)

        log_debug("ADD STACK (", stack_id, ")")

        add_workspace_stack(stack_id, stck, workspace = x)

        el <- get_workspace_stack(stack_id, workspace = x)

        stack_ui <- div(
          class = "flex-grow-1 stack-col m-1",
          generate_ui(el, session$ns(stack_id))
        )

        insertUI(
          selector = ".stacks",
          ui = stack_ui
        )

        # Invoke server
        vals$stacks[[stack_id]] <- generate_server(
          el,
          id = stack_id,
          new_block = reactive(vals$new_block[[stack_id]])
        )

        # Handle new block injection
        # inject_block(input, vals, stack_id)
      })

      # Clear all stacks
      observeEvent(input$clear_stacks, {
        clear_workspace_stacks(workspace = x)
        vals$stacks <- NULL
        removeUI(".stack-col", multiple = TRUE)
      })

      attr(x, "reactive_stack_directory") <- reactive({
        names(vals$stacks)
      }) |> bindEvent(
        chr_ply(lapply(vals$stacks, `[[`, "stack"), attr, "title")
      )

      # Serialize
      output$serialize <- downloadHandler(
        filename = function() {
          paste0("workspace-", Sys.Date(), ".json")
        },
        content = function(file) {
          write(to_json(), file)
        }
      )
    }
  )
}

#' Generic for server initialisation
#'
#' Handle initialisation of workspace, stacks, ...
#'
#' @inheritParams generate_server
#' @inheritParams handle_remove
#'
#' @export
#' @rdname init
init <- function(x, ...) {
  UseMethod("init")
}

#' @export
#' @rdname init
init.workspace <- function(x, vals, session, ...) {
  input <- session$input
  stacks <- get_workspace_stacks(workspace = x)

  observeEvent(TRUE, {
    lapply(names(stacks), \(nme) {
      vals$stacks[[nme]] <- generate_server(
        stacks[[nme]],
        id = nme,
        new_block = reactive(vals$new_block[[nme]])
      )
    })
  })
}

#' Inject block into stack
#'
#' Called by workspace.
#'
#' @keywords internal
inject_block <- function(input, vals, id) {
  listener_id <- sprintf("%s-add", id)

  log_debug("Setting up \"add block\" listener with ID ", listener_id)

  observeEvent(input[[listener_id]], {
    # Reset to avoid re-adding existing blocks to stacks
    vals$new_block <- NULL
    block <- available_blocks()[[input[[sprintf("%s-selected_block", id)]]]]
    # add_block expect the current stack, the block to add and its position
    # (NULL is fine for the position, in that case the block will
    # go at the end)
    vals$new_block[[id]] <- list(block = block)
  })
}

#' @export
#' @rdname init
init.stack <- function(x, vals, ...) {
  observeEvent(TRUE, {
    for (i in seq_along(x)) {
      vals$blocks[[i]] <- init_block(i, vals)
    }
  })
  # Remove block from stack (can't be done within the block)
  # This works for extisting blocks. Newly added blocks need
  # to be handled separately.
  lapply(x, handle_remove, vals)
}

#' Init a single block
#'
#' Useful for init.blocks but also
#' to be called after \link{add_block}.
#'
#' @param i Block position
#' @param vals Reactive values containing the stack
#'
#' @keywords internal
init_block <- function(i, vals) {
  generate_server(
    vals$stack[[i]],
    in_dat = if (i == 1) {
      # No data for first block
      NULL
    } else {
      # Data from previous block
      vals$blocks[[i - 1]]$data
    },
    id = attr(vals$stack[[i]], "name"),
    # Extract the state of the previous block
    # to pass it to the next one. This is needed
    # within the next block server function
    # to reset calculations if required.
    is_prev_valid = if (i == 1) {
      NULL
    } else {
      vals$blocks[[i - 1]]$is_valid
    }
  )
}

#' Server output generic
#'
#' Generate block server output. Needed on the UI
#' side. This is generally a table containing the
#' processed block data.
#'
#' @param x Block.
#' @param output Shiny output
#' @param result Block result
#' @rdname server_output
#' @export
server_output <- function(x, result, output) {
  UseMethod("server_output", x)
}

#' @rdname server_output
#' @export
server_output.block <- function(x, result, output) {
  DT::renderDT(
    {
      result() |>
        DT::datatable(
          selection = "none",
          options = list(
            pageLength = 5L,
            processing = FALSE
          )
        )
    },
    server = TRUE
  )
}

#' @rdname server_output
#' @export
server_output.upload_block <- function(x, result, output) {
  shiny::renderPrint(result())
}

#' @rdname server_output
#' @export
server_output.filesbrowser_block <- server_output.upload_block

#' @rdname server_output
#' @export
server_output.plot_block <- function(x, result, output) {
  shiny::renderPlot(result())
}

#' Server code generic
#'
#' Generate the server code output.
#'
#' @inheritParams server_output
#' @param state Block state
#' @rdname server_code
#' @export
server_code <- function(x, state, output) {
  UseMethod("server_code", x)
}

#' @rdname server_code
#' @export
server_code.block <- function(x, state, output) {
  shiny::renderPrint(
    cat(deparse(generate_code(state())), sep = "\n")
  )
}

add_block_stack <- function(
    block_to_add,
    position = NULL,
    vals,
    session = getDefaultReactiveDomain()) {
  vals$stack <- add_block(vals$stack, block_to_add, position)
  ns <- session$ns

  # Call module
  p <- if (is.null(position)) {
    length(vals$stack)
  } else {
    position + 1
  }

  if (p < 0L) {
    p <- 1L
  }

  vals$blocks[[p]] <- init_block(p, vals)

  # Insert UI
  if (p > 1L) {
    insertUI(
      selector = sprintf(
        "[data-value='%s-block']",
        ns(attr(vals$stack[[p - 1]], "name"))
      ),
      where = "afterEnd",
      inject_remove_button(
        vals$stack[[p]],
        ns,
        .hidden = FALSE
      )
    )
  } else {
    insertUI(
      selector = sprintf(
        "#%sbody",
        ns("")
      ),
      where = "afterBegin",
      inject_remove_button(
        vals$stack[[p]],
        ns,
        .hidden = FALSE
      )
    )
  }

  # Dynamically handle remove block event
  handle_remove(vals$stack[[p]], vals)

  # trigger javascript-ui functionalities on add
  session$sendCustomMessage(
    "blockr-add-block",
    list(
      stack = ns(NULL),
      block = ns(attr(vals$stack[[p]], "name"))
    )
  )
}
