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
testMod <- function(id) {
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

testServer(testMod, {
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
