test_that("deps works", {
  dep <- blockrDependencies()
  expect_s3_class(dep, "html_dependency")
  expect_equal(dep$version, as.character(utils::packageVersion("blockr")))
})
