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

  structure(fields, name = name, expr = expr, result = NULL, ...,
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
  do.call(bquote, list(attr(x, "expr"), where = lapply(x, type_trans)))
}

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
evalute_block <- function(x, ...) {
  UseMethod("evalute_block")
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

  is_dataset_eligible <- function(x) {
    inherits(
      get(x, envir = as.environment("package:datasets"), inherits = FALSE),
      "data.frame"
    )
  }

  datasets <- ls(envir = as.environment("package:datasets"))
  datasets <- datasets[lgl_ply(datasets, is_dataset_eligible)]

  fields <- list(
    dataset = new_select_field("iris", datasets)
  )

  expr <- quote(
    get(.(dataset), envir = as.environment("package:datasets"))
  )

  new_block(
    fields = fields,
    expr = expr,
    ...,
    class = c("dataset_block", "data_block")
  )
}

#' @rdname new_block
#' @export
data_block <- function(...) {
  initialize_block(new_data_block(...))
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

#' @param data Tabular data to filter (rows)
#' @param column,value Definition of the equality filter
#' @rdname new_block
#' @export
new_filter_block <- function(data, column = colnames(data)[1L],
                             value = character(), ...) {

  field_type <- function(data, column) {
    switch(
      class(data[[column]]),
      factor = "select_field",
      numeric = "range_field",
      "string_field"
    )
  }

  field_args <- function(data, column) {

    col <- data[[column]]

    switch(
      class(col),
      factor = list(choices = levels(col)),
      numeric = list(min = min(col), max = max(col)),
      list()
    )
  }

  filter_exp <- function(data, column, value) {
    switch(
      class(data[[column]]),
      numeric = bquote(
        dplyr::between(.(col), ..(vals)),
        list(col = as.name(column), vals = value),
        splice = TRUE
      ),
      bquote(.(col) == .(val), list(col = as.name(column), val = value))
    )
  }

  col_choices <- function(data) colnames(data)

  fields <- list(
    column = new_select_field(column, col_choices),
    value = new_variable_field(value, field_type, field_args),
    expression = new_hidden_field(filter_exp)
  )

  expr <- quote(
    dplyr::filter(.(expression))
  )

  new_block(
    fields = fields,
    expr = expr,
    ...,
    class = c("filter_block", "transform_block")
  )
}

#' @rdname new_block
#' @export
filter_block <- function(data, ...) {
  initialize_block(new_filter_block(data, ...), data)
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
