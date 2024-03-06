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
#' @import blockr.data
#' @import dplyr
#' @importFrom stats setNames
new_block <- function(fields, expr, name = rand_names(), ...,
                      class = character()) {
  stopifnot(
    is.list(fields),
    all(lgl_ply(fields, is_field)),
    is.language(expr),
    is_string(name)
  )

  # Add submit button
  if ("submit_block" %in% class) {
    fields <- c(
      fields,
      submit = list(new_submit_field())
    )
  }

  structure(fields,
    name = name, expr = expr, result = NULL, ...,
    class = c(class, "block")
  )
}

#' @param x An object inheriting form `"block"`
#' @rdname new_block
#' @export
is_block <- function(x) {
  inherits(x, "block")
}

#' @rdname new_block
#' @export
is_initialized <- function(x) {
  UseMethod("is_initialized")
}

#' @rdname new_block
#' @export
is_initialized.block <- function(x) {
  all(lgl_ply(x, is_initialized))
}

#' @rdname new_block
#' @export
initialize_block <- function(x, ...) {
  UseMethod("initialize_block")
}

#' @rdname new_block
#' @export
generate_code <- function(x) {
  UseMethod("generate_code")
}

#' @rdname new_block
#' @export
generate_code.block <- function(x) {
  do.call(
    bquote,
    list(
      attr(x, "expr"),
      where = lapply(x, type_trans),
      splice = FALSE
    )
  )
}

#' @rdname new_block
#' @export
generate_code.arrange_block <- function(x) {
  where <- lapply(x, type_trans)

  do.call(
    bquote,
    list(
      attr(x, "expr"),
      where = lapply(where, as.list),
      splice = TRUE
    )
  )
}

generate_code.group_by_block <- generate_code.arrange_block

#' @rdname new_block
#' @export
generate_code.transform_block <- function(x) {
  if (!is_initialized(x)) {
    return(quote(identity()))
  }

  NextMethod()
}

#' @rdname new_block
#' @export
generate_code.plot_block <- function(x) {
  if (!is_initialized(x)) {
    return(quote(identity()))
  }

  NextMethod()
}

#' @rdname new_block
#' @export
generate_code.data_block <- function(x) {
  if (!is_initialized(x)) {
    return(quote(data.frame()))
  }

  NextMethod()
}

#' @rdname new_block
#' @export
generate_code.call <- function(x) {
  x
}

#' @rdname new_block
#' @export
evaluate_block <- function(x, ...) {
  UseMethod("evaluate_block")
}

#' @rdname new_block
#' @export
evaluate_block.data_block <- function(x, ...) {
  stopifnot(...length() == 0L)
  eval(generate_code(x), new.env())
}

#' @param data Result from previous block
#' @rdname new_block
#' @export
evaluate_block.transform_block <- function(x, data, ...) {
  stopifnot(...length() == 0L)
  eval(
    substitute(data %>% expr, list(expr = generate_code(x))),
    list(data = data)
  )
}

#' @param data Result from previous block
#' @rdname new_block
#' @export
evaluate_block.plot_block <- function(x, data, ...) {
  stopifnot(...length() == 0L)
  eval(
    substitute(data %>% expr, list(expr = generate_code(x))),
    list(data = data)
  )
}

#' @param data Result from previous block
#' @rdname new_block
#' @export
evaluate_block.plot_layer_block <- function(x, data, ...) {
  stopifnot(...length() == 0L)
  eval(
    substitute(data + expr, list(expr = generate_code(x))),
    list(data = data)
  )
}

#' @rdname new_block
#' @export
initialize_block.data_block <- function(x, ...) {
  env <- list()

  for (field in names(x)) {
    x[[field]] <- initialize_field(x[[field]], env)
    env <- c(env, set_names(list(value(x[[field]])), field))
  }

  x
}

#' @rdname new_block
#' @export
initialize_block.transform_block <- function(x, data, ...) {
  env <- list(data = data)

  for (field in names(x)) {
    x[[field]] <- initialize_field(x[[field]], env)
    env <- c(env, set_names(list(value(x[[field]])), field))
  }

  x
}

#' @rdname new_block
#' @export
initialize_block.default <- initialize_block.transform_block

#' @rdname new_block
#' @export
initialize_block.plot_block <- initialize_block.transform_block

#' @rdname new_block
#' @export
update_fields <- function(x, ...) {
  UseMethod("update_fields")
}

#' @param session Shiny session
#' @rdname new_block
#' @export
update_fields.data_block <- function(x, session, ...) {
  args <- list(...)

  stopifnot(setequal(names(args), names(x)))

  for (field in names(x)) {
    env <- args[-which(names(args) == field)]

    x[[field]] <- update_field(x[[field]], args[[field]], env)
    ui_update(x[[field]], session, field, field)
  }

  x
}

#' @param data Block input data
#' @rdname new_block
#' @export
update_fields.transform_block <- function(x, session, data, ...) {
  args <- list(...)

  stopifnot(setequal(names(args), names(x)))

  for (field in names(x)) {
    env <- c(
      list(data = data),
      args[-which(names(args) == field)]
    )

    x[[field]] <- update_field(x[[field]], args[[field]], env)
    ui_update(x[[field]], session, field, field)
  }

  x
}

#' @rdname new_block
#' @export
update_fields.plot_block <- update_fields.transform_block
