#' Dummy block
#'
#' An example of a "Dummy" block.
#'
#' @param data Tabular data.
#'
#' @export
new_dummy_block <- function(data) {

  blockr::new_block(
    fields = list(),
    expr = quote(identity),
    class = c("dummy_block", "transform_block")
  )
}
