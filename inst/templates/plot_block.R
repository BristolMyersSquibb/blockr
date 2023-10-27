#' NAME
#'
#' A new plot block.
#'
#' @export
NAME_block <- function(data, ...) {
  all_cols <- function(data) colnames(data)

  fields <- list(
    x_var = new_select_field("VISIT", all_cols),
    y_var = new_select_field("MEAN", all_cols)
  )

  new_block(
    fields = fields,
    expr = quote({
      ggplot(
        data,
        mapping = aes_string(
          x = .(x_var),
          y = .(y_var)
        )
      ) +
        geom_point() +
        geom_line()
    }),
    ...,
    class = c("NAME_block", "plot_block")
  )
}
