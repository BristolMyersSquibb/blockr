#' S3 generic for initialization
#'
#' Checks if a block or field (currently implemented methods)
#' is initialized.
#'
#' @rdname initialize
#' @returns Boolean value.
#' @param x Element to check.
#' @export
is_initialized <- function(x) {
  UseMethod("is_initialized")
}
