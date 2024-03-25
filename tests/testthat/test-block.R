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

  block <- join_block(
    dplyr::band_members,
    dplyr::band_instruments
  )

  expect_s3_class(block, "join_block")
  expect_type(block, "list")

  res <- evaluate_block(block, dplyr::band_members)

  expect_equal(nrow(res), 3)

  block <- join_block(
    dplyr::band_members,
    dplyr::band_instruments,
    type = "inner",
  )

  res <- evaluate_block(block, dplyr::band_members)

  expect_equal(nrow(res), 2)
})

test_that("head blocks", {
  data <- datasets::iris
  # Min is 1. As 12 > 1, validate_field.numeric_field
  # returns TRUE and does not change n_rows.
  block <- head_block(data, n_rows = 12L)

  expect_s3_class(block, "head_block")
  expect_type(block, "list")

  res <- evaluate_block(block, data)

  expect_equal(nrow(res), 12)

  # Now, we set n_rows to be lower than the allowed minimum which is 1.
  # validate_field.numeric_field is responsible for restoring n_rows
  # to an acceptable value, that is 1.
  block <- head_block(data, n_rows = -5L)
  res <- evaluate_block(block, data)
  expect_equal(nrow(res), 1)

  # The same above the maximum (nrow(data))
  block <- head_block(data, n_rows = nrow(data) + 1000)
  res <- evaluate_block(block, data)
  expect_equal(nrow(res), nrow(data))
})

test_that("summarize block", {
  data <- datasets::iris
  block <- summarize_block(data, func = "mean", default_column = "Sepal.Length")

  expect_s3_class(block, "summarize_block")
  expect_type(block, "list")

  res <- evaluate_block(block, data)
  expect_equal(colnames(res), toupper(block$funcs$value))
  expect_equal(nrow(res), 1)
  expect_equal(ncol(res), 1)

  expect_error(summarize_block(
    data,
    func = c("mean", "se"),
    default_column = "Sepal.Length"
  ))

  block <- summarize_block(
    data,
    func = c("mean", "se"),
    default_column = rep("Sepal.Length", 2)
  )
  res <- evaluate_block(block, data)
  expect_equal(colnames(res), toupper(block$funcs$value))
  expect_equal(nrow(res), 1)
  expect_equal(ncol(res), 2)
})

test_that("upload block", {
  block <- upload_block()

  expect_s3_class(block, "upload_block")
  expect_type(block, "list")

  expect_length(value(block$file), 0)

  ui <- generate_ui(block, "foo")
  expect_type(ui, "list")
  expect_s3_class(ui, "shiny.tag")
})

test_that("filesbrowser block", {
  block <- filesbrowser_block()

  expect_s3_class(block, "filesbrowser_block")
  expect_type(block, "list")
  field <- block$file
  expect_identical(unname(field$volumes), path.expand("~"))

  ui <- generate_ui(block, "foo")
  expect_type(ui, "list")
  expect_s3_class(ui, "shiny.tag")
  shinyFiles_ui <- htmltools::tagQuery(ui)$
    find(".shinyFiles")$
  selectedTags()

  expect_length(shinyFiles_ui, 1)
})

test_that("csv parser block", {
  tmp_file <- tempfile(fileext = ".csv")
  utils::write.csv(iris, tmp_file, row.names = FALSE)
  block <- csv_block(tmp_file)

  expect_s3_class(block, c("csv_block", "parser_block", "transform_block"))
  expect_type(block, "list")

  dat <- evaluate_block(block, tmp_file)
  expect_identical(colnames(iris), colnames(dat))
  unlink(tmp_file)

  expect_s3_class(dat, "data.frame")
})

test_that("json parser block", {
  tmp_file <- tempfile(fileext = ".json")
  write(jsonlite::toJSON(iris), tmp_file)
  block <- json_block(tmp_file)

  expect_s3_class(block, c("json_block", "parser_block", "transform_block"))
  expect_type(block, "list")

  dat <- evaluate_block(block, tmp_file)
  expect_identical(colnames(iris), colnames(dat))
  unlink(tmp_file)

  expect_s3_class(dat, "data.frame")
})

test_that("rds parser block", {
  tmp_file <- tempfile(fileext = ".rds")
  saveRDS(iris, tmp_file)
  block <- rds_block(tmp_file)

  expect_s3_class(block, c("rds_block", "parser_block", "transform_block"))
  expect_type(block, "list")

  dat <- evaluate_block(block, tmp_file)
  expect_identical(colnames(iris), colnames(dat))
  unlink(tmp_file)

  expect_s3_class(dat, "data.frame")
})

test_that("sas parser block", {
  skip_on_cran()
  tmp_file <- tempfile(fileext = ".sas7bdat")
  tmp_dat <- iris
  colnames(tmp_dat) <- gsub("\\.", "_", colnames(tmp_dat))
  # Remove deprecated message from haven ...
  suppressWarnings(haven::write_sas(tmp_dat, tmp_file))
  block <- sas_block(tmp_file)

  expect_s3_class(block, c("sas_block", "parser_block", "transform_block"))
  expect_type(block, "list")

  dat <- evaluate_block(block, tmp_file)
  expect_identical(colnames(tmp_dat), colnames(dat))
  unlink(tmp_file)

  expect_s3_class(dat, "data.frame")
})

test_that("xpt parser block", {
  tmp_file <- tempfile(fileext = ".xpt")
  haven::write_xpt(mtcars, tmp_file)
  block <- xpt_block(tmp_file)

  expect_s3_class(block, c("xpt_block", "parser_block", "transform_block"))
  expect_type(block, "list")

  dat <- evaluate_block(block, tmp_file)
  expect_identical(colnames(mtcars), colnames(dat))
  unlink(tmp_file)

  expect_s3_class(dat, "data.frame")
})

test_that("block title", {
  expect_equal(
    get_block_title(data_block()),
    tagList(
      span("blockr", class = "badge bg-light"),
      "Data"
    )
  )
})
