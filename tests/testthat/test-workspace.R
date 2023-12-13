test_that("workspace", {

  expect_s3_class(get_workspace(), "workspace")

  stack1 <- new_stack(
    new_data_block,
    new_filter_block
  )

  set_workspace(stack1 = stack1)

  expect_length(get_workspace_stacks(), 1L)
  expect_identical(get_workspace_title(), "")
  expect_identical(get_workspace_settings(), list())
  expect_identical(list_workspace_stacks(), "stack1")
  expect_s3_class(get_workspace_stack("stack1"), "stack")

  stack2 <- new_stack(
    new_data_block,
    new_select_block
  )

  add_workpace_stack("stack2", stack2)

  expect_length(get_workspace_stacks(), 2L)
  expect_identical(get_workspace_title(), "")
  expect_identical(get_workspace_settings(), list())
  expect_setequal(list_workspace_stacks(), c("stack1", "stack2"))
  expect_s3_class(get_workspace_stack("stack1"), "stack")
  expect_s3_class(get_workspace_stack("stack2"), "stack")

  rm_workspace_stack("stack2")

  expect_length(get_workspace_stacks(), 1L)
  expect_identical(get_workspace_title(), "")
  expect_identical(get_workspace_settings(), list())
  expect_identical(list_workspace_stacks(), "stack1")
  expect_s3_class(get_workspace_stack("stack1"), "stack")

  clear_workspace_stacks(TRUE)

  set_workspace(stack1 = stack1, stack2 = stack2)

  expect_length(get_workspace_stacks(), 2L)
  expect_identical(get_workspace_title(), "")
  expect_identical(get_workspace_settings(), list())
  expect_setequal(list_workspace_stacks(), c("stack1", "stack2"))
  expect_s3_class(get_workspace_stack("stack1"), "stack")
  expect_s3_class(get_workspace_stack("stack2"), "stack")

  set_workspace_title("foo")
  expect_identical(get_workspace_title(), "foo")

  set_workspace_settings(list(foo = "bar"))
  expect_identical(get_workspace_settings(), list(foo = "bar"))

  set_workspace_settings("{\"foo\": \"bar\"}")
  expect_identical(get_workspace_settings(), list(foo = "bar"))

  clear_workspace_stacks(TRUE)

  set_workspace(stack1, stack2)

  nms <- list_workspace_stacks()

  expect_type(nms, "character")
  expect_length(nms, 2L)
})
