test_that("json", {

  x <- new_string_field("foo")

  expect_identical(from_json(to_json(x)), x)
})
