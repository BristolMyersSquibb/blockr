#' NAME
#' 
#' A new transform block.
#' 
#' @export
NAME_block <- function(data, ...){
  fields <- list(
    n_rows = new_numeric_field(10, 10, nrow(data))
  )

  new_block(
    fields = fields,
    expr = quote({
      head(data, .(n_rows))
    }),
    ...,
    class = c("NAME_block", "transform_block")
  )
}
