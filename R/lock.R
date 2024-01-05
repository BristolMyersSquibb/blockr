#' Lock
#'
#' Lock edit of stacks and blocks.
#'
#' @param session Shiny session.
#' @param fn Callback function to run when the
#' editing locked/unlocked. It must accept a single
#' argument, which is a boolean indicating whether
#' the editing is locked or not.
#' @param ... passed to [shiny::observeEvent()].
#'
#' @name lock
#'
#' @export
lock <- function(
  session = shiny::getDefaultReactiveDomain()
) {
  init_lock(session)
  session$userData$locked(TRUE)
}

#' @rdname lock
#' @export
unlock <- function(
  session = shiny::getDefaultReactiveDomain()
) {
  init_lock(session)
  session$userData$locked(FALSE)
}

#' @rdname lock
#' @export
toggle_lock <- function(
  session = shiny::getDefaultReactiveDomain()
) {
  init_lock(session)
  session$userData$locked(!session$userData$locked())
}

#' @rdname lock
#' @export
is_locked <- function(
  session = shiny::getDefaultReactiveDomain()
) {
  init_lock(session)
  session$userData$locked()
}

#' @rdname lock
#' @export
observe_lock <- function(
  fn,
  ...,
  session = shiny::getDefaultReactiveDomain()
) {
  init_lock(session)

  observeEvent(
    session$userData$locked(),
    fn(session$userData$locked()),
    ...
  )
}

init_lock <- function(
  session = shiny::getDefaultReactiveDomain()
) {
  if ("locked" %in% names(session$userData))
    return()

  session$userData$locked <- reactiveVal(FALSE)
  observeEvent(session$userData$locked(), {
    session$sendCustomMessage("lock", list(locked = session$userData$locked()))
  }, ignoreInit = TRUE)
}
