#' Run app
#'
#' Run a DAG-board app.
#'
#' @param ...,extensions Forwarded to [blockr.dock::new_dock_board()]
#'
#' @rdname run_app
#' @export
run_app <- function(..., extensions = blockr.dag::new_dag_extension()) {
  blockr.core::serve(
    blockr.dock::new_dock_board(..., extensions = extensions),
    "main"
  )
}
