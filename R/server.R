#' UI
#'
#' Generic for UI generation
#'
#' @param x Object for which to generate a [shiny::moduleServer()]
#' @param ... Generic consistency
#'
#' @export
generate_server <- function(x, ...) {
  UseMethod("generate_server")
}

#' @param in_dat Forwarded to `evalute_block()`
#' @rdname generate_server
#' @export
generate_server.block <- function(x, in_dat = NULL, ...) {

  fields <- names(x)

  quot_inp <- lapply(fields, quoted_input_entry)

  obs_expr <- splice_args(
    list(..(args)),
    args = quot_inp
  )

  set_expr <- splice_args(
    blk(set_field_values(blk(), ..(args))),
    args = quoted_input_expression(quot_inp, fields)
  )

  shiny::moduleServer(
    attr(x, "name"),
    function(input, output, session) {

      blk <- shiny::reactiveVal(x)

      if (not_null(in_dat)) {
        shiny::observeEvent(
          in_dat(),
          blk(
            update_fields(blk(), data = in_dat(), session = session)
          ),
          ignoreInit = TRUE
        )
      }

      shiny::observeEvent(
        obs_expr,
        set_expr,
        event.quoted = TRUE,
        handler.quoted = TRUE,
        ignoreInit = TRUE
      )

      if (is.null(in_dat)) {
        out_dat <- shiny::reactive(
          evalute_block(blk())
        )
      } else {
        out_dat <- shiny::reactive(
          evalute_block(blk(), data = in_dat())
        )
      }

      output$data <- shiny::renderPrint(out_dat())
      output$code <- shiny::renderPrint(
        cat(deparse(generate_code(blk())), sep = "\n")
      )

      out_dat
    }
  )
}

#' @rdname generate_server
#' @export
generate_server.stack <- function(x, ...) {

  stopifnot(...length() == 0L)

  shiny::moduleServer(
    attr(x, "name"),
    function(input, output, session) {

      res <- vector("list", length(x))

      res[[1L]] <- generate_server(x[[1L]])

      for (i in seq_along(x)[-1L]) {
        res[[i]] <- generate_server(x[[i]], in_dat = res[[i - 1L]])
      }

      res
    }
  )
}
