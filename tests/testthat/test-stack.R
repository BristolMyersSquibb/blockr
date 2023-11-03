test_that("stacks", {
  stack <- new_stack(
    new_data_block,
    new_filter_block
  )

  expect_s3_class(stack, "stack")
  expect_type(stack, "list")
})

test_that("serve stacks", {
  stack <- new_stack(
    new_data_block,
    new_filter_block
  )

  app <- serve_stack(stack)
  expect_s3_class(app, "shiny.appobj")

  # App starts (blockr needs to be installed)
  driver <- shinytest2::AppDriver$new(app, name = "app-starts")
  socket_state <- driver$get_js("Shiny.shinyapp.$socket.readyState")
  expect_equal(socket_state, 1)
  driver$stop()
})
