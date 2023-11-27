test_that("ace", {
  ans <- exprs_ui()
  expect_s3_class(ans, "shiny.tag")
})
