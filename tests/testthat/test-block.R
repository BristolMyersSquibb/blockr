test_that("data blocks", {

  block <- data_block()

  expect_s3_class(block, "data_block")
  expect_type(block, "list")

  dat <- evaluate_block(block)

  expect_s3_class(dat, "data.frame")

  ui <- generate_ui(block, "foo")

  expect_type(ui, "list")
  expect_s3_class(ui, "shiny.tag.list")
})

test_that("filter blocks", {

  data <- datasets::iris

  block <- filter_block(data)

  expect_s3_class(block, "filter_block")
  expect_type(block, "list")

  res <- evaluate_block(block, data)

  expect_identical(nrow(res), nrow(data))

  block <- filter_block(data, "Species", "setosa")

  res <- evaluate_block(block, data)

  expect_identical(nrow(res), nrow(data[data$Species == "setosa", ]))
})
