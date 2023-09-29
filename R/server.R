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
generate_server.data_block <- function(x, ...) {

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
    attr(x, "name"),
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

      output <- server_output(x, out_dat, output)
      output <- server_code(x, blk, output)

      # Cleanup module inputs (UI and server side)
      # and observer
      observeEvent(input$remove, {
        message(sprintf("CLEANING UP BLOCK %s", attr(x, "name")))
        removeUI(sprintf("#%s", ns("block")), immediate = TRUE)
        remove_shiny_inputs(id = attr(x, "name"), input)
        o$destroy()
      })

      list(dat = out_dat, remove = reactive(input$remove))
    }
  )
}

#' @param in_dat Reactive input data
#' @rdname generate_server
#' @export
generate_server.transform_block <- function(x, in_dat, ...) {

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
    attr(x, "name"),
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

      output <- server_output(x, out_dat, output)
      output <- server_code(x, blk, output)

      # Cleanup module inputs (UI and server side)
      # and observer
      observeEvent(input$remove, {
        message(sprintf("CLEANING UP BLOCK %s", attr(x, "name")))
        removeUI(sprintf("#%s", ns("block")), immediate = TRUE)
        remove_shiny_inputs(id = attr(x, "name"), input)
        o$destroy()
      })

      list(dat = out_dat, remove = reactive(input$remove))
    }
  )
}

#' @rdname generate_server
#' @export
generate_server.stack <- function(x, ...) {

  stopifnot(...length() == 0L)

  moduleServer(
    attr(x, "name"),
    function(input, output, session) {
      vals <- reactiveValues(blocks = vector("list", length(x)))
      init_blocks(x, vals)

      # Add block
      observeEvent(input$add, {
        showModal(
          modalDialog(
            "TO DO: add a confirm button and a select input to select
            which block to add ...",
            title = "Add a new block",
            footer = modalButton("Dismiss"),
            size = "m",
            easyClose = FALSE,
            fade = TRUE
          )
        )
      })

      observeEvent(input$add, {
        # Update stack
        block_to_add <- if (length(x) == 0) {
          data_block
        } else {
          filter_block
        }
        x[[length(x) + 1]] <- do.call(
          block_to_add,
          list(vals$blocks[[length(x)]]$dat())
        )
        # Call module
        vals$blocks[[length(x)]] <- generate_server(
          x[[length(x)]],
          in_dat = vals$blocks[[length(x) - 1]]$dat
        )

        # Correct selector
        if (length(x) == 1) {
          # If this is the first module inserted,
          # we target the body container.
          # TO DO: we should actually have a proper UI for the stack
          # to avoid targeting .container-fluid ...
          selector <- ".container-fluid"
        } else {
          # Target the previous block
          selector <- sprintf(
            "#%s-%s-block",
            attr(x, "name"),
            attr(x[[length(x) - 1]], "name")
          )
        }

        # Insert UI after last block
        insertUI(
          selector,
          where = "afterEnd",
          ui = generate_ui(
            x[[length(x)]],
            id = attr(x, "name")
          )
        )
      })

      # Remove block from stack (can't be done within the block)
      to_remove <- NULL
      observeEvent({
        lapply(seq_along(vals$blocks), function(i) {
          to_remove <<- i
          tmp <- vals$blocks[[i]]
          req(tmp[["remove"]]() > 0)
        })
      }, {
        message(sprintf("REMOVING BLOCK %s", to_remove))
        x[[to_remove]] <- NULL
      })

      vals

    }
  )
}

init_blocks <- function(x, vals) {
  observeEvent(TRUE, {
    vals$blocks[[1L]] <- generate_server(x[[1L]])
    for (i in seq_along(x)[-1L]) {
      vals$blocks[[i]] <- generate_server(
        x[[i]],
        in_dat = vals$blocks[[i - 1L]]$dat
      )
    }
  })
}

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
  output$output <- renderPrint(result())
  output
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

  output$code <- renderPrint(
    cat(deparse(generate_code(state())), sep = "\n")
  )

  output
}
