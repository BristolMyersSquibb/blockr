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

#' @rdname generate_server
#' @export
generate_server.block <- function(x, ...) {
  stop("no base-class server for blocks available")
}

#' @rdname generate_server
#' @export
generate_server.data_block <- function(x, ...) {
  fields <- names(x)

  quot_inp <- lapply(fields, quoted_input_entry)

  obs_expr <- splice_args(
    list(..(args)),
    args = quot_inp
  )

  set_expr <- splice_args(
    blk(update_fields(blk(), session, ..(args))),
    args = quoted_input_expression(quot_inp, fields)
  )

  shiny::moduleServer(
    attr(x, "name"),
    function(input, output, session) {
      module_name <- sprintf("module %s %s", class(x)[[1]], attr(x, "name"))

      blk <- shiny::reactiveVal(x)

      shiny::observeEvent(
        obs_expr,
        set_expr,
        event.quoted = TRUE,
        handler.quoted = TRUE,
        ignoreInit = TRUE
      )

      out_dat <- shiny::reactive(
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
  fields <- names(x)

  quot_inp <- lapply(fields, quoted_input_entry)

  obs_expr <- splice_args(
    list(in_dat(), ..(args)),
    args = quot_inp
  )

  set_expr <- splice_args(
    blk(update_fields(blk(), session, in_dat(), ..(args))),
    args = quoted_input_expression(quot_inp, fields)
  )

  shiny::moduleServer(
    attr(x, "name"),
    function(input, output, session) {
      blk <- shiny::reactiveVal(x)

      shiny::observeEvent(
        obs_expr,
        set_expr,
        event.quoted = TRUE,
        handler.quoted = TRUE,
        ignoreInit = TRUE
      )

      out_dat <- shiny::reactive(
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
  output$output <- shiny::renderPrint(result())
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
  output$code <- shiny::renderPrint(
    cat(deparse(generate_code(state())), sep = "\n")
  )

  output
}
