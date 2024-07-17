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

#' @param x An object inheriting from `"block"`
#' @rdname new_block
#' @export
is_block <- function(x) {
  inherits(x, "block")
}

#' Initialize block generic
#'
#' Initializes all fields composing the block.
#'
#' @seealso See \link{initialize_field}.
#' @rdname initialize_block
#' @inheritParams evaluate_block
#' @returns The block element.
#' @export
initialize_block <- function(x, ...) {
  UseMethod("initialize_block")
}

#' @rdname initialize_block
#' @export
initialize_block.data_block <- function(x, ...) {

  env <- list()

  for (field in names(x)) {
    x[[field]] <- initialize_field(x[[field]], env)
    env <- c(env, set_names(list(field_value(x[[field]])), field))
  }

  x
}

#' @rdname initialize_block
#' @export
initialize_block.block <- function(x, data, ...) {

  env <- list(data = data)

  for (field in names(x)) {
    x[[field]] <- initialize_field(x[[field]], env)
    env <- c(env, set_names(list(field_value(x[[field]])), field))
  }

  x
}

#' S3 generic for initialization
#'
#' Checks if a block or field (currently implemented methods)
#' is initialized.
#'
#' @rdname initialize
#' @returns Boolean value.
#' @param x Element to check.
#' @export
is_initialized <- function(x) {
  UseMethod("is_initialized")
}

#' @rdname initialize
#' @export
is_initialized.block <- function(x) {
  all(lgl_ply(x, is_initialized))
}

#' Generate code generic
#'
#' For a given block, generate the code contained
#' in the `expr` attribute. Needed by \link{evaluate_block}
#' and \link{block_combiner} to generate the entire stack code.
#'
#' @rdname generate_code
#' @inheritParams new_block
#' @export
generate_code <- function(x) {
  UseMethod("generate_code")
}

#' @rdname generate_code
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

#' @rdname generate_code
#' @export
generate_code.arrange_block <- function(x) {

  if (!is_initialized(x)) {
    return(quote(identity()))
  }

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

#' @rdname generate_code
#' @export
generate_code.group_by_block <- function(x) {

  if (!is_initialized(x)) {
    return(quote(identity()))
  }

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

#' @rdname generate_code
#' @export
generate_code.transform_block <- function(x) {
  if (!is_initialized(x)) {
    return(quote(identity()))
  }

  NextMethod()
}

#' @rdname generate_code
#' @export
generate_code.plot_block <- function(x) {
  if (!is_initialized(x)) {
    return(quote(identity()))
  }

  NextMethod()
}

#' @rdname generate_code
#' @export
generate_code.data_block <- function(x) {
  if (!is_initialized(x)) {
    return(quote(data.frame()))
  }

  NextMethod()
}

#' @rdname generate_code
#' @export
generate_code.call <- function(x) {
  x
}

#' Evaluate a block generic
#'
#' Calls \link{generate_code} and evaluate it
#' in the relevant environment.
#'
#' @rdname evaluate_block
#' @inherit new_block
#' @param ... For generic consistency.
#' @export
evaluate_block <- function(x, ...) {
  UseMethod("evaluate_block")
}

#' @rdname evaluate_block
#' @export
evaluate_block.data_block <- function(x, ...) {

  stopifnot(...length() == 0L)

  eval(generate_code(x), new.env())
}

#' @param data Result from previous block
#' @rdname evaluate_block
#' @export
evaluate_block.block <- function(x, data, ...) {

  stopifnot(...length() == 0L)

  eval(
    substitute(data %>% expr, list(expr = generate_code(x))),
    list(data = data)
  )
}

#' @rdname evaluate_block
#' @export
evaluate_block.plot_layer_block <- function(x, data, ...) {

  stopifnot(...length() == 0L, inherits(data, "ggplot"))

  eval(
    substitute(data + expr, list(expr = generate_code(x))),
    list(data = data)
  )
}

#' Update fields generic
#'
#' For a block, update all its fields.
#'
#' @seealso See \link{update_field}.
#' @inheritParams initialize_block
#' @rdname update_fields
#' @export
update_fields <- function(x, ...) {
  UseMethod("update_fields")
}

#' @param session Shiny session
#' @rdname update_fields
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
#' @rdname update_fields
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

#' @rdname update_fields
#' @export
update_fields.plot_block <- update_fields.transform_block
