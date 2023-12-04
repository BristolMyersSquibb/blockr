test_that("stacks", {
  stack <- new_stack(
    new_data_block,
    new_filter_block
  )

  expect_s3_class(stack, "stack")
  expect_type(stack, "list")
})

test_that("serve stacks", {
  skip_on_cran()
  driver <- shinytest2::AppDriver$new(
    system.file("examples/cdisc-plot", package = "blockr"),
    name = "app-starts"
  )
  socket_state <- driver$get_js("Shiny.shinyapp.$socket.readyState")
  expect_equal(socket_state, 1)
  driver$stop()
})
