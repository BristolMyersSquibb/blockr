test_that("merge app", {

  skip_on_cran()

  expect_warning(
    app <- shinytest2::AppDriver$new(
      system.file("examples", "board", "app.R", package = "blockr"),
      name = "board",
      seed = 42
    )
  )

  app$wait_for_idle()
  app$expect_values(export = TRUE, screenshot_args = FALSE)

  app$stop()
})
