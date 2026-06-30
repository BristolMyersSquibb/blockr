#' Run app
#'
#' Run a DAG-board app.
#'
#' @param ...,extensions Forwarded to [blockr.dock::new_dock_board()]
#' @param plugins Plugin(s) to merge over the board defaults via
#'   [blockr.core::custom_plugins()] (a single plugin, a list, or a `plugins`
#'   object). Defaults to [blockr.session::manage_project()], which swaps
#'   pins-based session management in for the core `preserve_board` plugin. Pass
#'   `plugins = NULL` to keep the plain file upload / download mechanism.
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
                    plugins = blockr.session::manage_project(),
                    id = rand_names()) {

  prev <- options(g6R.layout_on_data_change = TRUE)
  on.exit(do.call(options, prev))

  # Use the blockr.ui HTML table preview for data / transform block outputs.
  # Set without on.exit restore on purpose: block previews read this option at
  # render time, i.e. once the returned app object is actually served - by then
  # this call (and any on.exit) has long returned.
  options(blockr.html_table_preview = TRUE)

  serve(
    new_dock_board(..., extensions = extensions),
    id = id,
    plugins = if (is.null(plugins)) blockr_app_plugins else custom_plugins(plugins)
  )
}
