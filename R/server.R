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

generate_server_block <- function(x, in_dat = NULL, id, display = c("table", "plot")) {

  display <- match.arg(display)

  obs_expr2 <- function(x) {
    splice_args(
      list(in_dat(), ..(args)),
      args = rapply(input_ids(x), quoted_input_entries, how = "replace")
    )
  }

  # if in_dat is NULL (data block), turn it into a reactive expression that
  # returns NULL
  if (is.null(in_dat)) {
    in_dat <- reactive(NULL)
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
        eval(obs_expr2(blk_no_srv))
      })

      r_values <- reactive({
        values_default <- r_values_default()[names(r_values_default()) != ""]
        values_module <- lapply(l_values_module, \(x) x())
        # keep sort order of x
        c(values_module, values_default)[names(x)]
      })

      # Does it make sense to separate these processes?
      # 1. Upd blk, 2.Update UI
      obs$update_blk <- observeEvent(
        {
          r_values()
          in_dat()
        },
        {
          # 1. upd blk,
          b <- blk()
          for (field in names(b)) {
            if (field %in% names(is_srv)[is_srv]) {
              b[[field]] <- update_field(b[[field]], r_values()[[field]])
            } else {
              env <- c(
                list(data = in_dat()),
                r_values()[-which(names(r_values()) == field)]
              )
              b[[field]] <- update_field(b[[field]], r_values()[[field]], env)
              if (identical(input[[field]], value(b[[field]]))) next
            }
          }
          blk(b)  # update block
          message(sprintf("Updating block %s", class(x)[[1]]))

          # 2. Update UI
          for (field in names(b)) {
            if (field %in% names(is_srv)[is_srv]) {
              # update reactive value that tiggers module server update
              l_init[[field]](b[[field]])
            } else {
              ui_update(b[[field]], session, field, field)
            }
          }
          message(sprintf("Updating UI of block %s", class(x)[[1]]))
        },
        ignoreInit = TRUE
      )

      obs$print_error <- observeEvent(is_valid$error, {
        create_modal(is_valid$error)
      })

      # Validate block inputs
      obs$validate_inputs <- observeEvent(r_values(), {
        message(sprintf("Validating block %s", class(x)[[1]]))
        # validate_inputs(blk(), is_valid, session)  # FIXME should not rely on input$
        # Block will have a red border if any nested input is invalid
        # since blocks can be collapsed and people won't see the input
        # elements.
        validate_block(blk(), is_valid, session)
      })

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

      out_dat
    }
  )
}


#' @rdname generate_server
#' @export
generate_server.data_block <- function(x, id, ...) {
  generate_server_block(x = x, in_dat = NULL, id = id)
}

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


#' @param in_dat Reactive input data
#' @rdname generate_server
#' @export
generate_server.ggiraph_block <- generate_server.plot_block

#' @rdname generate_server
#' @param id Unique module id. Useful when the stack is called as a module.
#' @param new_blocks For dynamically inserted blocks.
#' @export
generate_server.stack <- function(x, id = NULL, new_blocks = NULL, ...) {
  stopifnot(...length() == 0L)

  id <- if (is.null(id)) attr(x, "name") else id

  moduleServer(
    id = id,
    function(input, output, session) {
      vals <- reactiveValues(
        stack = x,
        blocks = vector("list", length(x))
      )
      init_blocks(x, vals, session)

      # Remove block from stack (can't be done within the block)
      session$userData$is_cleaned <- reactiveVal(FALSE)
      lapply(x, \(b) {
        id <- attr(b, "name")
        observeEvent({
          input[[sprintf("remove-block-%s", id)]]
        }, {
          # We can't remove the data block if there are downstream consumers...
          to_remove <- which(chr_ply(x, \(b) attr(b, "name")) == id)
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

          session$userData$stack <- vals$stack
        })
      })

      # Add new block
      observeEvent(
        {
          req(new_blocks)
          new_blocks()
        },
        {
          # Update stack
          block_to_add <- new_blocks()$block
          position <- new_blocks()$position

          vals$stack <- add_block(vals$stack, block_to_add, position)

          # Call module
          p <- if (is.null(position)) {
            length(vals$stack)
          } else {
            position + 1
          }
          vals$blocks[[p]] <- init_block(p, vals)

          # Insert UI
          insertUI(
            selector = sprintf(
              "[data-value='%s-block']",
              session$ns(attr(vals$stack[[p - 1]], "name"))
            ),
            where = "afterEnd",
            generate_ui(
              vals$stack[[p]],
              id = session$ns(attr(vals$stack[[p]], "name")),
              .hidden = FALSE
            )
          )

          # Necessary to communicate with downstream modules
          session$userData$stack <- vals$stack

          # trigger javascript-ui functionalities on add
          session$sendCustomMessage(
            "blockr-add-block",
            list(stack = session$ns(NULL))
          )
        }
      )

      observe({
        session$sendCustomMessage(
          "blockr-bind-stack",
          list(stack = session$ns(NULL))
        )
      })

      vals
    }
  )
}

#' Init blocks server
#' @keywords internal
init_blocks <- function(x, vals, session) {
  observeEvent(TRUE, {
    session$userData$stack <- vals$stack
    for (i in seq_along(x)) {
      vals$blocks[[i]] <- init_block(i, vals, session)
    }
  })
}

#' Init a single block
#'
#' Useful for \link{init_blocks} but also
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
    id = id,
    remove = reactive(session$input[[sprintf("remove-block-%s", id)]])
  )
}

#' Cleanup module inputs
#' @keywords internal
remove_shiny_inputs <- function(id, .input) {
  invisible(
    lapply(grep(id, names(.input), value = TRUE), function(i) {
      .subset2(.input, "impl")$.values$remove(i)
    })
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

#' @rdname generate_ui
#' @export
server_output.ggiraph_block <- function(x, result, output) {
  ggiraph::renderGirafe(result())
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
