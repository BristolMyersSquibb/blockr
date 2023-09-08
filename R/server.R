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

  inp_expr <- set_names(
    lapply(fields, function(x) bquote(input[[.(val)]], list(val = x))),
    fields
  )

  set_expr <- bquote(
    set_field_values(prv(), ..(args)),
    list(args = do.call(expression, inp_expr)),
    splice = TRUE
  )

  shiny::moduleServer(
    attr(x, "name"),
    function(input, output, session) {

      if (not_null(in_dat)) {
        prv <- shiny::reactive(
          update_fields(x, data = in_dat(), session = session)
        )
      } else {
        prv <- shiny::reactiveVal(x)
      }

      cur <- shiny::reactive(set_expr, quoted = TRUE)

      if (is.null(in_dat)) {
        out_dat <- shiny::reactive(
          evalute_block(cur())
        )
      } else {
        out_dat <- shiny::reactive(
          evalute_block(cur(), data = in_dat())
        )
      }

      output$data <- shiny::renderPrint(out_dat())
      output$code <- shiny::renderPrint(
        cat(deparse(generate_code(cur())), sep = "\n")
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
