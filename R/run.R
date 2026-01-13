#' Run app
#'
#' Run a DAG-board app.
#'
#' @param ...,extensions Forwarded to [blockr.dock::new_dock_board()]
#' @inheritParams blockr.core::serve
#'
#' @examples
#' if (interactive()) {
#'   run_app(
#'     blocks = c(
#'       a = new_dataset_block("iris")
#'     )
#'   )
#' }
#'
#' @return Acting a a wrapper to [blockr.core::serve()], the result of a call
#' to [shiny::shinyApp()] is returned.
#'
#' @rdname run_app
#' @export
run_app <- function(..., extensions = new_dag_extension(),
                    id = rand_names()) {

  prev <- options(g6R.layout_on_data_change = TRUE)
  on.exit(do.call(options, prev))

  serve(
    new_dock_board(..., extensions = extensions),
    id = id
  )
}
