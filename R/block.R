#' Blocks
#'
#' Blocks consist of a set of fields, an expression that defines what the block
#' produces (given the result of the previous block combined with user input),
#' plus some meta data.
#'
#' @param name Block name
#' @param fields A list of field, each entry inheriting from `"field"`
#' @param expr A quoted expression (compatible with partial substitution as
#' implemented in [base::bquote()] and intended for evaluation in the context
#' of the fields)
#' @param ... Further (metadata) attributes
#' @param class Block subclass
#'
#' @export
new_block <- function(fields, expr, name, ..., class = character()) {

  stopifnot(
    is.list(fields), length(fields) >= 1L, all(lgl_ply(fields, is_field)),
    is.language(expr),
    is_string(name)
  )

	structure(fields, name = name, expr = expr, ..., class = c(class, "block"))
}

#' @param x An object inheriting form `"block"`
#' @rdname new_block
#' @export
is_block <- function(x) {
  inherits(x, "block")
}

#' @rdname new_block
#' @export
generate_code <- function(x) {
  UseMethod("generate_code")
}

#' @rdname new_block
#' @export
generate_code.block <- function(x) {
  do.call(bquote, list(attr(x, "expr"), where = x))
}

#' @rdname new_block
#' @export
evalute_block <- function(x) {
  UseMethod("evalute_block")
}

#' @rdname new_block
#' @export
evalute_block.block <- function(x) {
  eval(generate_code(x), new.env())
}

#' @rdname new_block
#' @export
new_data_block <- function() {

  datasets <- ls(envir = as.environment("package:datasets"))

  fields <- list(
    dataset = select_field("iris", datasets)
  )

  expr <- quote(
    get(
      .(dataset),
      envir = as.environment("package:datasets"),
      mode = "list",
      inherits = FALSE
    )
  )

  new_block(
    fields = fields,
    expr = expr,
    name = rand_names(),
    class = "data_block"
  )
}
