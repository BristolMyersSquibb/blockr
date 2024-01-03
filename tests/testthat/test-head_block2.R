test_that("head_block2", {
  data <- datasets::iris
  block <- head_block2(data, n_rows = 3)

  expect_s3_class(block, "head_block2")
  expect_type(block, "list")

  res <- evaluate_block(block, data)
  expect_identical(nrow(res), 3L)
})

test_that("head_block2 handles input correctly", {

  # wrap generate_server
  # id as first argument, so we can test via shiny::testSever
  module_server_test <- function(id, x, in_dat, ...) {
    generate_server(x = x, in_dat = in_dat, id = id)
  }

  shiny::testServer(
    module_server_test, {
      # init value is ignored
      session$setInputs(`n_rows-num_field_output` = 3L)
      session$setInputs(`n_rows-num_field_output` = 7L)

      # Test if the reactive value is updated correctly
      # This will depend on how your module processes these inputs
      expect_identical(nrow(out_dat()), 7L)
    },
    args = list(
      id = "test",
      x = head_block2(data = datasets::iris, n_rows = 5),
      in_dat = reactive(datasets::iris)
    )
  )
})
