#' Logging
#'
#' Infrastructure for logging messages.
#'
#' @param ... Concatenated as `paste0(..., "\n")`
#' @param level Logging level (possible values are "fatal", "error", "warn",
#'   "info", "debug" and "trace"
#'
#' @export
write_log <- function(..., level = "info") {

  lvl <- as_log_level(level)

  if (lvl > get_log_level()) {
    return(invisible(NULL))
  }

  logger <- get_logger()

  msg <- paste0(
    "[", toupper(level), "]",
    "[", Sys.time(), "]",
    "[", get_mem_use(), "]",
    " ", ...
  )

  logger(msg, level = lvl)

  invisible(NULL)
}

get_mem_use <- function() {

  mem <- memuse::Sys.procmem()

  if (is.null(mem$peak)) {
    peak <- NULL
  } else {
    peak <- paste0("/", mem$peak)
  }

  paste0(mem$size, peak)
}

#' @rdname write_log
#' @export
log_fatal <- function(...) write_log(..., level = "fatal")

#' @rdname write_log
#' @export
log_error <- function(...) write_log(..., level = "error")

#' @rdname write_log
#' @export
log_warn <- function(...) write_log(..., level = "warn")

#' @rdname write_log
#' @export
log_info <- function(...) write_log(..., level = "info")

#' @rdname write_log
#' @export
log_debug <- function(...) write_log(..., level = "debug")

#' @rdname write_log
#' @export
log_trace <- function(...) write_log(..., level = "trace")

#' @rdname write_log
#' @export
as_log_level <- function(level) {

  log_levels <- c("fatal", "error", "warn", "info", "debug", "trace")

  ordered(match.arg(level, log_levels), log_levels)
}

fatal_log_level <- as_log_level("fatal")

error_log_level <- as_log_level("error")

warn_log_level <- as_log_level("warn")

info_log_level <- as_log_level("info")

debug_log_level <- as_log_level("debug")

trace_log_level <- as_log_level("fatal")

get_log_level <- function() {

  if (getOption("BLOCKR_DEV", FALSE)) {
    default_level <- "debug"
  } else {
    default_level <- "info"
  }

  as_log_level(
    getOption("BLOCKR_LOG_LEVEL", default_level)
  )
}

get_logger <- function() getOption("BLOCKR_LOGGER", default_logger)

default_logger <- function(msg, level) {

  if (level == fatal_log_level) {
    stop(msg, call. = FALSE)
  }

  if (level <= warn_log_level) {
    warning(msg, call. = FALSE)
  } else {
    message(msg)
  }
}
