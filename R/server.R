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

      blk <- reactiveVal(x)

      observeEvent(
        eval(obs_expr(blk())),
        eval(set_expr(blk())),
        ignoreInit = TRUE
      )

      out_dat <- reactive(
        evalute_block(blk())
      )

      output <- server_output(x, out_dat, output)
      output <- server_code(x, blk, output)

      out_dat
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

      blk <- reactiveVal(x)

      observeEvent(
        eval(obs_expr(blk())),
        eval(set_expr(blk())),
        ignoreInit = TRUE
      )

      out_dat <- reactive(
        evalute_block(blk(), data = in_dat())
      )

      output <- server_output(x, out_dat, output)
      output <- server_code(x, blk, output)

      out_dat
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
      ns <- session$ns
      vals <- reactiveValues(blocks = vector("list", length(x)))
      init_blocks(x, vals)

      # Add block
      observeEvent(input$add, {
        showModal(
          modalDialog(
            selectInput(
              ns("block_to_add"),
              "Which block do you want to add?",
              choices = c("filter") # TO DO: don't hardcode this
            ),
            title = "Add a new block",
            footer = modalButton("Dismiss"),
            size = "m",
            easyClose = FALSE,
            fade = TRUE
          )
        )
      })

      observeEvent(input$block_to_add, {
        # Update stack
        x[[length(x) + 1]] <- do.call(
          filter_block,
          list(vals$blocks[[length(x)]]())
        )
        # Call module
        vals$blocks[[length(x)]] <- generate_server(
          x[[length(x)]],
          in_dat = vals$blocks[[length(x) - 1]]
        )

        # Insert UI after last block
        insertUI(
          sprintf(
            "#%s-%s-block",
            attr(x, "name"),
            attr(x[[length(x) - 1]], "name")
          ),
          where = "afterEnd",
          ui = generate_ui(
            x[[length(x)]],
            id = attr(x[[length(x)]], "name")
          )
        )
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
        in_dat = vals$blocks[[i - 1L]]
      )
    }
  })
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
