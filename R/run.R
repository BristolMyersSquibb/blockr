#' Run app
#'
#' Run a DAG-board app.
#'
#' @param ... Forwarded to [blockr.ui::new_dag_board()]
#'
#' @rdname run_app
#' @export
run_app <- function(...) {
  blockr.core::serve(blockr.ui::new_dag_board(...), "main")
}
