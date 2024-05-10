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
  blk <- new_select_block(data)
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
  expect_equal(res$type, "validate-input")
  expect_true(res$message$state)
  expect_equal(res$message$id, session$ns(names(input)[[1]]))

  # Reset session
  validate_block(blk, is_valid, session)
  blk_msg <- session$lastCustomMessage

  expect_type(blk_msg, "list")
  expect_equal(blk_msg$type, "validate-block")
  expect_true(blk_msg$message$state)
  expect_equal(blk_msg$message$id, session$ns("block"))

  removed_ui <- session$lastRemoved
  expect_type(removed_ui, "list")
  expect_equal(
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
  expect_equal(
    inserted_ui$selector,
    sprintf("[data-value=\"%s\"] .block-validation", session$ns("block"))
  )
  expect_equal(inserted_ui$where, "beforeEnd")
  expect_s3_class(inserted_ui$content$html, "html")
  expect_s3_class(inserted_ui$content$deps[[1]], "html_dependency")
  expect_length(inserted_ui$content$deps, 1)
})
