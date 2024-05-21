test_that("string fields", {

  field <- new_string_field("foo")

  expect_s3_class(field, "string_field")
  expect_identical(value(field), "foo")

  value(field) <- "bar"

  expect_identical(value(field), "bar")

  expect_null(validate_field(field))

  expect_error(
    validate_field(new_string_field(1)),
    class = "string_failure"
  )
})

test_that("select fields", {

  field <- new_select_field("a", letters)

  expect_s3_class(field, "select_field")
  expect_identical(value(field), "a")

  expect_null(validate_field(field))

  value(field, "choices") <- LETTERS

  expect_error(
    validate_field(field),
    class = "enum_failure"
  )

  expect_error(
    validate_field(new_select_field(1, letters)),
    class = "string_failure"
  )
})

test_that("range fields", {

  field <- new_range_field(c(2, 4), min = 0, max = 10)

  expect_s3_class(field, "range_field")
  expect_identical(value(field), c(2, 4))

  expect_null(validate_field(field))

  value(field, "max") <- 3

  expect_error(
    validate_field(field),
    class = "range_failure"
  )
})

test_that("numeric fields", {

  field <- new_numeric_field(2, min = 0, max = 10)

  expect_s3_class(field, "numeric_field")
  expect_identical(value(field), 2)

  expect_null(validate_field(field))

  value(field, "max") <- 3

  expect_null(validate_field(field))

  value(field, "max") <- 1

  expect_error(
    validate_field(field),
    class = "range_failure"
  )
})

test_that("submit fields", {

  field <- new_submit_field()

  expect_s3_class(field, "submit_field")
  expect_identical(value(field), 0)

  expect_null(validate_field(field))

  value(field) <- "foo"

  expect_null(validate_field(field))
  expect_identical(value(field), "foo")
})

test_that("switch field", {

  field <- new_switch_field()

  expect_s3_class(field, "switch_field")
  expect_identical(value(field), FALSE)

  expect_null(validate_field(field))

  value(field) <- TRUE

  expect_null(validate_field(field))
  expect_identical(value(field), TRUE)

  value(field) <- "foo"

  expect_error(
    validate_field(field),
    class = "bool_failure"
  )
})

test_that("upload field", {

  path <- withr::local_tempfile()
  write.csv(datasets::iris, path, row.names = FALSE)

  field <- new_upload_field("iris.csv")

  expect_s3_class(field, "upload_field")
  expect_identical(value(field), "iris.csv")

  expect_error(
    validate_field(field),
    class = "file_failure"
  )

  value(field) <- data.frame(datapath = path)

  expect_identical(value(field), path)
  expect_null(validate_field(field))
})

test_that("filesbrowser field", {

  path <- withr::local_tempfile()
  write.csv(datasets::iris, path, row.names = FALSE)

  field <- new_filesbrowser_field("iris.csv", c(vol = dirname(path)))

  expect_s3_class(field, "filesbrowser_field")
  expect_identical(value(field), "iris.csv")
  expect_identical(value(field, "volumes"), c(vol = dirname(path)))

  expect_error(
    validate_field(field),
    class = "file_failure"
  )

  value(field) <- data.frame(root = "vol", files = basename(path))

  expect_null(validate_field(field))
})

test_that("field name", {
  blk <- new_dataset_block("iris")
  expect_equal(get_field_names(blk), c("package", "Dataset"))

  expect_equal(get_field_name(new_switch_field(), "xxx"), "xxx")
  expect_equal(get_field_name(new_switch_field(title = "xxx"), ""), "xxx")
})
