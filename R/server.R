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
        evalute_block(blk())
      )

      output$res <- server_output(x, out_dat, output)
      output$code <- server_code(x, blk, output)

      # Cleanup module inputs (UI and server side)
      # and observer
      observeEvent(input$remove, {
        # Trick to be able to tell the stack to wait
        # for this event to run.
        session$userData$is_cleaned(FALSE)
        # Can only remove when it is the last stack block
        if (length(session$userData$stack) == 1) {
          message(sprintf("CLEANING UP BLOCK %s", id))
          remove_shiny_inputs(id = id, input)
          o$destroy()
          session$userData$is_cleaned(TRUE)
        }
        # We have to set high priority so this event
        # executes before the one in the stack which
        # updates the stack. If we don't, this will
        # never execute because the stack will be empty :)
      }, priority = 500)

      out_dat
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

      o <- observeEvent(
        eval(obs_expr(blk())),
        eval(set_expr(blk())),
        ignoreInit = TRUE
      )

      out_dat <- reactive(
        evalute_block(blk(), data = in_dat())
      )

      output$res <- server_output(x, out_dat, output)
      output$code <- server_code(x, blk, output)

      # Cleanup module inputs (UI and server side)
      # and observer
      observeEvent(input$remove, {
        message(sprintf("CLEANING UP BLOCK %s", id))
        remove_shiny_inputs(id = id, input)
        o$destroy()
        session$userData$is_cleaned(TRUE)
      })

      out_dat
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
        evalute_block(blk(), data = in_dat())
      })

      output$plot <- server_output(x, out_dat, output)
      output$code <- server_code(x, blk, output)

      # Cleanup module inputs (UI and server side)
      # and observer
      observeEvent(input$remove, {
        message(sprintf("CLEANING UP BLOCK %s", id))
        remove_shiny_inputs(id = id, input)
        o$destroy()
        session$userData$is_cleaned(TRUE)
      })
    }
  )
}

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
      vals <- reactiveValues(stack = x, blocks = vector("list", length(x)))
      init_blocks(x, vals, session)

      # Add block
      observeEvent(input$add, {
        showModal(
          modalDialog(
            "TO DO: add a confirm button and a select input to select
            which block to add ...",
            title = h3(icon("check"), "Add a new block"),
            footer = modalButton("Dismiss"),
            size = "m",
            easyClose = FALSE,
            fade = TRUE
          )
        )
      })

      observeEvent(input$add, {
        # Update stack
        block_to_add <- if (length(vals$stack) == 0) {
          data_block
        } else {
          filter_block
        }

        vals$stack[[length(vals$stack) + 1]] <- do.call(
          block_to_add,
          if (length(vals$stack) == 0) {
            list()
          } else {
            list(vals$blocks[[length(vals$stack)]]())
          }
        )
        # Call module
        vals$blocks[[length(vals$stack)]] <- generate_server(
          vals$stack[[length(vals$stack)]],
          in_dat = if (length(vals$stack) == 1) {
            # No data for first block
            NULL
          } else {
            # Data from previous block
            vals$blocks[[length(vals$stack) - 1]]
          },
          id = attr(vals$stack[[length(vals$stack)]], "name")
        )

        # Insert UI after last block
        bslib::accordion_panel_insert(
          id = "stack",
          position = "after",
          panel = generate_ui(
            vals$stack[[length(vals$stack)]],
            id = session$ns(attr(vals$stack[[length(vals$stack)]], "name"))
          )
        )
        # Necessary to communicate with downstream modules
        session$userData$stack <- vals$stack
      })

      # Remove block from stack (can't be done within the block)
      to_remove <- reactive({
        req(input$last_changed)
        if (grepl("remove", input$last_changed$name)) {
          req(input$last_changed$value > 0)
        }

        # Retrieve index of block to remove
        blocks_ids <- paste(
          id,
          vapply(vals$stack, \(x) attr(x, "name"), FUN.VALUE = character(1)),
          sep = "-"
        )
        block_id <- strsplit(input$last_changed$name, "-remove")[[1]][1]
        tmp <- which(blocks_ids == block_id)
        req(length(tmp) > 0)
        tmp
      })

      session$userData$is_cleaned <- reactiveVal(FALSE)

      observeEvent({
        c(
          to_remove(),
          session$userData$is_cleaned()
        )
      }, {
        # We can't remove the data block if there are downstream consumers...
        if (to_remove() == 1 && length(vals$stack) > 1) {
          showModal(
            modalDialog(
              title = h3(icon("xmark"), "Error"),
              "Can't remove a datablock whenever there are 
              downstream data block consumers."
            )
          )
        } else {
          if (session$userData$is_cleaned()) {
            message(sprintf("REMOVING BLOCK %s", to_remove()))
            bslib::accordion_panel_remove(
              id = "stack",
              target = sprintf(
                "%s-%s-block",
                id,
                attr(vals$stack[[to_remove()]], "name")
              )
            )
            vals$stack[[to_remove()]] <- NULL
            session$userData$stack <- vals$stack
            session$userData$is_cleaned(FALSE)
          }
        }
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
    vals$blocks[[1L]] <- generate_server(x[[1L]], id = attr(x[[1]], "name"))
    vals$blocks[[2L]] <- generate_server(x[[2L]], in_dat = vals$blocks[[1L]], id = attr(x[[2]], "name"))
    vals$blocks[[3L]] <- generate_server(x[[3L]], in_dat = vals$blocks[[2L]], id = attr(x[[3]], "name"))
    # TO DO: fix recursion issue
    #for (i in seq_along(x)[-1L]) {
    #  vals$blocks[[i]] <- generate_server(
    #    x[[i]],
    #    in_dat = vals$blocks[[i - 1L]],
    #    id = attr(x[[i - 1L]], "name")
    #  )
    #}
  })
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
  DT::renderDT(result())
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
