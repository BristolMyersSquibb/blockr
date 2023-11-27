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

block_registry <- new.env()

#' @param constructor Block constructor
#' @param name,description Metadata describing the block
#' @param classes Block classes
#' @param input,output Object types the block consumes and produces
#'
#' @rdname available_blocks
#' @export
register_block <- function(constructor, name, description, classes, input,
                           output) {

  descr <- new_block_descr(constructor, name, description, classes, input,
                           output)

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
  get(id, envir = block_registry)
}
