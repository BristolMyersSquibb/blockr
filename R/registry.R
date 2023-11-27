#' Block registry
#'
#' List available blocks.
#'
#' @export
available_blocks <- function() {
  lapply(list_blocks(), get_block_descr)
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

new_block_descr <- function(ctor, name, description, classes, input, output,
                            pkg) {

  stopifnot(
    is.function(ctor), is_string(name), is_string(description),
    is.character(classes), length(classes) >= 1L,
    is_string(input), is_string(output), is_string(pkg)
  )

  structure(
    ctor, name = name, description = description, classes = classes,
    input = input, output = output, package = pkg, class = "block_descr"
  )
}

block_registry <- new.env()

#' @param constructor Block constructor
#' @param name,description Metadata describing the block
#' @param classes Block classes
#' @param input,output Object types the block consumes and produces
#' @param package Package where block is defined
#'
#' @rdname available_blocks
#' @export
register_block <- function(constructor, name, description, classes, input,
                           output, package = NA_character_) {

  descr <- new_block_descr(constructor, name, description, classes, input,
                           output, package)

  id <- classes[1L]

  if (id %in% list_blocks()) {
    warning("block ", id, " already exists and will be overwritten.")
  }

  assign(id, descr, envir = block_registry)
}

list_blocks <- function() {
  ls(envir = block_registry)
}

get_block_descr <- function(id) {
  res <- get(id, envir = block_registry, inherits = FALSE)
  stopifnot(inherits(res, "block_descr"))
  res
}

#' @param ids Character vector of block IDs (first entry in class attribute)
#' @rdname available_blocks
#' @export
unregister_blocks <- function(ids = NULL, package = NULL) {

  if (is.null(ids) && is.null(package)) {

    ids <- list_blocks()

  } else if (not_null(package)) {

    stopifnot(is_string(package))

    pkgs <- eapply(block_registry, `attr`, "package")

    if (not_null(ids)) {
      pkgs <- pkgs[ids]
    }

    ids <- names(pkgs)[lgl_ply(pkgs, identical, package)]
  }

  rm(list = ids, envir = block_registry, inherits = FALSE)
}

register_blockr_blocks <- function(pkg) {

  if (missing(pkg)) {
    pkg <- pkg_name()
  }

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
    c("data.frame", "data.frame", "data.frame", "data.frame"),
    pkg
  )
}
