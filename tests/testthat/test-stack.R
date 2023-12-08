test_that("stacks", {
  stack <- new_stack(
    new_data_block,
    new_filter_block
  )

  expect_s3_class(stack, "stack")
  expect_type(stack, "list")

  app <- serve_stack(stack)
  expect_s3_class(app, "shiny.appobj")
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

# To test cleanup_block helper function
test_mod <- function(id) {
  moduleServer(id, function(input, output, session) {
    obs <- list()
    txt <- reactiveVal(NULL)

    obs$init <- observeEvent(TRUE, {
      txt("INIT")
    })

    output$res <- renderText(txt())

    obs$cleanup <- cleanup_block(input, output, obs)
  })
}

testServer(test_mod, {
  # Init session + basic checks
  session$setInputs(dummy = 1)
  expect_length(names(input), 1)
  expect_equal(input$dummy, 1)
  expect_length(obs, 2)
  expect_equal(names(obs), c("init", "cleanup"))
  expect_equal(output$res, "INIT")

  # Trigger cleanup
  session$setInputs(remove = 1)
  # Check cleanup worked
  expect_error(output$res)
  invisible(lapply(names(input), \(n) {
    expect_null(input[[n]])
  }))
  invisible(lapply(obs, \(o) {
    expect_true(o$.destroyed)
  }))
})

# Test stack module

stack <- new_stack(
  data_block,
  head_block
)

mock_mod <- function(id, x, ...) {
  generate_server(x, ...)
}

testServer(mock_mod, args = list(x = stack), {
  # Init remove input
  inputs <- list(0, 0)
  names(inputs) <- chr_ply(vals$stack, function(block) {
    paste(attr(block, "name"), "remove", sep = "-")
  })
  do.call(session$setInputs, inputs)
  # Let's check we have correct init state ...
  expect_length(vals$stack, 2)
  expect_length(vals$blocks, 2)

  # Inspect blocks
  expect_equal(nrow(vals$blocks[[1]]$data()), nrow(datasets::airquality))
  expect_equal(colnames(vals$blocks[[1]]$data()), colnames(datasets::airquality))

  # Test remove block

  # Remove data block first should do nothing
  inputs[[1]] <- 1
  do.call(session$setInputs, inputs)
  expect_length(vals$stack, 2)
  expect_length(vals$blocks, 2)

  inputs[[2]] <- 1
  expect_message(do.call(session$setInputs, inputs))
  expect_length(vals$stack, 1)
  expect_length(vals$blocks, 1)
  expect_equal(class(vals$stack[[1]])[[1]], "dataset_block")

  expect_message(do.call(session$setInputs, inputs))
  expect_length(vals$stack, 0)
  expect_length(vals$blocks, 0)
})