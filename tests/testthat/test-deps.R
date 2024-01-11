test_that("deps works", {
  deps <- blockrDeps()
  dep_names <- chr_xtr(deps, "name")
  expect_in(dep_names, c("blockr", "highlight", "lock"))
  expect_s3_class(deps, "shiny.tag.list")
  invisible(
    lapply(
      deps,
      \(dep) {
        expect_equal(dep$version, as.character(utils::packageVersion("blockr")))
      }
    )
  )
})
