testServer(module_server_test, {
  # Init values
  expect_false(is_valid$block)
  expect_null(is_valid$message)
  session$flushReact()
  expect_true(is_valid$block)
  expect_true(
    all.equal(
      out_dat(),
      iris |> select(colnames(datasets::iris)[[1]])
    )
  )

  # Invalidate
  session$setInputs("columns" = "")
  session$flushReact()
  expect_false(is_valid$block)
  expect_identical(is_valid$message, "selected value(s) not among provided choices")
  expect_identical(is_valid$fields, "columns")

  # Re-validate
  session$setInputs("columns" = "Species")
  session$flushReact()
  expect_true(is_valid$block)
  expect_null(is_valid$message)
}, args = list(
  id = "test",
  x = new_select_block(colnames(datasets::iris)[[1]]),
  in_dat = reactive(datasets::iris),
  is_prev_valid = reactive(TRUE)
))
