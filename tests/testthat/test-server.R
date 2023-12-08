# Test block server
mock_data_mod <- function(id, x) {
  generate_server.data_block(x, id)
}
block <- data_block()

testServer(mock_data_mod, args = list(x = block), {
  # Init state
  expect_identical(blk(), x)
  expect_identical(nrow(out_dat()), nrow(datasets::airquality))
  expect_identical(output$nrow, as.character(nrow(out_dat())))
  expect_identical(output$ncol, as.character(length(colnames(out_dat()))))

  expect_length(obs, 2)
  expect_no_error(output$code)

  # Change data
  session$setInputs("dataset" = "mtcars")
  expect_identical(nrow(out_dat()), nrow(datasets::mtcars))
})

mock_transform_mod <- function(id, x, in_dat) {
  generate_server.transform_block(x, in_dat, id)
}

# Min is 1. As 12 > 1, validate_field.numeric_field
# returns TRUE and does not change n_rows.
block <- head_block(datasets::iris, n_rows = 12L)

testServer(
  mock_transform_mod,
  args = list(
    x = block,
    in_dat = reactive(datasets::iris)
  ), {
    # Init state
    expect_true(is_valid$block)
    expect_length(is_valid$inputs, 0)
    expect_null(is_valid$message)
    expect_null(is_valid$error)

    expect_identical(nrow(out_dat()), value(blk()$n_rows))
    # Update input
    expect_message(session$setInputs("n_rows" = 1))
    # Need to run twice: bug in shiny test server
    session$setInputs("n_rows" = 1)
    expect_true(is_valid$block)
    expect_identical(nrow(out_dat()), 1L)

    # Invalid input: check that no data are propagated ...
    session$setInputs("n_rows" = NA)
    expect_false(is_valid$block)
    expect_identical(is_valid$message, "Error: input 'n_rows' is not valid.")
    expect_error(out_dat())
    expect_error(output$res)
    expect_error(output$nrow)
    expect_error(output$ncol)
  }
)

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
  expect_identical(nrow(vals$blocks[[1]]$data()), nrow(datasets::airquality))
  expect_identical(colnames(vals$blocks[[1]]$data()), colnames(datasets::airquality))

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
  expect_identical(class(vals$stack[[1]])[[1]], "dataset_block")

  expect_message(do.call(session$setInputs, inputs))
  expect_length(vals$stack, 0)
  expect_length(vals$blocks, 0)
})

# Mock session
session <- as.environment(
  list(
    ns = identity,
    sendCustomMessage = function(type, message) {
      session$lastCustomMessage <- list(
        type = type,
        message = message
      )
    },
    sendRemoveUI = function(selector, multiple) {
      session$lastRemoved <- list(
        selector = selector,
        multiple = multiple
      )
    },
    sendInsertUI = function(selector, multiple, where, content) {
      session$lastInserted <- list(
        selector = selector,
        multiple = multiple,
        where = where,
        content = content
      )
    },
    onFlushed = function(callback, once = TRUE) {
      # We still execute the callback function which is sendRemoveUI
      session$flushed <- list(
        callback = callback(),
        once = once
      )
    }
  )
)

test_that("validate block works", {
  # Init values
  data <- iris
  input <- list("columns" = colnames(data)[[1]])
  blk <- select_block(data)
  is_valid <- list(
    block = TRUE,
    input = list(),
    message = NULL,
    error = NULL
  )

  # We just check the function sends a consistent message to JS ...
  invisible(validate_inputs(blk, is_valid, session))
  res <- session$lastCustomMessage

  expect_type(res, "list")
  expect_identical(res$type, "validate-input")
  expect_true(res$message$state)
  expect_identical(res$message$id, session$ns(names(input)[[1]]))

  # Reset session
  validate_block(blk, is_valid, session)
  blk_msg <- session$lastCustomMessage

  expect_type(blk_msg, "list")
  expect_identical(blk_msg$type, "validate-block")
  expect_true(blk_msg$message$state)
  expect_identical(blk_msg$message$id, session$ns("block"))

  removed_ui <- session$lastRemoved
  expect_type(removed_ui, "list")
  expect_identical(
    removed_ui$selector,
    sprintf("[data-value=\"%s\"] .message", session$ns("block"))
  )
  expect_true(removed_ui$multiple)

  # Invalidate block to manually test for extra UI messages
  input <- list("columns" = "")
  invisible(validate_inputs(blk, is_valid, session))
  res <- session$lastCustomMessage
  expect_false(res$message$state)


  is_valid$message <- tagList(
    p("Input is not valid"),
    icon("home")
  )
  is_valid$block <- FALSE
  validate_block(blk, is_valid, session)
  inserted_ui <- session$lastInserted

  expect_type(inserted_ui, "list")
  expect_identical(
    inserted_ui$selector,
    sprintf("[data-value=\"%s\"] .block-validation", session$ns("block"))
  )
  expect_identical(inserted_ui$where, "beforeEnd")
  expect_s3_class(inserted_ui$content$html, "html")
  expect_s3_class(inserted_ui$content$deps[[1]], "html_dependency")
  expect_length(inserted_ui$content$deps, 1)
})
