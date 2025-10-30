test_that("blockr_pkgs", {
  expect_type(blockr_pkgs, "character")
  expect_true("blockr.core" %in% blockr_pkgs)
})
