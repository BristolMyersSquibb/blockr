test_that("ace", {
  ans <- exprs_ui()
  expect_s3_class(ans, "shiny.tag")
})

test_that("ace_module_ui creates correct UI structure", {
  ui <- ace_module_ui("test", exprs_init = c(a = "bla", b = "blabla"))

  # Checking if the UI components with expected IDs are present
  expect_true("test-pl_1" %in% names(ui$children[[1]]$children[[1]]))
  # Since we cannot test the actual values or user interactions without shinytest,
  # we are limited to checking the existence and basic structure of UI elements.
})

test_that("ace_module_server handles input correctly", {
  shiny::testServer(ace_module_server, {
    # Simulate input to the ACE Editor fields
    session$setInputs(`pl_1_name` = "a", `pl_1_val` = "bla")
    session$setInputs(`pl_2_name` = "b", `pl_2_val` = "blabla")

    # Assuming there's a mechanism to trigger an action (e.g., a submit button)
    # You need to simulate that action here
    session$setInputs(i_submit = 2)

    # Test if the reactive value is updated correctly
    # This will depend on how your module processes these inputs
    expect_equal(r_result(), c(a = "bla", b = "blabla"))
  }, args = list(id = "test"))
})
