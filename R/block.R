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
new_block <- function(fields, expr, name = rand_names(), ...,
                      class = character()) {

  stopifnot(
    is.list(fields), length(fields) >= 1L, all(lgl_ply(fields, is_field)),
    is.language(expr),
    is_string(name)
  )

  env <- list2env(fields, parent = pkg_env())

	structure(env, name = name, expr = expr, result = NULL, ...,
            class = c(class, "block"))
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
  do.call(bquote, list(attr(x, "expr"), where = eapply(x, type_trans)))
}

#' @rdname new_block
#' @export
evalute_block <- function(x, ...) {
  UseMethod("evalute_block")
}

#' @rdname new_block
#' @export
evalute_block.block <- function(x, ...) {
  stop("no base-class evaulator for blocks available")
}

#' @rdname new_block
#' @export
evalute_block.data_block <- function(x, ...) {
  stopifnot(...length() == 0L)
  eval(generate_code(x), new.env())
}

#' @param data Result from previous block
#' @rdname new_block
#' @export
evalute_block.transform_block <- function(x, data, ...) {

  stopifnot(...length() == 0L)

  eval(
    substitute(data %>% expr, list(expr = generate_code(x))),
    list(data = data)
  )
}

#' @rdname new_block
#' @export
new_data_block <- function(...) {

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
    ...,
    class = c("dataset_block", "data_block")
  )
}

#' @param dat Tabular data to filter (rows)
#' @param col,val Definition of the equality filter
#' @rdname new_block
#' @export
new_filter_block <- function(dat, col = colnames(dat)[1L],
                             val = NA_character_, ...) {

  cols <- colnames(dat)

  fields <- list(
    column = select_field(col, cols, type = "name"),
    value = string_field(val)
  )

  if (is.na(val)) {
    expr <- quote(identity())
  } else {
    expr <- quote(
      dplyr::filter(.(column) == .(value))
    )
  }

  new_block(
    fields = fields,
    expr = expr,
    ...,
    class = c("filter_block", "transform_block")
  )
}

type_trans <- function(x) {
  switch(
    attr(x, "type"),
    literal = c(x),
    name = as.name(x)
  )
}

get_field_names <- function(x) {

  stopifnot(inherits(x, "block"))

  ls(envir = x)
}

get_field_values <- function(x, fields = NULL) {

  stopifnot(inherits(x, "block"))

  if (is.null(fields)) {
    fields <- get_field_names(x)
  }

  set_names(
    lapply(fields, function(f) x[[f]]),
    fields
  )
}

get_field_value <- function(x, field) {
  get_field_values(x, field)[[field]]
}

set_field_value <- function(x, field, value) {

  old <- get_field_value(x, field)
  new <- value

  attributes(new) <- attributes(old)

  assign(field, validate_field(new), envir = x)

  invisible(x)
}

set_field_values <- function(x, ...) {

  values <- list(...)
  fields <- names(values)

  Map(set_field_value, list(x), fields, values)

  invisible(x)
}
