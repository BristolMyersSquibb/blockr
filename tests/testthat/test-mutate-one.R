test_that("mutate_one can be done", {

  new_mutate_one_block <- function(data, ...) {

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
      class = c("mutate_one_block", "transform_block", "submit_block")
    )
  }

  mutate_one_block <- function(data, ...) {
    initialize_block(new_mutate_one_block(data, ...), data)
  }

  generate_code_mutate_one <- function(x) {

    if (is_initialized(x)) {
      val <- parse(text = value(x[["expression"]]))
    } else {
      val <- expression(NULL)
    }

    names(val) <- value(x[["col_name"]])

    do.call(
      bquote,
      list(attr(x, "expr"), where = list(expression = val), splice = TRUE)
    )
  }

  .S3method("generate_code", "mutate_one_block", generate_code_mutate_one)

  stack <- new_stack(
    data_block,
    mutate_one_block
  )

  expect_s3_class(stack, "stack")
})
