#' Run app
#'
#' Run a DAG-board app.
#'
#' @param ...,extensions Forwarded to [blockr.dock::new_dock_board()]
#' @inheritParams blockr.core::serve
#'
#' @rdname run_app
#' @export
run_app <- function(..., extensions = new_dag_extension(),
                    id = rand_names()) {
  serve(
    new_dock_board(..., extensions = extensions),
    id = id
  )
}
