test_that("stacks", {

  stack <- new_stack(new_data_block())

  expect_s3_class(stack, "stack")
  expect_type(stack, "list")
})
