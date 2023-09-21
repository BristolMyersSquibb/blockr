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
  all(lengths(x) > 0L)
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

  is_dataset_eligible <- function(x) {
    inherits(
      get(x, envir = as.environment("package:datasets"), inherits = FALSE),
      "data.frame"
    )
  }

  datasets <- ls(envir = as.environment("package:datasets"))
  datasets <- datasets[lgl_ply(datasets, is_dataset_eligible)]

  fields <- list(
    dataset = select_field("iris", datasets)
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

#' @param dat Tabular data to filter (rows)
#' @param column,value Definition of the equality filter
#' @rdname new_block
#' @export
new_filter_block <- function(dat, column = character(),
                             value = character(), ...) {

  fields <- list(
    column = select_field(column, colnames(dat), type = "name"),
    value = string_field(value)
  )

  expr <- quote(
    dplyr::filter(.(column) == .(value))
  )

  new_block(
    fields = fields,
    expr = expr,
    ptype = dat[0L, ],
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

set_field_value <- function(x, field, value) {

  stopifnot(inherits(x, "block"))

  value(x[[field]]) <- value

  x
}

set_field_values <- function(x, ...) {

  values <- list(...)
  fields <- names(values)

  for (field in fields) {
    value(x[[field]]) <- values[[field]]
  }

  x
}

#' @rdname new_block
#' @export
update_fields <- function(x, ...) {
  UseMethod("update_fields")
}

#' @rdname new_block
#' @export
update_fields.block <- function(x, ...) {
  x
}

#' @param session Shiny session
#' @rdname new_block
#' @export
update_fields.filter_block <- function(x, data, session, ...) {

  col_field <- x[["column"]]
  col_choices <- colnames(data)

  if (identical(col_choices, attr(col_field, "choices"))) {
    return(x)
  }

  if (!col_field %in% col_choices) {

    value(x[["column"]]) <- character()
    meta(x[["column"]], "choices") <- col_choices
    value(x[["column"]]) <- col_choices[1L]

    value(x[["value"]]) <- character()

    ui_update(x[["value"]], session, "value", "value")

  } else {

    meta(x[["column"]], "choices") <- col_choices
  }

  ui_update(x[["column"]], session, "column", "column")

  x
}

#' @rdname new_block
#' @export
update_ptype <- function(x, value) {
  UseMethod("update_ptype")
}

#' @rdname new_block
#' @export
update_ptype.block <- function(x, value) {
  attr(x, "ptype") <- value
  x
}

#' @rdname new_block
#' @export
ptype <- function(x) {
  attr(x, "ptype")
}

#' @rdname new_block
#' @export
`ptype<-` <- function(x, value) {
  update_ptype(x, value)
}
