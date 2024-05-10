test_that("block ui can be created", {

  blk1 <- new_dataset_block(selected = "iris")

  ui <- generate_ui(blk1, "foo")

  expect_type(ui, "list")
  expect_s3_class(ui, "shiny.tag")

  withr::local_file(
    list(iris = write.csv(iris, "iris.csv", row.names = FALSE))
  )

  blk2 <- new_upload_block("iris.csv")

  ui <- generate_ui(blk2, "foo")

  expect_type(ui, "list")
  expect_s3_class(ui, "shiny.tag")

  blk3 <- new_filesbrowser_block("iris.csv")

  ui <- generate_ui(blk3, "foo")

  expect_type(ui, "list")
  expect_s3_class(ui, "shiny.tag")

  shinyFiles_ui <- htmltools::tagQuery(ui)$
    find(".shinyFiles")$
    selectedTags()

  expect_length(shinyFiles_ui, 1)
})

test_that("data_info works", {
  block <- new_dataset_block()
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
