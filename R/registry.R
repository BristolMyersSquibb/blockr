#' Block registry
#'
#' List available blocks.
#'
#' @export
available_blocks <- function() {
	
  Map(
    new_block_descr,
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
}

block_descr_getter <- function(field) {
  field <- force(field)
  function(x) {
    stopifnot(inherits(x, "block_descr"))
    attr(x, field)
  }
}

#' @param x Block descriptino object
#' @rdname available_blocks
#' @export
block_name <- block_descr_getter("name")

#' @rdname available_blocks
#' @export
block_descr <- block_descr_getter("description")

new_block_descr <- function(ctor, name, description, classes, input, output) {

  stopifnot(
    is.function(ctor), is_string(name), is_string(description),
    is.character(classes), length(classes) >= 1L,
    is_string(input), is_string(output)
  )

  structure(
    ctor, name = name, description = description, classes = classes,
    input = input, output = output, class = "block_descr"
  )
}
