#' Server
#'
#' Generic for server generation
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
generate_server.block <- function(x, ...) {
  stop("no base-class server for blocks available")
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
      if (identical(input[[field]], value(b[[field]]))) next
    }
  }
  b
}

update_ui <-  function(b, is_srv, session, l_init) {
  for (field in names(b)) {
    if (field %in% names(is_srv)[is_srv]) {
      # update reactive value that tiggers module server update
      l_init[[field]](b[[field]])
    } else {
      ui_update(b[[field]], session, field, field)
    }
  }
}

generate_server_block <- function(x, in_dat = NULL, id, display = c("table", "plot")) {

  display <- match.arg(display)

  # if in_dat is NULL (data block), turn it into a reactive expression that
  # returns NULL
  if (is.null(in_dat)) {
    in_dat <- reactive(NULL)
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
      # block and inputs are booleans. message is a character vector.
      is_valid <- reactiveValues(
        block = TRUE,
        input = list(),
        message = NULL,
        error = NULL
      )

      ns <- session$ns

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

      l_values_module <- list()  # a list with reactive values (module server output)
      for (name in names(x_srv)) {
        l_values_module[[name]] <-
          generate_server(x_srv[[name]])(name, init = l_init[[name]], data = in_dat)
      }

      # proceed in standard fashion (if fields have no generate_server)
      r_values_default <- reactive({
        blk_no_srv <- blk()
        blk_no_srv[is_srv] <- NULL    # to keep class etc
        eval(obs_expr(blk_no_srv))
      })

      r_values <- reactive({
        values_default <- r_values_default()[names(r_values_default()) != ""]
        values_module <- lapply(l_values_module, \(x) x())
        # keep sort order of x
        c(values_module, values_default)[names(x)]
      })

      obs$update_blk <- observe({
        # 1. upd blk,
        b <- update_blk(
          b = blk(),
          value = r_values(),
          is_srv = is_srv,
          input = input,
          data = in_dat()
        )
        blk(b)
        message(sprintf("Updating block %s", class(x)[[1]]))

        # 2. Update UI
        update_ui(b = blk(), is_srv = is_srv, session = session, l_init = l_init)
        message(sprintf("Updating UI of block %s", class(x)[[1]]))
      }) |>
        bindEvent(r_values(), in_dat())

      # Validate block inputs
      if (display != "plot") {
        obs$validate_inputs <- observeEvent(r_values(), {
          message(sprintf("Validating block %s", class(x)[[1]]))
          blk_no_srv <- blk()
          blk_no_srv[is_srv] <- NULL    # to keep class etc
          validate_inputs(blk_no_srv, is_valid, session)  # FIXME should not rely on input$

          # Block will have a red border if any nested input is invalid
          # since blocks can be collapsed and people won't see the input
          # elements.
          validate_block(blk(), is_valid, session)
        })
      }

      # For submit blocks like filter, summarise,
      # join that can have computationally intense tasks
      # and have nested fields, we require to click on
      # the action button before doing anything.
      out_dat <- if ("submit_block" %in% class(x)) {
        eventReactive(input$submit, {
          req(is_valid$block)
          if (is.null(in_dat())) {
            evaluate_block(blk())
          } else {
            evaluate_block(blk(), data = in_dat())
          }
        })
      } else {
        reactive({
          req(is_valid$block)
          if (is.null(in_dat())) {
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

      output$nrow <- renderText({
        prettyNum(nrow(out_dat()), big.mark = ",")
      })

      output$ncol <- renderText({
        prettyNum(ncol(out_dat()), big.mark = ",")
      })

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

      out_dat
    }
  )
}


#' @rdname generate_server
#' @export
generate_server.data_block <- function(x, id, ...) {
  generate_server_block(x = x, in_dat = NULL, id = id)
}

#' @rdname generate_server
#' @export
generate_server.upload_block <- generate_server.data_block

#' @param in_dat Reactive input data
#' @rdname generate_server
#' @export
generate_server.transform_block <- function(x, in_dat, id, ...) {
  generate_server_block(x = x, in_dat = in_dat, id = id)
}

#' @param in_dat Reactive input data
#' @rdname generate_server
#' @export
generate_server.plot_block <- function(x, in_dat, id, ...) {
  generate_server_block(x = x, in_dat = in_dat, id = id, display = "plot")
}

#' @rdname generate_server
#' @param id Unique module id. Useful when the stack is called as a module.
#' @param new_block For dynamically inserted blocks.
#' @export
generate_server.stack <- function(x, id = NULL, new_block = NULL, ...) {
  stopifnot(...length() == 0L)

  id <- if (is.null(id)) attr(x, "name") else id

  moduleServer(
    id = id,
    function(input, output, session) {
      vals <- reactiveValues(
        stack = x,
        blocks = vector("list", length(x))
      )

      init(x, vals, session)

      # Add new block
      observeEvent(
        {
          req(new_block)
          new_block()
        },
        {
          # Update stack
          block_to_add <- new_block()$block
          position <- new_block()$position

          vals$stack <- add_block(vals$stack, block_to_add, position)

          # Call module
          p <- if (is.null(position)) {
            length(vals$stack)
          } else {
            position + 1
          }

          if (p < 0L)
            p <- 1L

          vals$blocks[[p]] <- init_block(p, vals)

          # Insert UI
          if (p > 1L) {
            insertUI(
              selector = sprintf(
                "[data-value='%s-block']",
                session$ns(attr(vals$stack[[p - 1]], "name"))
              ),
              where = "afterEnd",
              inject_remove_button(
                vals$stack[[p]],
                session$ns,
                .hidden = FALSE
              )
            )
          } else {
            insertUI(
              selector = sprintf(
                "#%s-body",
                session$ns(attr(vals$stack, "name"))
              ),
              where = "afterBegin",
              inject_remove_button(
                vals$stack[[p]],
                session$ns,
                .hidden = FALSE
              )
            )
          }

          # Dynamically handle remove block event
          handle_remove(vals$stack[[p]], vals)

          # trigger javascript-ui functionalities on add
          session$sendCustomMessage(
            "blockr-add-block",
            list(stack = session$ns(NULL))
          )
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
        set_title(vals$stack, input$newTitle)
      })

      observe({
        session$sendCustomMessage(
          "blockr-bind-stack",
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


#' Remove stack/block generic
#'
#' Generic for stack/block removal
#'
#' @param x Element.
#' @param ... Generic consistency.
#'
#' @export
#' @rdname generate_server
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
#' @rdname generate_server
handle_remove.block <- function(x, vals, session = getDefaultReactiveDomain(), ...) {
  input <- session$input
  id <- attr(x, "name")
  observeEvent({
    input[[sprintf("remove-block-%s", id)]]
  }, {
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

    vals$stack[[to_remove]] <- NULL
    vals$blocks[[to_remove]] <- NULL
    # Reinitialize all the downstream stack blocks with new data ...
    if (to_remove < length(vals$stack)) {
      for (i in to_remove:length(vals$stack)) {
        attr(vals$stack[[i]], "position") <- i
        vals$blocks[[i]] <- init_block(i, vals)
      }
    }
  })
}

#' Attach an observeEvent to the given stack
#'
#' Necessary to be able to remove the stack from the workspace.
#'
#' @param vals Internal reactive values.
#' @param session Shiny session object.
#' @export
#' @rdname generate_server
handle_remove.stack <- function(x, vals, session = getDefaultReactiveDomain(), ...) {
  input <- session$input
  id <- attr(x, "name")
  observeEvent({
    input[[sprintf("remove-stack-%s", id)]]
  }, {
    # We can't remove the data block if there are downstream consumers...
    stacks <- get_workspace_stacks()
    to_remove <- which(chr_ply(stacks, \(x) attr(x, "name")) == id)
    message(sprintf("REMOVING STACK %s", to_remove))
    # Remove UI is done from JS
    # TO DO: this isn't very consistent with what we have for blocks
    # Remove stack UI is handled on the JS side and not on the R side.
    # To be consistent and align between block and stacks we should choose
    # only 1 way to remove elements.
    vals$stacks[[to_remove]] <- NULL
    rm_workspace_stack(names(stacks)[[to_remove]])
  })
}

#' @rdname generate_server
#' @param id Unique module id. Useful when the workspace is called as a module.
#' @export
generate_server.workspace <- function(x, id = NULL, ...) {
  stopifnot(...length() == 0L)

  id <- if (is.null(id)) attr(x, "name") else id

  moduleServer(
    id = id,
    function(input, output, session) {
      vals <- reactiveValues(stacks = list(), new_block = list())

      output$n_stacks <- renderText(length(vals$stacks))

      # Init existing stack modules
      init(x, get_workspace_stacks(), vals, session)

      # Standalone: when called from our generate_server.workspace

      # Add stack
      observeEvent(input$add_stack, {
        message("ADD STACK")
        add_workpace_stack(
          sprintf("stack-%s", length(vals$stacks) + 1),
          new_stack(data_block)
        )

        stacks <- get_workspace_stacks()
        el <- stacks[[length(stacks)]]

        stack_ui <- inject_remove_button(
          el,
          session$ns
        )

        insertUI(
          selector = if (length(vals$stacks) == 0) {
            ".workspace"
          } else {
            ".stacks"
          },
          ui = if (length(vals$stacks) == 0) {
            div(
              class = "row stacks",
              stack_ui
            )
          } else {
            stack_ui
          }
        )

        # Handle remove for newly added stacks
        handle_remove(el, vals)

        # Invoke server
        vals$stacks[[length(stacks)]] <- generate_server(
          el,
          id = attr(el, "name"),
          new_block = reactive(vals$new_block[[attr(el, "name")]])
        )

        # Handle new block injection
        inject_block(input, vals, id = attr(el, "name"))
      })

      # Clear all stacks
      observeEvent(input$clear_stacks, {
        clear_workspace_stacks()
        vals$stacks <- NULL
        removeUI(".stacks")
      })
    }
  )
}

#' Generic for server initialisation
#'
#' Handle initialisation of workspace, stacks, ...
#'
#' @param x Element.
#' @param ... Generic consistency.
#'
#' @export
#' @rdname generate_server
init <- function(x, ...) {
  UseMethod("init")
}

#' Init stacks server
#'
#' @param stacks List of workspace stacks.
#' @export
#' @rdname generate_server
init.workspace <- function(x, stacks, vals, session, ...) {
  input <- session$input

  observeEvent(TRUE, {
    lapply(seq_along(stacks), \(i) {
      id <- attr(stacks[[i]], "name")
      vals$stacks[[i]] <- generate_server(
        stacks[[i]],
        id = id,
        new_block = reactive(vals$new_block[[id]])
      )
      handle_remove(stacks[[i]], vals)

      # To dynamically insert blocks
      inject_block(input, vals, id)
    })
  })
}

#' Inject block into stack
#'
#' Called by workspace.
#'
#' @keywords internal
inject_block <- function(input, vals, id) {
  observeEvent(input[[sprintf("%s-add", id)]], {
    # Reset to avoid re-adding existing blocks to stacks
    vals$new_block <- NULL
    block <- available_blocks()[[input[[sprintf("%s-selected_block", id)]]]]
    # add_block expect the current stack, the block to add and its position
    # (NULL is fine for the position, in that case the block will
    # go at the end)
    vals$new_block[[id]] <- list(block = block)
  })
}

#' Init blocks server
#'
#' @export
#' @rdname generate_server
init.stack <- function(x, vals, session, ...) {
  observeEvent(TRUE, {
    for (i in seq_along(x)) {
      vals$blocks[[i]] <- init_block(i, vals, session)
    }
  })
  # Remove block from stack (can't be done within the block)
  # This works for extisting blocks. Newly added blocks need
  # to be handled separately.
  lapply(x, handle_remove, vals = vals)
}

#' Init a single block
#'
#' Useful for init.blocks but also
#' to be called after \link{add_block}.
#'
#' @param i Block position
#' @param vals Reactive values containing the stack.
#' @param session Shiny session object.
#'
#' @keywords internal
init_block <- function(i, vals, session) {
  id <- attr(vals$stack[[i]], "name")
  generate_server(
    vals$stack[[i]],
    in_dat = if (i == 1) {
      # No data for first block
      NULL
    } else {
      # Data from previous block
      vals$blocks[[i - 1]]
    },
    id = id
  )
}

#' @param output Shiny output
#' @param result Block result
#' @rdname generate_ui
#' @export
server_output <- function(x, result, output) {
  UseMethod("server_output", x)
}

#' @rdname generate_ui
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

#' @rdname generate_ui
#' @export
server_output.plot_block <- function(x, result, output) {
  shiny::renderPlot(result())
}

#' @param state Block state
#' @rdname generate_ui
#' @export
server_code <- function(x, state, output) {
  UseMethod("server_code", x)
}

#' @rdname generate_ui
#' @export
server_code.block <- function(x, state, output) {
  shiny::renderPrint(
    cat(deparse(generate_code(state())), sep = "\n")
  )
}
