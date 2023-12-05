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

#' @rdname generate_server
#' @export
generate_server.data_block <- function(x, id, ...) {
  obs_expr <- function(x) {
    splice_args(
      list(..(args)),
      args = lapply(unlst(input_ids(x)), quoted_input_entry)
    )
  }

  set_expr <- function(x) {
    splice_args(
      blk(update_fields(blk(), session, ..(args))),
      args = rapply(input_ids(x), quoted_input_entries, how = "replace")
    )
  }

  moduleServer(
    id,
    function(input, output, session) {
      ns <- session$ns
      blk <- reactiveVal(x)

      o <- observeEvent(
        eval(obs_expr(blk())),
        eval(set_expr(blk())),
        ignoreInit = TRUE
      )

      out_dat <- reactive(
        evaluate_block(blk())
      )

      output$res <- server_output(x, out_dat, output)
      output$code <- server_code(x, blk, output)

      output$nrow <- renderText({
        prettyNum(nrow(out_dat()), big.mark = ",")
      })

      output$ncol <- renderText({
        prettyNum(ncol(out_dat()), big.mark = ",")
      })

      list(
        data = out_dat,
        remove = reactive(input$remove)
      )
    }
  )
}

#' @param in_dat Reactive input data
#' @rdname generate_server
#' @export
generate_server.transform_block <- function(x, in_dat, id, ...) {
  obs_expr <- function(x) {
    splice_args(
      list(in_dat(), ..(args)),
      args = lapply(unlst(input_ids(x)), quoted_input_entry)
    )
  }

  set_expr <- function(x) {
    splice_args(
      blk(update_fields(blk(), session, in_dat(), ..(args))),
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

      # Validate block expression.
      # Requires to validate inputs first
      obs$update_block <- observeEvent(
        eval(obs_expr(blk())),
        {
          is_valid$message <- NULL
          is_valid$block <- TRUE
          is_valid$inputs <- list()
          secure(eval(set_expr(blk())), is_valid)
          message(sprintf("Updating block %s", class(x)[[1]]))
        },
        ignoreInit = TRUE
      )

      obs$print_error <- observeEvent(is_valid$error, {
        create_modal(is_valid$error)
      })

      # Validate block inputs
      obs$validate_inputs <- observeEvent(eval(obs_expr(blk())), {
        message(sprintf("Validating block %s", class(x)[[1]]))
        validate_inputs(blk(), is_valid, session)
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
          evaluate_block(blk(), data = in_dat())
        })
      } else {
        reactive({
          req(is_valid$block)
          evaluate_block(blk(), data = in_dat())
        })
      }

      output$res <- server_output(x, out_dat, output)
      output$code <- server_code(x, blk, output)

      output$nrow <- renderText({
        prettyNum(nrow(out_dat()), big.mark = ",")
      })

      output$ncol <- renderText({
        prettyNum(ncol(out_dat()), big.mark = ",")
      })

      list(
        data = out_dat,
        remove = reactive(input$remove)
      )
    }
  )
}

#' @param in_dat Reactive input data
#' @rdname generate_server
#' @export
generate_server.plot_block <- function(x, in_dat, id, ...) {
  obs_expr <- function(x) {
    splice_args(
      list(in_dat(), ..(args)),
      args = lapply(unlst(input_ids(x)), quoted_input_entry)
    )
  }

  set_expr <- function(x) {
    splice_args(
      blk(update_fields(blk(), session, in_dat(), ..(args))),
      args = rapply(input_ids(x), quoted_input_entries, how = "replace")
    )
  }

  shiny::moduleServer(
    id,
    function(input, output, session) {
      blk <- shiny::reactiveVal(x)

      o <- shiny::observeEvent(
        eval(obs_expr(blk())),
        eval(set_expr(blk())),
        ignoreInit = TRUE
      )

      out_dat <- shiny::reactive({
        evaluate_block(blk(), data = in_dat())
      })

      output$plot <- server_output(x, out_dat, output)
      output$code <- server_code(x, blk, output)

      output$nrow <- renderText({
        prettyNum(nrow(out_dat()), big.mark = ",")
      })

      output$ncol <- renderText({
        prettyNum(ncol(out_dat()), big.mark = ",")
      })
    }
  )
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
        blocks = vector("list", length(x)),
        to_remove = NULL,
        remove = FALSE
      )
      init_blocks(x, vals, session)

      observeEvent(input$remove, {
        vals$remove <- TRUE
      })

      # Remove block
      to_remove_cache <- reactiveVal(NULL)
      observeEvent({
        int_ply(seq_along(vals$blocks), function(i) {
          vals$blocks[[i]]$remove()
        })
      }, {
        tmp <- int_ply(seq_along(vals$blocks), function(i) {
          vals$blocks[[i]]$remove()
        })
        req(any(tmp) > 0)
        # When cache is null to_remove is the first value > 0
        if (is.null(to_remove_cache())) {
          to_remove_cache(tmp)
          vals$to_remove <- which(to_remove_cache() > 0)
        } else {
          # If a block is removed, we have to update the cache
          # to compare what is comparable. This observe triggers
          # each time the blocks list changes. The diff will return
          # nothing in this situation and nothing will be removed.
          if (length(tmp) != length(to_remove_cache())) {
            to_remove_cache(tmp)
            vals$to_remove <- NULL
          }
          diff <- which(tmp != to_remove_cache())
          to_remove_cache(tmp)
          if (length(diff) > 0) {
            vals$to_remove <- diff
          }
        }

        req(vals$to_remove)

        # We can't remove the data block if there are downstream consumers...
        if (vals$to_remove == 1 && length(vals$stack) > 1) {
          showModal(
            modalDialog(
              title = h3(icon("xmark"), "Error"),
              "Can't remove a datablock whenever there are
            downstream data block consumers."
            )
          )
        } else {
          to_remove <- vals$to_remove
          message(sprintf("REMOVING BLOCK %s", vals$to_remove))
          removeUI(
            selector = sprintf(
              "[data-value='%s%s-block']",
              session$ns(""),
              attr(vals$stack[[to_remove]], "name")
            )
          )

          # TO DO: create remove_block function

          vals$stack[[to_remove]] <- NULL
          vals$blocks[[to_remove]] <- NULL
          # Reinitialize all the downstream stack blocks with new data ...
          if (to_remove < length(vals$stack)) {
            for (i in to_remove:length(vals$stack)) {
              attr(vals$stack[[i]], "position") <- i
              vals$blocks[[i]] <- init_block(i, vals)
            }
          }

          # TO DO: cleanup existing shiny inputs + modules observers ...

          session$userData$stack <- vals$stack
        }
      })

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
      vals$blocks[[i]] <- init_block(i, vals)
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
    id = attr(vals$stack[[i]], "name")
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
