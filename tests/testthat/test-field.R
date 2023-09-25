test_that("string fields", {

  field <- string_field("foo")

  expect_s3_class(field, "string_field")
  expect_type(field, "list")

  expect_error(string_field(1))
})

test_that("select fields", {

  field <- select_field("a", letters)

  expect_s3_class(field, "select_field")
  expect_type(field, "list")
  expect_identical(value(field), "a")

  field <- select_field("aa", letters)

  expect_s3_class(field, "select_field")
  expect_type(field, "list")
  expect_identical(value(field), "a")

  expect_error(select_field(1, letters))
})
