test_that("merge app", {

  skip_on_cran()

  app_path <- system.file("examples", "board", "app.R", package = "blockr")

  expect_warning(
    app <- shinytest2::AppDriver$new(
      app_path,
      name = "board",
      seed = 42,
      load_timeout = 30 * 1000
    )
  )

  app$wait_for_idle()
  app$expect_values(export = TRUE, screenshot_args = FALSE)

  app$stop()
})
