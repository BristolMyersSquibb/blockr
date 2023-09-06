test_that("data blocks", {

  block <- new_data_block()

  expect_s3_class(block, "data_block")
  expect_type(block, "environment")

  dat <- evalute_block(block)

  expect_s3_class(dat, "data.frame")

  ui <- generate_ui(block, "foo")

  expect_type(ui, "list")
  expect_s3_class(ui, "shiny.tag")
})

test_that("filter blocks", {

  block <- new_filter_block(datasets::iris)

  expect_s3_class(block, "filter_block")
  expect_type(block, "environment")

  block <- new_filter_block(datasets::iris, "Species", "setosa")

  res <- evalute_block(block, datasets::iris)

  expect_identical(nrow(res), 50L)
})
