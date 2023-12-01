#' Head block
#'
#' An example of a "head" block intendet to show the first n rows a a table.
#'
#' @param data Tabular data to filter (rows)
#' @param n_rows Number of rows to return.
#'
#' @export
new_head_block <- function(data, n_rows = numeric()) {

  blockr::new_block(
    fields = list(
      n_rows = blockr::new_numeric_field(n_rows, 1L, 100L)
    ),
    expr = quote(head(n = .(n_rows))),
    class = c("head_block", "transform_block")
  )
}
