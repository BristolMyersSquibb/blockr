#' UI
#'
#' Generic for UI generation
#'
#' @param x Object for which to generate UI components
#' @param ... Generic consistency
#'
#' @export
generate_server <- function(x, ...) {
  UseMethod("generate_ui")
}

#' @param id UI IDs
#' @rdname generate_server
#' @export
generate_server.block <- function(x, id, ...) {

  stopifnot(...length() == 0L)

  shiny::moduleServer(
    id,
    function(input, output, session) {
      browser()
    }
  )
}

#' @rdname generate_server
#' @export
generate_server.stack <- function(x, id, ...) {

  stopifnot(...length() == 0L)

  shiny::moduleServer(
    id,
    function(input, output, session) {
      eapply(x, generate_server, id = attr(x, "name"))
    }
  )
}
