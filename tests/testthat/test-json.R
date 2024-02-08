test_that("json ser/deser for fields", {

  x <- new_string_field("foo")

  expect_identical(from_json(to_json(x)), x)

  y <- new_select_field("a", letters)

  expect_identical(from_json(to_json(y)), y)
})

test_that("json ser/deser for blocks", {

  x <- new_data_block("")

  expect_identical(from_json(to_json(x)), x)
})

test_that("json ser/deser for stacks", {

  x <- new_stack(
    new_data_block,
    new_filter_block
  )

  expect_identical(from_json(to_json(x)), x, ignore_function_env = TRUE)
})

test_that("json ser/deser for the workspace", {

  withr::defer(clear_workspace_stacks())

  x <- new_stack(
    new_data_block,
    new_filter_block
  )

  set_workspace(stack = x)
  set_workspace_title("foo")
  set_workspace_settings("{\"foo\": \"bar\"}")

  res <- from_json(to_json())

  clear_workspace_stacks()

  expect_type(res, "list")
  expect_named(res, c("stack", "title", "settings"))

  expect_identical(res[["stack"]], x, ignore_function_env = TRUE)

  restore_workspace(res)

  expect_identical(list_workspace_stacks(), "stack", ignore_function_env = TRUE)
})
