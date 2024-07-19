test_that("string fields", {

  field <- new_string_field("foo")

  expect_s3_class(field, "string_field")
  expect_identical(field_value(field), "foo")

  field <- update_field(field, "bar")

  expect_identical(field_value(field), "bar")

  expect_null(validate_field(field))

  expect_error(
    validate_field(new_string_field(1)),
    class = "string_failure"
  )
})

test_that("select fields", {

  field <- new_select_field("a", letters)

  expect_s3_class(field, "select_field")
  expect_identical(field_value(field), "a")

  expect_null(validate_field(field))

  field <- update_field(field, "A")

  expect_error(
    validate_field(field),
    class = "enum_failure"
  )

  expect_error(
    validate_field(new_select_field(1, letters)),
    class = "string_failure"
  )

  expect_error(
    validate_field(new_select_field(1:3, LETTERS, multiple = TRUE)),
    class = "character_failure"
  )

  foo_cols <- function(foo) colnames(foo)

  field <- new_select_field(choices = foo_cols)
  field <- update_field(field, "cyl", list(foo = datasets::mtcars))

  expect_null(validate_field(field))
  expect_identical(field_value(field), "cyl")
})

test_that("range fields", {

  field <- new_range_field(c(2, 4), min = 0, max = 10)

  expect_s3_class(field, "range_field")
  expect_identical(field_value(field), c(2, 4))

  expect_null(validate_field(field))

  field <- update_field(field, c(-2, 4))

  expect_error(
    validate_field(field),
    class = "range_failure"
  )
})

test_that("numeric fields", {

  field <- new_numeric_field(2, min = 0, max = 10)

  expect_s3_class(field, "numeric_field")
  expect_identical(field_value(field), 2)

  expect_null(validate_field(field))

  field <- update_field(field, 3)

  expect_null(validate_field(field))

  field <- update_field(field, -1)

  expect_error(
    validate_field(field),
    class = "range_failure"
  )

  field <- update_field(field, "test")

  expect_error(
    validate_field(field),
    class = "number_failure"
  )
})

test_that("submit fields", {

  field <- new_submit_field()

  expect_s3_class(field, "submit_field")
  expect_identical(field_value(field), 0)

  expect_null(validate_field(field))

  field <- update_field(field, "foo")

  expect_null(validate_field(field))
  expect_identical(field_value(field), "foo")
})

test_that("switch field", {

  field <- new_switch_field()

  expect_s3_class(field, "switch_field")
  expect_identical(field_value(field), FALSE)

  expect_null(validate_field(field))

  field <- update_field(field, TRUE)

  expect_null(validate_field(field))
  expect_identical(field_value(field), TRUE)

  field <- update_field(field, "foo")

  expect_error(
    validate_field(field),
    class = "bool_failure"
  )
})

test_that("upload field", {

  field <- new_upload_field("iris.csv")

  expect_s3_class(field, "upload_field")
  expect_identical(field_value(field), "iris.csv")

  if (!file.exists("iris.csv")) {
    expect_error(
      validate_field(field),
      class = "file_failure"
    )
  }

  path <- withr::local_tempfile()
  write.csv(datasets::iris, path, row.names = FALSE)

  field <- update_field(field, data.frame(datapath = path))

  expect_identical(field_value(field), path)
  expect_null(validate_field(field))
})

test_that("filesbrowser field", {

  path <- withr::local_tempfile()

  field <- new_filesbrowser_field("iris.csv", c(vol = dirname(path)))

  expect_s3_class(field, "filesbrowser_field")
  expect_identical(field_value(field), "iris.csv")
  expect_identical(field_component(field, "volumes"), c(vol = dirname(path)))

  if (!file.exists(file.path(dirname(path), "iris.csv"))) {
    expect_error(
      validate_field(field),
      class = "file_failure"
    )
  }

  write.csv(datasets::iris, path, row.names = FALSE)

  field <- update_field(field, data.frame(root = "vol", files = basename(path)))

  expect_null(validate_field(field))
})

test_that("variable field", {

  field <- new_variable_field("string_field", "foo")

  expect_s3_class(field, "variable_field")
  expect_identical(field_value(field), "foo")
  expect_null(validate_field(field))

  field <- update_field(field, "bar")

  expect_identical(field_value(field), "bar")
  expect_null(validate_field(field))

  field <- update_field(field, 1L)

  expect_error(
    validate_field(field),
    class = "string_failure"
  )

  foo_cols <- function(foo) colnames(foo)

  field <- new_variable_field("select_field", list(choices = foo_cols))
  field <- update_field(field, "cyl", list(foo = datasets::mtcars))

  expect_null(validate_field(field))
  expect_identical(field_value(field), "cyl")

  foo_type <- function(foo) {
    switch(typeof(foo), integer = "numeric_field", character = "select_field")
  }

  foo_arg <- function(foo) {
    switch(
      typeof(foo),
      integer = list(min = function(foo) min(foo),
                     max = function(foo) max(foo)),
      character = list(choices = function(foo) unique(foo))
    )
  }

  field <- new_variable_field(foo_type, foo_arg)
  field <- update_field(field, 3L, list(foo = seq.int(2, 5)))

  expect_null(validate_field(field))
  expect_identical(field_value(field), 3L)

  field <- update_field(field, "b", list(foo = c("a", "a", "b")))

  expect_null(validate_field(field))
  expect_identical(field_value(field), "b")

  field <- update_field_components(field, list(foo = c("a", "a", "b", "c")))

  expect_null(validate_field(field))
  expect_identical(field_value(field), "b")
})

test_that("list field", {

  field <- new_list_field("string_field", "foo", name = "test")

  expect_s3_class(field, "list_field")
  expect_identical(field_value(field), list(test = "foo"))
  expect_null(validate_field(field))

  field <- update_field(field, "bar")

  expect_identical(field_value(field), list(test = "bar"))
  expect_null(validate_field(field))

  field <- new_list_field(
    c("string_field", "numeric_field"),
    list("foo", c(3, 0, 10)),
    name = c("test_str", "test_num")
  )

  expect_identical(field_value(field), list(test_str = "foo", test_num = 3))
  expect_null(validate_field(field))

  field <- update_field(field, list("bar", 2))

  expect_identical(field_value(field), list(test_str = "bar", test_num = 2))
  expect_null(validate_field(field))

  field <- update_field(field, list(test_num = 1, test_str = "baz"))

  expect_identical(field_value(field), list(test_str = "baz", test_num = 1))
  expect_null(validate_field(field))

  foo_types <- function(foo) {
    c(numeric = "numeric_field", character = "select_field")[
      chr_ply(foo, class)
    ]
  }

  foo_arg <- function(foo) {

    one_col <- function(i) {
      switch(
        class(foo[[i]]),
        numeric = list(min = function(foo) min(foo[[i]]),
                       max = function(foo) max(foo[[i]])),
        character = list(choices = function(foo) unique(foo[[i]]))
      )
    }

    lapply(seq_along(foo), one_col)
  }

  foo_name <- function(foo) colnames(foo)

  dat2 <- datasets::iris
  dat2[["Species"]] <- as.character(dat2[["Species"]])

  dat1 <- dat2[, c(1, 3, 5)]

  field <- new_list_field(foo_types, foo_arg, name = foo_name)

  field <- update_field(field, lapply(dat1, `[[`, 1L), list(foo = dat1))

  expect_null(validate_field(field))
  expect_identical(field_value(field), lapply(dat1, `[[`, 1L))

  field <- update_field_components(field, list(foo = dat2))
  expect_identical(field_value(field), Map(`[`, dat2, c(1L, 0L, 1L, 0L, 1L)))
})

test_that("expression field", {

  new_mutate_expr_block <- function(data, ...) {

    fields <- list(
      col_name = new_string_field("new_col"),
      expression = new_expression_field()
    )

    new_block(
      fields = fields,
      expr = quote(
        dplyr::mutate(..(expression))
      ),
      ...,
      class = c("mutate_expr_block", "transform_block", "submit_block")
    )
  }

  generate_code_mutate_expr <- function(x) {

    if (!is_initialized(x)) {
      return(quote(identity()))
    }

    val <- set_names(
      parse(text = field_value(x[["expression"]])),
      field_value(x[["col_name"]])
    )

    do.call(
      bquote,
      list(attr(x, "expr"), where = list(expression = val), splice = TRUE)
    )
  }

  .S3method("generate_code", "mutate_expr_block", generate_code_mutate_expr)

  stack <- new_stack(
    new_dataset_block,
    new_mutate_expr_block
  )

  expect_s3_class(stack, "stack")
})

test_that("field name", {
  blk <- new_dataset_block("iris")
  expect_equal(get_field_names(blk), c("package", "Dataset"))

  expect_equal(get_field_name(new_switch_field(), "xxx"), "xxx")
  expect_equal(get_field_name(new_switch_field(title = "xxx"), ""), "xxx")
})
