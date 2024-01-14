test_that("filter2-block", {
  data <- datasets::iris
  block <- filter2_block(data, value = c("Species == 'virginica'"))

  expect_s3_class(block, "filter2_block")
  expect_type(block, "list")

  res <- evaluate_block(block, data)
  expect_identical(unique(as.character(res$Species)), "virginica")

  res_ui <- generate_ui(filter2_block(data = datasets::iris), id = "test")
  expect_s3_class(res_ui, "shiny.tag")
})

test_that("mutate_module_server handles input correctly", {

  # wrap generate_server
  # id as first argument, so we can test via shiny::testSever
  module_server_test <- function(id, x, in_dat, ...) {
    generate_server(x = x, in_dat = in_dat, id = id)
  }

  shiny::testServer(
    module_server_test, {
      # Simulate input to the ACE Editor fields
      session$setInputs(`value-pl_1_val` = "Species == 'virginica'")

      # Assuming there's a mechanism to trigger an action (e.g., a submit button)
      # You need to simulate that action here
      session$setInputs(`value-i_submit` = 1)

      # Test if the reactive value is updated correctly
      # This will depend on how your module processes these inputs
      expect_identical(unique(as.character(out_dat()$Species)), "virginica")
    },
    args = list(
      id = "test",
      x = filter2_block(data = datasets::iris),
      in_dat = reactive(datasets::iris)
    )
  )
})
