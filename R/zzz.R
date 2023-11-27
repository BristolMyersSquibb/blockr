.onLoad <- function(libname, pkgname) {

  Map(
    register_block,
    c(new_data_block, new_filter_block, new_select_block, new_summarize_block),
    c("data block", "filter block", "select block", "summarize block"),
    c("choose a dataset", "filter rows in a table",
      "select columns in a table", "summarize data groups"),
    list(
      c("dataset_block", "data_block"),
      c("filter_block", "transform_block", "submit_block"),
      c("select_block", "transform_block"),
      c("summarize_block", "transform_block", "submit_block")
    ),
    c(NA_character_, "data.frame", "data.frame", "data.frame"),
    c("data.frame", "data.frame", "data.frame", "data.frame")
  )

  invisible(NULL)
}
