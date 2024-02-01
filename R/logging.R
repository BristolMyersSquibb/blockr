#' Log Message
#' @param ... Passed to `cat`
#' @keywords internal
log_message <- function(...) {
  if (!getOption("BLOCKR_DEV", FALSE))
    return()

  cat(..., "\n")
}

log_info <- function(...) {
  log_message(
    "[INFO]",
    ...,
    file = stdout()
  )
}

log_error <- function(...) {
  log_message(
    "[ERROR]",
    ...,
    file = stderr()
  )
}
