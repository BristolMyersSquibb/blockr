test_that("add_block works", {

  withr::local_options(BLOCKR_LOG_LEVEL = "error")

  stack <- new_stack(data_block) |>
    add_block(select_block)

  expect_length(stack, 2)
  expect_s3_class(stack[[2]], "select_block")

  stack <- add_block(stack, filter_block, 1)

  expect_length(stack, 3)
  expect_s3_class(stack[[2]], "filter_block")
  expect_s3_class(stack[[3]], "select_block")
})
