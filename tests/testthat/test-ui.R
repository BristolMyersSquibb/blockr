test_that("data_info works", {
  block <- data_block()
  info <- data_info(block, ns = NS(attr(block, "name")))
  expect_s3_class(info, "shiny.tag")

  plot_block <- function(data, ...) {
    new_block(
      fields = list(),
      expr = quote(identity),
      class = c("ggplot_block", "plot_block"),
      ...
    )
  }

  block <- plot_block()
  info <- data_info(block, ns = NS(attr(block, "name")))
  expect_null(info)
})
