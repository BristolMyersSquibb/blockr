test_that("string fields", {

  field <- string_field("foo")

  expect_s3_class(field, "string_field")
  expect_type(field, "list")
  expect_identical(value(field), "foo")

  field <- string_field(1)

  expect_s3_class(field, "string_field")
  expect_type(field, "list")
  expect_identical(value(field), "")
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

  field <- select_field(1, letters)

  expect_s3_class(field, "select_field")
  expect_type(field, "list")
  expect_identical(value(field), "a")
})

test_that("range fields", {

  field <- range_field(min = 0, max = 10)

  expect_s3_class(field, "range_field")
  expect_type(field, "list")
  expect_identical(value(field), c(0, 10))
})

test_that("numeric fields", {

  field <- numeric_field(min = 0, max = 10)

  expect_s3_class(field, "numeric_field")
  expect_type(field, "list")
  expect_identical(value(field), 0)

  field <- numeric_field(value = 200, min = 0, max = 10)
  expect_identical(value(field), 10)

  field <- numeric_field(value = -10, min = 0, max = 10)
  expect_identical(value(field), 0)
})
