test_that("available blocks", {

  blocks <- available_blocks()

  expect_type(blocks, "list")
  expect_gte(length(blocks), 1L)

  for (block in blocks) {

    expect_s3_class(block, "block_descr")

    nme <- block_name(block)

    expect_type(nme, "character")
    expect_length(nme, 1L)

    dsc <- block_descr(block)

    expect_type(dsc, "character")
    expect_length(dsc, 1L)
  }
})
