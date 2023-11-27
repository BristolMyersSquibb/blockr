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

test_that("3rd party blocks can be registrerd (pkg)", {

  pkg_dir <- system.file("testdata", "test.registry", package = "blockr")
  pkg_nme <- pkgload::pkg_name(pkg_dir)

  expect_false("head_block" %in% list_blocks())

  pkgload::load_all(pkg_dir, attach = FALSE, export_all = FALSE,
                    attach_testthat = FALSE)

  withr::defer(pkgload::unload(pkg_nme))
  withr::local_envvar(TESTTHAT_PKG = pkg_nme)

  expect_true("head_block" %in% list_blocks())
})
