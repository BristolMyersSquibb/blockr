test_that("data blocks", {

  block <- new_data_block()

  expect_s3_class(block, "data_block")
  expect_type(block, "list")

  dat <- evaulte_block(block)

  expect_s3_class(dat, "data.frame")
})
