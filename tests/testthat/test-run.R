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

  run_app(plugins = blockr_app_plugins)
  expect_identical(served$plugins, blockr_app_plugins)

  run_app()
  expect_identical(
    served$plugins(new_board())[["preserve_board"]],
    blockr.session::manage_project()
  )
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

  # A loaded runner can take longer than chromote's 10 s default to answer
  # the app's first `Page.navigate` (rstudio/shinytest2#448). The app's
  # session takes its command timeout from the default chromote object.
  chrome <- try(chromote::default_chromote_object(), silent = TRUE)
  skip_if(inherits(chrome, "try-error"), "Chrome can not be started")
  chrome$default_timeout <- 60

  # The dock evaluates only the blocks a user can see. Keep the board eager,
  # so that every block has a result to compare.
  app <- shinytest2::AppDriver$new(
    system.file("examples", "board", "app.R", package = "blockr"),
    name = "board",
    seed = 42,
    options = list(blockr.gate_visibility = FALSE),
    load_timeout = 30 * 1000,
    timeout = 30 * 1000
  )

  app$wait_for_idle()
  app$expect_values(export = "result", screenshot_args = FALSE)

  app$stop()
})
