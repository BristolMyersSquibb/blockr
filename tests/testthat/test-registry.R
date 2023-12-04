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

  blk <- construct_block(names(blocks)[1L])

  expect_s3_class(blk, "block")

  unregister_blocks()

  expect_length(available_blocks(), 0L)

  register_blockr_blocks()

  nme_getter <- block_descrs_getter(block_descr_getter("name"))

  expect_mapequal(
    nme_getter(blocks),
    nme_getter(available_blocks())
  )
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

test_that("3rd party blocks can be registrerd (script)", {

  expect_false("head_block" %in% list_blocks())

  new_head_block <- function(data, n_rows = numeric()) {

    new_block(
      fields = list(
        n_rows = new_numeric_field(n_rows, 1L, 100L)
      ),
      expr = quote(head(n = .(n_rows))),
      class = c("head_block", "transform_block")
    )
  }

  register_block(
    new_head_block, "head block", "return first n rows",
    c("head_block", "transform_block"), "data.frame", "data.frame"
  )

  expect_true("head_block" %in% list_blocks())

  expect_warning(
    register_block(
      new_head_block, "head block", "return first n rows",
      c("head_block", "transform_block"), "data.frame", "data.frame"
    )
  )

  unregister_blocks("head_block")

  expect_false("head_block" %in% list_blocks())
})
