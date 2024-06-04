test_that("data blocks", {

  dat1 <- datasets::iris

  blk1 <- new_dataset_block()

  expect_s3_class(blk1, "dataset_block")
  expect_s3_class(blk1, "data_block")

  blk1 <- initialize_block(blk1)
  res1 <- evaluate_block(blk1)

  expect_identical(res1, data.frame())

  blk2 <- new_dataset_block("iris")

  expect_s3_class(blk2, "dataset_block")
  expect_s3_class(blk2, "data_block")

  blk2 <- initialize_block(blk2)
  res2 <- evaluate_block(blk2)

  expect_identical(nrow(res2), nrow(dat1))
  expect_identical(colnames(res2), colnames(dat1))

  dat2 <- dplyr::starwars

  blk3 <- new_dataset_block("starwars", package = "dplyr")

  expect_s3_class(blk3, "dataset_block")
  expect_s3_class(blk3, "data_block")

  blk3 <- initialize_block(blk3)
  res3 <- evaluate_block(blk3)

  expect_identical(nrow(res3), nrow(dat2))
  expect_identical(colnames(res3), colnames(dat2))
})

test_that("filter blocks", {

  data <- datasets::iris

  blk1 <- new_filter_block()

  expect_s3_class(blk1, "transform_block")
  expect_s3_class(blk1, "filter_block")

  blk1 <- initialize_block(blk1, data)
  res1 <- evaluate_block(blk1, data)

  expect_identical(nrow(res1), nrow(data))
  expect_identical(colnames(res1), colnames(data))

  blk2 <- new_filter_block("Species", "setosa")

  expect_s3_class(blk2, "transform_block")
  expect_s3_class(blk2, "filter_block")

  blk2 <- initialize_block(blk2, data)
  res2 <- evaluate_block(blk2, data)

  expect_identical(nrow(res2), nrow(data[data$Species == "setosa", ]))
  expect_identical(colnames(res2), colnames(data))
})

test_that("select blocks", {

  data <- datasets::iris

  blk1 <- new_select_block()

  expect_s3_class(blk1, "transform_block")
  expect_s3_class(blk1, "select_block")

  blk1 <- initialize_block(blk1, data)
  res1 <- evaluate_block(blk1, data)

  expect_identical(nrow(res1), nrow(data))
  expect_identical(colnames(res1), colnames(data))

  blk2 <- new_select_block("Species")

  expect_s3_class(blk2, "select_block")
  expect_type(blk2, "list")

  blk2 <- initialize_block(blk2, data)
  res2 <- evaluate_block(blk2, data)

  expect_identical(nrow(res2), nrow(data))
  expect_identical(colnames(res2), "Species")
})

test_that("arrange blocks", {

  data <- datasets::iris

  blk1 <- new_arrange_block()

  expect_s3_class(blk1, "transform_block")
  expect_s3_class(blk1, "arrange_block")

  blk1 <- initialize_block(blk1, data)
  res1 <- evaluate_block(blk1, data)

  expect_identical(data$Species, res1$Species)

  blk2 <- new_arrange_block("Sepal.Length")

  expect_s3_class(blk2, "transform_block")
  expect_s3_class(blk2, "arrange_block")

  blk2 <- initialize_block(blk2, data)
  res2 <- evaluate_block(blk2, data)

  expect_identical(data$Species[order(data$Sepal.Length)], res2$Species)
})

test_that("group_by blocks", {

  data <- datasets::iris

  blk1 <- new_group_by_block()

  expect_s3_class(blk1, "transform_block")
  expect_s3_class(blk1, "group_by_block")

  blk1 <- initialize_block(blk1, data)
  res1 <- evaluate_block(blk1, data) %>% summarise(n = n())

  expect_equal(nrow(res1), 1)

  blk2 <- new_group_by_block("Species")

  expect_s3_class(blk2, "transform_block")
  expect_s3_class(blk2, "group_by_block")

  blk2 <- initialize_block(blk2, data)
  res2 <- evaluate_block(blk2, data) %>% summarise(n = n())

  expect_equal(nrow(res2), 3)
})

test_that("join blocks", {

  datx <- dplyr::band_members
  daty <- dplyr::band_instruments

  blk1 <- new_join_block()

  expect_s3_class(blk1, "transform_block")
  expect_s3_class(blk1, "join_block")

  blk1 <- initialize_block(blk1, datx)
  res1 <- evaluate_block(blk1, datx)

  expect_equal(nrow(res1), nrow(datx))
  expect_equal(colnames(res1), colnames(datx))

  blk2 <- new_join_block(daty, type = "inner", by = "name")

  expect_s3_class(blk2, "transform_block")
  expect_s3_class(blk2, "join_block")

  blk2 <- initialize_block(blk2, datx)
  res2 <- evaluate_block(blk2, datx)

  expect_equal(nrow(res2), 2L)
  expect_equal(colnames(res2), c("name", "band", "plays"))
})

test_that("head blocks", {

  data <- datasets::iris

  blk1 <- new_head_block()

  expect_s3_class(blk1, "transform_block")
  expect_s3_class(blk1, "head_block")

  blk1 <- initialize_block(blk1, data)
  res1 <- evaluate_block(blk1, data)

  expect_equal(nrow(res1), nrow(data))
  expect_equal(colnames(res1), colnames(data))

  blk2 <- new_head_block(12L)

  expect_s3_class(blk2, "transform_block")
  expect_s3_class(blk2, "head_block")

  blk2 <- initialize_block(blk2, data)
  res2 <- evaluate_block(blk2, data)

  expect_equal(nrow(res2), 12L)
  expect_equal(colnames(res2), colnames(data))
})

test_that("summarize block", {

  data <- datasets::iris

  blk1 <- new_summarize_block()

  expect_s3_class(blk1, "transform_block")
  expect_s3_class(blk1, "summarize_block")

  blk1 <- initialize_block(blk1, data)
  res1 <- evaluate_block(blk1, data)

  expect_equal(nrow(res1), nrow(data))
  expect_equal(colnames(res1), colnames(data))

  blk2 <- new_summarize_block(c("mean", "sd"), rep("Sepal.Width", 2))

  expect_s3_class(blk2, "transform_block")
  expect_s3_class(blk2, "summarize_block")

  blk2 <- initialize_block(blk2, data)
  res2 <- evaluate_block(blk2, data)

  expect_equal(nrow(res2), 1L)
  expect_equal(colnames(res2), c("MEAN", "SD"))
})


test_that("upload block", {

  blk1 <- new_upload_block()

  expect_s3_class(blk1, "data_block")
  expect_s3_class(blk1, "upload_block")

  blk1 <- initialize_block(blk1)
  res1 <- evaluate_block(blk1)

  expect_equal(nrow(res1), 0L)
  expect_equal(ncol(res1), 0L)

  path <- withr::local_tempfile()
  write.csv(datasets::iris, path, row.names = FALSE)

  blk2 <- new_upload_block(path)

  expect_s3_class(blk2, "data_block")
  expect_s3_class(blk2, "upload_block")

  blk2 <- initialize_block(blk2)
  res2 <- evaluate_block(blk2)

  expect_equal(res2, path)
})

test_that("filesbrowser block", {

  blk1 <- new_filesbrowser_block()

  expect_s3_class(blk1, "data_block")
  expect_s3_class(blk1, "filesbrowser_block")

  blk1 <- initialize_block(blk1)
  res1 <- evaluate_block(blk1)

  expect_equal(nrow(res1), 0L)
  expect_equal(ncol(res1), 0L)

  path <- withr::local_tempfile()
  write.csv(datasets::iris, path, row.names = FALSE)

  blk2 <- new_filesbrowser_block(path)

  expect_s3_class(blk2, "data_block")
  expect_s3_class(blk2, "filesbrowser_block")

  blk2 <- initialize_block(blk2)
  res2 <- evaluate_block(blk2)

  expect_equal(res2, path)
})

test_that("csv parser block", {

  data <- datasets::iris

  path <- withr::local_tempfile()
  write.csv(data, path, row.names = FALSE)

  block <- new_csv_block()

  expect_s3_class(block, "parser_block")
  expect_s3_class(block, "csv_block")

  block <- initialize_block(block, path)
  res <- evaluate_block(block, path)

  expect_equal(nrow(res), nrow(data))
  expect_equal(colnames(res), colnames(data))
})

test_that("json parser block", {

  data <- datasets::iris

  path <- withr::local_tempfile()
  write(jsonlite::toJSON(data), path)

  block <- new_json_block()

  expect_s3_class(block, "parser_block")
  expect_s3_class(block, "json_block")

  block <- initialize_block(block, path)
  res <- evaluate_block(block, path)

  expect_equal(nrow(res), nrow(data))
  expect_equal(colnames(res), colnames(data))
})

test_that("rds parser block", {

  data <- datasets::iris

  path <- withr::local_tempfile()
  saveRDS(data, path)

  block <- new_rds_block()

  expect_s3_class(block, "parser_block")
  expect_s3_class(block, "rds_block")

  block <- initialize_block(block, path)
  res <- evaluate_block(block, path)

  expect_equal(nrow(res), nrow(data))
  expect_equal(colnames(res), colnames(data))
})

test_that("xpt parser block", {

  data <- datasets::iris
  colnames(data) <- gsub("\\.", "_", colnames(data))

  path <- withr::local_tempfile(fileext = ".xpt")
  haven::write_xpt(data, path)

  block <- new_xpt_block()

  expect_s3_class(block, "parser_block")
  expect_s3_class(block, "xpt_block")

  block <- initialize_block(block, path)
  res <- evaluate_block(block, path)

  expect_equal(nrow(res), nrow(data))
  expect_equal(colnames(res), colnames(data))
})

test_that("block title", {
  expect_equal(
    get_block_title(new_dataset_block()),
    tagList(
      span("blockr", class = "badge bg-light"),
      "Data"
    )
  )
})

test_that("blocks can be constructed with default args", {

  for (block in available_blocks()) {
    expect_s3_class(do.call(block, list()), "block")
  }
})

withr::local_package("shinytest2")
withr::local_package("ggplot2")

test_that("block demo works", {
  # Don't run these tests on the CRAN build servers
  skip_on_cran()

  # Helper plot blocks
  new_ggplot_block <- function(col_x = character(), col_y = character(), ...) {
    data_cols <- function(data) colnames(data)

    new_block(
      fields = list(
        x = new_select_field(col_x, data_cols, type = "name"),
        y = new_select_field(col_y, data_cols, type = "name")
      ),
      expr = quote(ggplot2::ggplot(mapping = ggplot2::aes(x = .(x), y = .(y)))),
      class = c("ggplot_block", "plot_block"),
      ...
    )
  }

  new_geompoint_block <- function(...) {
    new_block(
      fields = list(
        color = new_select_field("blue", c("blue", "green", "red"))
      ),
      expr = quote(ggplot2::geom_point(color = .(color))),
      class = c("plot_layer_block", "plot_block"),
      ...
    )
  }

  stack <- new_stack(
    block_1 = new_dataset_block("anscombe"),
    block_2 = new_ggplot_block("x1", "y1"),
    block_3 = new_geompoint_block()
  )

  blocks_app <- serve_stack(stack)

  app <- AppDriver$new(
    blocks_app,
    name = "block-app",
    seed = 4323
  )

  # Init plot inputs
  app$set_inputs(
    "my_stack-block_2-x" = "Ozone",
    "my_stack-block_2-y" = "Solar.R"
  )

  blocks_inputs <- c(
    # Block management
    chr_ply(1:3, \(i) sprintf("my_stack-block_%s-copy", i)),
    chr_ply(1:3, \(i) sprintf("my_stack-remove-block-block_%s", i)),
    # Fields inputs
    "my_stack-block_1-dataset",
    "my_stack-block_2-x",
    "my_stack-block_2-y",
    "my_stack-block_3-color"
  )

  blocks_exports <- chr_ply(1:3, \(i) sprintf("my_stack-block_%s-block", i))

  blocks_outputs <- c(
    "my_stack-block_1-ncol",
    "my_stack-block_1-nrow",
    "my_stack-block_1-res"
  )

  test_plot <- function(i) {
    message("TESTING PLOTS")
    plot_obj <- app$get_values(
      export = sprintf("my_stack-block_%s-res", i)
    )
    # Verify `plot_obj()` is consistent
    vdiffr::expect_doppelganger(
      sprintf("check-plot-%s", i),
      plot_obj
    )
  }

  # Only last block is uncollapsed
  app$expect_values(
    input = blocks_inputs,
    export = blocks_exports,
    output = blocks_outputs
    # We have to test ggplot2 obj separately
    # as they can't be serialized to json
  )

  app$click(selector = ".stack-edit-toggle")
  invisible(
    lapply(1:2, \(i) {
      app$click(
        selector = sprintf("[href=\"#my_stack-block_%s-outputCollapse\"]", i)
      )
    })
  )

  # Uncollapse 2 first blocks: outputs should render
  app$expect_values(
    input = blocks_inputs,
    export = blocks_exports,
    output = blocks_outputs
  )
  # Only block2 and 3 have results
  lapply(2:3, test_plot)

  # Test last block input field
  app$set_inputs("my_stack-block_3-color" = "green")

  app$expect_values(
    input = blocks_inputs,
    export = blocks_exports,
    output = blocks_outputs
  )

  # Change coordinates
  app$set_inputs(
    "my_stack-block_2-x" = "Solar.R",
    "my_stack-block_2-y" = "Wind"
  )

  app$expect_values(
    input = blocks_inputs,
    export = blocks_exports,
    output = blocks_outputs
  )

  # TO DO: Change data
  # app$set_inputs(
  #  "my_stack-block_1-dataset" = "iris"
  # )

  # Remove all blocks starting by the last one
  invisible(
    lapply(3:1, \(i) {
      app$click(
        selector = sprintf("#my_stack-remove-block-block_%s", i)
      )
    })
  )

  app$expect_values(
    input = blocks_inputs,
    export = blocks_exports,
    output = blocks_outputs
  )
})
