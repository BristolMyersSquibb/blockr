test_that("simple data_block with keyvalue field", {

  withr::local_options(BLOCKR_LOG_LEVEL = "error")

  new_df_block <- function(cols = list(), ...) {
    handle_error <- function(e) {
      warning(e)
      expression()
    }

    parse_one <- function(x) {
      tryCatch(
        parse(text = x),
        error = handle_error
      )
    }

    parse_kv <- function(columns) {

      parsed <- lapply(columns, parse_one)
      if (length(parsed)) {
        parsed <- do.call(c, parsed)
      }

      bquote(
        data.frame(..(exprs)),
        list(exprs = parsed),
        splice = TRUE
      )
    }

    fields <- list(
      columns = new_keyvalue_field(cols),
      expression = new_hidden_field(parse_kv)
    )

    new_block(
      fields = fields,
      expr = quote(.(expression)),
      ...,
      class = c("df_block", "data_block")
    )
  }


  # id as first argument, so we can test via shiny::testSever
  module_server_test <- function(id, x, ...) {
    generate_server(x = x, id = id)
  }

  shiny::testServer(
    module_server_test, {
      session$setInputs(`value-i_add` = 1)  # click something to initialize

      # Simulate input to the ACE Editor fields
      session$setInputs(`columns-pl_1_name` = "col1", `columns-pl_1_val` = "rep(1, 5)")

      # Assuming there's a mechanism to trigger an action (e.g., a submit button)
      # You need to simulate that action here
      session$setInputs(`columns-i_submit` = 1)

      session$setInputs(`columns-i_add` = 1)
      # Test if the reactive value is updated correctly
      # This will depend on how your module processes these inputs
      expect_identical(out_dat()$col1, rep(1, 5))
    },
    args = list(
      id = "test",
      x = new_df_block()
    )
  )


})
