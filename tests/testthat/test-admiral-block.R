test_that("admiral-block", {
  data <- datasets::BOD
  data$PARAMCD <- as.character(seq_len(nrow(data)))

  block <- admiral_dpc_block(
    data,
    by_vars = "Time",
    parameters = c("4", "5"),
    set_values_to = c(
      demand = "demand * 2",
      PARAMCD = "'17'"
    )
  )

  expect_s3_class(block, "admiral_dpc_block")
  expect_type(block, "list")

  res <- evaluate_block(block, data)
  expect_identical(nrow(res), 8L)

})
