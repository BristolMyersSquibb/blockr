#' Run app
#'
#' Run a DAG-board app.
#'
#' @param ...,extensions Forwarded to [blockr.dock::new_dock_board()]
#' @param plugins Forwarded to [blockr.core::serve()]. The default swaps
#'   [blockr.session::manage_project()] in for the core `preserve_board`
#'   plugin. Pass `blockr_app_plugins` for the core file upload and download.
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
                    plugins = custom_plugins(blockr.session::manage_project()),
                    id = rand_names()) {

  prev <- options(g6R.layout_on_data_change = TRUE)
  on.exit(do.call(options, prev))

  # Block previews read this option when the app is served, after run_app()
  # has returned, so it is not restored on exit.
  options(blockr.tabular_display = blockr.ui::html_table_display)

  serve(
    new_dock_board(..., extensions = extensions),
    id = id,
    plugins = plugins
  )
}
