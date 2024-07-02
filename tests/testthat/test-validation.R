test_that("validation works", {

  expect_null(
    validate_field(
      structure(1L, class = c("field_that_does_not_exist", "field"))
    )
  )

  expect_error(validate_field(structure(1L, class = "not_a_field")),
               class = "no_validator")

  expect_true(is_valid(new_string_field("foo")))
  expect_false(is_valid(new_string_field()))

  expect_null(validate_string("foo", "bar"))
  expect_error(validate_string(character(), "bar"), class = "string_failure")

  expect_null(validate_character("foo", "bar"))
  expect_error(validate_character(character(), "bar"),
               class = "character_failure")

  expect_null(validate_bool(TRUE, "bar"))
  expect_error(validate_bool(logical(), "bar"), class = "bool_failure")

  expect_null(validate_number(1L, "bar"))
  expect_error(validate_number(numeric(), "bar"), class = "number_failure")

  expect_null(validate_range(1L, 0L, 1L))
  expect_error(validate_range(2L, 0L, 1L), class = "range_failure")
})
