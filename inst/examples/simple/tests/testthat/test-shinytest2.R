library(shinytest2)

test_that("{shinytest2} recording: simple", {
  app <- AppDriver$new(
    #"inst/examples/simple",
    variant = platform_variant(),
    name = "simple",
    height = 859,
    width = 1001
  )

  values <- app$get_values()
  expect_equal(values$input[["stack-add"]][1], 0)
  expect_equal(values$input[["stack-dataset-remove"]][1], 0)
  expect_equal(values$input[["stack-filter-remove"]][1], 0)

  # Init state
  expect_length(app$get_values()$export[["stack-stack_state"]], 2)

  # Remove block 1 (should show a modal failure)
  app$click("stack-dataset-remove")
  app$expect_screenshot(delay = 1)
  expect_length(app$get_values()$export[["stack-stack_state"]], 2)
  # Remove the modal since shinytest2 can't do this.
  app$click(selector = "[data-dismiss = 'modal']")

  # Remove filter block (should be successful)
  app$click("stack-filter-remove")
  app$expect_screenshot(delay = 1)
  expect_length(app$get_values()$export[["stack-stack_state"]], 1)

  # Remove datablock (should work now)
  app$click("stack-dataset-remove")
  app$expect_screenshot(delay = 1)
  expect_length(app$get_values()$export[["stack-stack_state"]], 0)

  # Add datablock
  app$click("stack-add")
  app$click(selector = "[data-dismiss = 'modal']")
  app$expect_screenshot(delay = 1)
  expect_length(app$get_values()$export[["stack-stack_state"]], 1)
  app$click("stack-add")
  app$click(selector = "[data-dismiss = 'modal']")
  expect_length(app$get_values()$export[["stack-stack_state"]], 2)

  # Change filter and check output
  app$set_inputs("stack-filter-values_Sepal.Length" = c(7.5, 7.9))
  app$expect_screenshot(delay = 1)
  expect_equal(nrow(app$get_values()$export[["stack-filter-data"]]), 6)
})
