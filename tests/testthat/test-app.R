stack <- new_stack(
  data_block,
  filter_block
)

# Test stack module
# A bit hacky but generate_server.stack does not valspect
# the pvalscription for shiny module testing (the function
# must have id as first param.
my_stack <- function(id, x) {

}
body(my_stack) <- body(generate_server.stack)[-2]
testServer(my_stack, args = list(x = stack), {
  # # # # # # #
  #           #
  # INIT TEST #
  #           #
  # # # # # # #
  
  # Let's check we have correct init state ...
  expect_length(vals$stack, 2)
  expect_length(vals$blocks, 2)

  # Test data block
  data_block <- vals$stack[[1]]
  data_block_field <- data_block$dataset
  expect_true(inherits(data_block, "data_block"))
  expect_equal(data_block_field$multiple, FALSE)
  expect_equal(data_block_field$value, "iris")

  # test filter block
  filter_block <- vals$stack[[2]]
  filter_block_col_field <- filter_block$columns
  filter_block_val_field <- filter_block$values
  expect_true(inherits(filter_block, "filter_block"))
  expect_equal(filter_block_col_field$value, colnames(iris)[[1]])
  expect_equal(attr(filter_block_col_field$choices, "result"), colnames(iris))
  expect_equal(filter_block_col_field$multiple, TRUE)

  # # # # # # # # # #
  #                 #
  # REACTIVITY TEST #
  #                 #
  # # # # # # # # # #

  # Let's make some change
  session$setInputs(add = 1)
  expect_length(vals$stack, 3)
  expect_length(vals$blocks, 3)
  expect_true(inherits(filter_block, "filter_block"))
  # Test user data necessary to communicate with submodules
  expect_equal(ls(session$userData), c("is_cleaned", "stack"))
  print(ls(session$userData))
})
