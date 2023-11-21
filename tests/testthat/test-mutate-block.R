test_that("mutate-block", {
  data <- datasets::iris
  block <- mutate_block(data, value = c(newcol = "2 * Petal.Length", newcol2 = "3 * Petal.Length"))

  expect_s3_class(block, "mutate_block")
  expect_type(block, "list")

  res <- evaluate_block(block, data)
  expect_true(all(c("newcol", "newcol2") %in% colnames(res)))

})
