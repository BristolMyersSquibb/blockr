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

test_that("Get compatible blocks", {
  stack <- new_stack()
  res <- get_compatible_blocks(stack)
  # Might change if we add new data blocks
  expect_equal(nrow(res), 3)
  expect_identical(unique(res$category), "data")

  # Uncategorized block
  attr(block_registry$dataset_block, "category") <- "uncategorized"
  stack <- new_stack()
  res <- get_compatible_blocks(stack)
  expect_equal(nrow(res), 3)
  expect_contains(unique(res$category), c("data", "uncategorized"))

  stack <- new_stack(new_dataset_block())
  res <- get_compatible_blocks(stack)
  expect_identical(unique(res$category), "transform")

  # Check for workspace and result block
  stack1 <- new_stack(
    new_dataset_block,
    new_filter_block
  )

  stack2 <- new_stack()

  set_workspace(stack1 = stack1, stack2 = stack2)
  expect_true("result_block" %in% get_compatible_blocks(stack2)$ctor)
  expect_true("result_block" %in% get_compatible_blocks(stack1)$ctor)
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
  # (need to click on the add block button to set the input value to 1)
  # need also to click on the selector to trigger the offcanvas
  app$click(input = "mystack-add-block-add")
  app$click(selector = ".stack-add-block")
  app$set_inputs("mystack-add-block-search" = "dataset_block")

  app$expect_values(
    input = stack_inputs,
    export = stack_exports,
    screenshot_args = list(
      delay = 1
    )
  )

  app$set_inputs("mystack-add-block-search" = "select_block")

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
