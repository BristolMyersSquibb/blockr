test_that("stacks", {
  stack <- new_stack(
    new_dataset_block,
    new_filter_block
  )

  expect_s3_class(stack, "stack")
  expect_type(stack, "list")

  app <- serve_stack(stack)
  expect_s3_class(app, "shiny.appobj")

  code <- generate_code(
    new_stack()
  )

  expect_type(code, "language")

  code <- generate_code(
    new_stack(new_dataset_block)
  )

  expect_type(code, "language")

  code <- generate_code(
    new_stack(new_dataset_block, new_filter_block)
  )

  expect_type(code, "language")

  code <- generate_code(
    new_stack(new_dataset_block, new_filter_block, new_select_block)
  )

  expect_type(code, "language")
})

test_that("Set stack title", {

  stack_test_server <- function(id, x, ...) {
    generate_server(x, id, ...)
  }

  shiny::testServer(
    stack_test_server,
    {
      expect_identical(get_stack_title(vals$stack), "Stack")
      session$setInputs(newTitle = "Test stack")
      expect_identical(get_stack_title(vals$stack), "Test stack")
    },
    args = list(
      id = "add_block_to_stack",
      x = new_stack(
        data = new_dataset_block("anscombe")
      )
    )
  )
})

withr::local_package("shinytest2")

test_that("stacks demo works", {
  # Don't run these tests on the CRAN build servers
  skip_on_cran()
  app <- AppDriver$new(
    system.file("examples/stack", package = "blockr"),
    name = "stack-app"
  )

  stack_inputs <- c(
    "mystack-add",
    "mystack-copy",
    "mystack-newTitle",
    "mystack-remove"
  )

  stack_exports <- c(
    "mystack-stack",
    "mystack-n_blocks",
    "mystack-removed"
  )

  app$expect_values(
    # These are purely stacks inputs
    # we can control the namespace as opposed
    # to block inputs which have random namespace
    # when programmatically added. block have a separate
    # test.
    input = stack_inputs,
    export = stack_exports
  )

  # Add a block
  app$click(selector = ".stack-add-block")
  app$set_inputs("mystack-selected_block" = "dataset_block")
  app$click(selector = "#mystack-add")

  app$expect_values(
    input = stack_inputs,
    export = stack_exports,
    screenshot_args = list(
      delay = 1
    )
  )

  # Collapse stack
  app$click(selector = ".stack-edit-toggle")
  app$expect_values(
    input = stack_inputs,
    export = stack_exports,
    screenshot_args = list(
      delay = 1
    )
  )

  # Copy code
  app$click(selector = ".stack-copy-code")
  app$expect_values(
    input = stack_inputs,
    export = stack_exports,
    screenshot_args = list(
      delay = 1
    )
  )

  # Remove stack
  app$click(selector = ".stack-remove")
  Sys.sleep(2)
  app$expect_values(
    input = stack_inputs,
    export = stack_exports,
    screenshot_args = list(
      delay = 1
    )
  )
  app$click(selector = "#mystack-acceptRemove")
  Sys.sleep(2)
  app$expect_values(
    input = stack_inputs,
    export = stack_exports,
    screenshot_args = list(
      delay = 1
    )
  )
})
