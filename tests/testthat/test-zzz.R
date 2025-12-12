test_that("zzz utils work", {

  expect_false(is_attached("some_imaginary_package"))
  expect_true(is_attached("blockr"))

  expect_type(is_loading_for_tests(), "logical")
  expect_length(is_loading_for_tests(), 1L)

  expect_null(inform_startup(NULL))

  withr::with_options(
    list(blockr.quiet = TRUE),
    expect_null(inform_startup(NULL))
  )
})
