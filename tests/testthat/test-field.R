test_that("string fields", {

  field <- string_field("foo")

  expect_s3_class(field, "string_field")
  expect_type(field, "character")

  expect_error(string_field(1))
})

test_that("select fields", {

  field <- select_field("a", letters)

  expect_s3_class(field, "select_field")
  expect_type(field, "character")

  expect_error(select_field("aa", letters))
})
