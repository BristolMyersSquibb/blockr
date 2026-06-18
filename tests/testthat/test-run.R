test_that("run_app forwards plugins to serve", {

  served <- NULL
  local_mocked_bindings(
    serve = function(x, ...) {
      served <<- list(...)
      invisible(x)
    }
  )

  custom_plg <- custom_plugins(list())

  run_app(plugins = custom_plg)
  expect_identical(served$plugins, custom_plg)

  run_app()
  expect_identical(served$plugins, blockr_app_plugins)
})

test_that("run_app routes options to the board, not serve", {

  served <- NULL
  local_mocked_bindings(
    serve = function(x, ...) {
      served <<- list(board = x, args = list(...))
      invisible(x)
    }
  )

  opts <- new_board_options(new_board_name_option("from_run_app"))

  run_app(options = opts)

  expect_false("options" %in% names(served$args))
  expect_identical(board_options(served$board), opts)
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
