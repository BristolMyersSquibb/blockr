test_that("blockr_pkgs", {
  expect_type(blockr_pkgs, "character")
  expect_true("block.core" %in% blockr_pkgs)
})
