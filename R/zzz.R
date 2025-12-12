.onAttach <- function(...) { # nocov start

  if (is_loading_for_tests()) {
    return(invisible())
  }

  attached <- blockr_attach()
  inform_startup(blockr_attach_message(attached))
} # nocov end

is_attached <- function(x) {
  paste0("package:", x) %in% search()
}

is_loading_for_tests <- function() {
  !interactive() && identical(Sys.getenv("DEVTOOLS_LOAD"), "blockr")
}

inform_startup <- function(msg, ...) {

  if (is.null(msg)) {
    return()
  }
  if (isTRUE(getOption("blockr.quiet"))) {
    return()
  }

  rlang::inform(msg, ..., class = "packageStartupMessage")
}
