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

  expect_identical(from_json(to_json(x)), x)
})
