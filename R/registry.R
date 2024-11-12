#' Block registry
#'
#' List available blocks.
#'
#' @export
available_blocks <- function() {
  lapply(set_names(nm = list_blocks()), get_block_descr)
}

block_descr_getter <- function(field) {
  field <- force(field)

  function(x) {
    stopifnot(inherits(x, "block_descr"))

    attr(x, field)
  }
}

block_descrs_getter <- function(descr_getter, ptype = character(1L)) {
  getter <- force(descr_getter)

  function(blocks = available_blocks()) {
    if (inherits(blocks, "block_descr")) {
      blocks <- list(blocks)
    }

    vapply(blocks, descr_getter, ptype)
  }
}

#' @param blocks Block description object(s)
#' @rdname available_blocks
#' @export
block_name <- block_descrs_getter(block_descr_getter("name"))

#' @rdname available_blocks
#' @export
block_descr <- block_descrs_getter(block_descr_getter("description"))

new_block_descr <- function(constructor, name, description, id, classes, input,
                            output, pkg, category) {
  stopifnot(
    is.function(constructor), is_string(name), is_string(description),
    is_string(category), is.character(classes), length(classes) >= 1L,
    is.function(input), is_string(pkg), is_string(id)
  )

  structure(
    constructor, name = name, description = description, id = id,
    classes = classes, input = input, output = output,
    package = pkg, category = category, class = "block_descr"
  )
}

block_registry <- new.env()

#' @param constructor Block constructor
#' @param name,description Metadata describing the block
#' @param classes Block classes
#' @param input,output Object types the block consumes and produces
#' @param package Package where block is defined
#' @param id Block registry ID
#' @param category Useful to sort blocks by topics. If not specified,
#' blocks are uncategorized.
#'
#' @rdname available_blocks
#' @export
register_block <- function(
    constructor,
    name,
    description,
    ptype = constructor(),
    classes = class(ptype),
    input = get_s3_method("block_input_check", ptype),
    output = block_output_ptype(ptype),
    id = classes[1L],
    package = NA_character_,
    category = "uncategorized") {

  descr <- new_block_descr(
    constructor,
    name,
    description,
    id, classes,
    input,
    output,
    package,
    category
  )

  if (id %in% list_blocks()) {
    warning("block ", id, " already exists and will be overwritten.")
  }

  assign(id, descr, envir = block_registry)
}

get_s3_method <- function(generic, obj) {

  for (cls in class(obj)) {
    res <- try(utils::getS3method("block_input_check", cls), silent = TRUE)
    if (!inherits(res, "try-error")) {
      return(res)
    }
  }

  stop("no method found for generic ", generic, "and classes ",
       paste0(class(obj), collapse = ", "))
}

#' @param ... Forwarded to `register_block()`
#' @rdname available_blocks
#' @export
register_blocks <- function(...) {

  arg_processor <- function(constructor, ...) {

    wrap_list <- function(x) {
      if (length(x) > 1L) list(x) else x
    }

    if (length(constructor) > 1L) {
      return(c(list(constructor), list(...)))
    }

    c(list(constructor), lapply(list(...), wrap_list))
  }

  invisible(
    do.call(Map, c(register_block, arg_processor(...)))
  )
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

  register_blocks(
    constructor = c(
      new_dataset_block,
      new_result_block,
      new_upload_block,
      new_filesbrowser_block,
      new_csv_block,
      new_rds_block,
      new_json_block,
      new_xpt_block,
      new_filter_block,
      new_select_block,
      new_summarize_block,
      new_arrange_block,
      new_group_by_block,
      new_join_block,
      new_head_block,
      new_mutate_block
    ),
    name = c(
      "data block",
      "result block",
      "upload block",
      "filesbrowser block",
      "csv block",
      "rds block",
      "json block",
      "xpt block",
      "filter block",
      "select block",
      "summarize block",
      "arrange block",
      "group by block",
      "join block",
      "head block",
      "mutate block"
    ),
    description = c(
      "Choose a dataset from a package",
      "Shows result of another stack as data source",
      "Upload files from location",
      "Select files on the server file system",
      "Read a csv dataset",
      "Read a rds dataset",
      "Read a json dataset",
      "Read a xpt dataset",
      "filter rows in a table",
      "select columns in a table",
      "summarize data groups",
      "Arrange columns",
      "Group by columns",
      "Join 2 datasets",
      "Select n first rows of dataset",
      "Mutate block"
    ),
    package = pkg,
    category = c(
      "data",
      "data",
      "data",
      "data",
      "parser",
      "parser",
      "parser",
      "parser",
      "transform",
      "transform",
      "transform",
      "transform",
      "transform",
      "transform",
      "transform",
      "transform"
    )
  )
}

#' @param block Block name or description object
#' @rdname available_blocks
#' @export
construct_block <- function(block, ...) {

  if (is_string(block)) {
    block <- get_block_descr(block)
  }

  stopifnot(inherits(block, "block_descr"))

  block(...)
}

are_blocks_compatible <- function(x, y) {

  stopifnot(inherits(x, "block_descr"))

  tryCatch(
    {
      attr(x, "input")(x(), y)
      TRUE
    },
    input_failure = function(e) {
      structure(FALSE, msg = conditionMessage(e))
    }
  )
}

#' Find stack compatible blocks
#'
#' Given a stack, we use the registry to find
#' what are the blocks compatible with the last stack block.
#' If the stack is empy, we return data blocks.
#'
#' @param stack Stack object.
#'
#' @return a dataframe.
#'
#' @export
get_compatible_blocks <- function(stack) {

  if (length(stack)) {
    dat <- block_output_ptype(stack[[length(stack)]])
  } else {
    dat <- NULL
  }

  blocks <- available_blocks()
  blocks[lgl_ply(blocks, are_blocks_compatible, dat)]
}
