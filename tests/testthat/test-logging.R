test_that("logging works", {

  withr::with_options(
    list(BLOCKR_DEV = FALSE),
    {
      expect_message(log_info("foo"))
      expect_silent(log_debug("foo"))
    }
  )

  withr::with_options(
    list(BLOCKR_DEV = TRUE),
    {
      expect_message(log_debug("foo"))
      expect_silent(log_trace("foo"))
    }
  )

  withr::with_options(
    list(BLOCKR_LOG_LEVEL = "warn"),
    {
      expect_warning(log_warn("foo"))
      expect_silent(log_info("foo"))
    }
  )

  withr::local_options(BLOCKR_LOG_LEVEL = "trace")

  expect_error(log_fatal("foo"))
  expect_warning(log_error("foo"))
  expect_warning(log_warn("foo"))
  expect_message(log_info("foo"))
  expect_message(log_debug("foo"))
  expect_message(log_trace("foo"))
})
