test_that("stacks", {
  stack <- new_stack(
    new_data_block,
    new_filter_block
  )

  expect_s3_class(stack, "stack")
  expect_type(stack, "list")

  app <- serve_stack(stack)
  expect_s3_class(app, "shiny.appobj")
})

test_that("add_block works", {
  stack <- new_stack(data_block) |>
    add_block(select_block)

  expect_length(stack, 2)
  expect_s3_class(stack[[2]], "select_block")
  stack <- add_block(stack, filter_block, 1)
  expect_length(stack, 3)
  expect_s3_class(stack[[2]], "filter_block")
  expect_s3_class(stack[[3]], "select_block")
})
