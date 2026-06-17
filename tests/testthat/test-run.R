test_that("run_app forwards plugins and options to serve", {

  served <- NULL
  local_mocked_bindings(
    serve = function(x, ...) {
      served <<- list(...)
      invisible(x)
    }
  )

  custom_plg <- custom_plugins(list())
  custom_opt <- custom_options(list())

  run_app(plugins = custom_plg, options = custom_opt)
  expect_identical(served$plugins, custom_plg)
  expect_identical(served$options, custom_opt)

  run_app()
  expect_identical(served$plugins, blockr_app_plugins)
  expect_identical(served$options, blockr_app_options)
})

test_that("merge app", {

  skip_on_cran()

  expect_warning(
    app <- shinytest2::AppDriver$new(
      system.file("examples", "board", "app.R", package = "blockr"),
      name = "board",
      seed = 42,
      load_timeout = 30 * 1000
    )
  )

  app$wait_for_idle()
  app$expect_values(export = TRUE, screenshot_args = FALSE)

  app$stop()
})
