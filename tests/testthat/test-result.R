test_that("result field", {
  field <- new_result_field()

  expect_s3_class(field, "result_field")
  expect_type(field, "list")
  expect_identical(value(field), list())
})

test_that("result block", {
  block <- new_result_block()

  expect_s3_class(block, "result_block")
  expect_type(block, "list")

  ui <- generate_ui(block, "foo")
  expect_type(ui, "list")
  expect_s3_class(ui, "shiny.tag")
})

test_that("result field server works", {
  set_workspace(
    stack1 = new_stack(new_dataset_block),
    stack2 = new_stack(new_dataset_block),
    force = TRUE
  )

  shiny::testServer(
    generate_server(new_result_field("stack1")),
    {
      expect_setequal(list_workspace_stacks(), c("stack1", "stack2"))
    }
  )
})

withr::local_package("shinytest2")

test_that("result server works", {
  skip_on_cran()

  app <- AppDriver$new(
    system.file("examples/result/app.R", package = "blockr"),
    name = "result-app"
  )

  app$expect_values(
    input = "select-stack",
    export = "stacks"
  )
})
