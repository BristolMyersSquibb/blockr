library(dplyr)
library(blockr.data)
test_that("data blocks", {
  block <- data_block()

  expect_s3_class(block, "data_block")
  expect_type(block, "list")

  dat <- evaluate_block(block)

  expect_s3_class(dat, "data.frame")

  ui <- generate_ui(block, "foo")

  expect_type(ui, "list")
  expect_s3_class(ui, "shiny.tag")
})

test_that("filter blocks", {
  data <- datasets::iris

  block <- filter_block(data)

  expect_s3_class(block, "filter_block")
  expect_type(block, "list")

  res <- evaluate_block(block, data)

  expect_identical(nrow(res), nrow(data))

  block <- filter_block(data, "Species", "setosa")

  res <- evaluate_block(block, data)

  expect_identical(nrow(res), nrow(data[data$Species == "setosa", ]))
})

test_that("select blocks", {
  data <- datasets::iris

  block <- select_block(data)

  expect_s3_class(block, "select_block")
  expect_type(block, "list")

  res <- evaluate_block(block, data)

  expect_identical(nrow(res), nrow(data))
  expect_equal(ncol(res), 1)
  expect_equal(colnames(res), colnames(data)[1])
})

test_that("arrange blocks", {
  data <- datasets::iris
  min_sepal_len <- min(data$Sepal.Length)

  block <- arrange_block(data)

  expect_s3_class(block, "arrange_block")
  expect_type(block, "list")

  res <- evaluate_block(block, data)

  expect_identical(nrow(res), nrow(data))
  expect_equal(ncol(res), ncol(data))
  expect_equal(res[1, colnames(data)[1]], min_sepal_len)
})

test_that("group_by blocks", {
  data <- datasets::iris
  block <- group_by_block(data, columns = "Species")

  expect_s3_class(block, "group_by_block")
  expect_type(block, "list")

  res <- evaluate_block(block, data) %>% summarise(n = n())

  expect_equal(nrow(res), 3)
})

test_that("join blocks", {
  block <- join_block(band_members, y = "band_instruments", type = "left")

  expect_s3_class(block, "join_block")
  expect_type(block, "list")

  res <- evaluate_block(block, band_members)

  expect_equal(nrow(res), 3)

  block <- join_block(band_members, y = "band_instruments", type = "inner")
  res <- evaluate_block(block, band_members)
  expect_equal(nrow(res), 2)
})

test_that("plot block", {
  data <- merged_data |>
    filter(LBTEST == "Hemoglobin") |>
    filter(!startsWith(VISIT, "UNSCHEDULED")) |>
    arrange(VISITNUM) |>
    mutate(
      VISIT = factor(
        VISIT,
        levels = unique(VISIT),
        ordered = TRUE
      )
    ) |>
    group_by(VISIT, ACTARM) |>
    summarise(
      Mean = mean(LBSTRESN, na.rm = TRUE),
      SE = sd(LBSTRESN, na.rm = TRUE) / sqrt(n()),
      .groups = "drop"
    ) |>
    rowwise() |>
    mutate(ymin = Mean - SE, ymax = Mean + SE)

  block <- plot_block(data)

  expect_s3_class(block, "plot_block")
  expect_type(block, "list")

  res <- evaluate_block(block, data)
  expect_s3_class(res, "ggplot")
  # TO DO: more testing for ggplot2 element ...
})
