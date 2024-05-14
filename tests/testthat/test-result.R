test_that("result field", {

  field <- result_field()

  expect_s3_class(field, "result_field")
  expect_type(field, "list")
  expect_identical(value(field), list())
})

test_that("result block", {

  block <- result_block()

  expect_s3_class(block, "result_block")
  expect_type(block, "list")

  ui <- generate_ui(block, "foo")
  expect_type(ui, "list")
  expect_s3_class(ui, "shiny.tag")
})

test_that("result server works", {

  set_workspace(
    stack1 = new_stack(dataset_block),
    stack2 = new_stack(dataset_block),
    force = TRUE
  )

  shiny::testServer(
    generate_server(result_field()), {
      expect_setequal(opts(), c("stack1", "stack2"))
    }
  )
})
