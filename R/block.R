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
generate_code <- function(x) {
  UseMethod("generate_code")
}

#' @rdname new_block
#' @export
generate_code.block <- function(x) {
  tmp_expr <- if (inherits(x, "filter_block")) {
     if (is.na(x[["value"]]) || nchar(x[["value"]]) == 0) {
      attr(x, "default_expr")
    } else {
      attr(x, "expr")
    }
  } else {
    attr(x, "expr")
  }
  do.call(bquote, list(tmp_expr, where = lapply(x, type_trans)))
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

  new_block(
    fields = fields,
    default_expr = quote(identity()),
    expr = quote(
      dplyr::filter(.(column) == .(value))
    ),
    ...,
    class = c("filter_block", "transform_block")
  )
}

#' @param dat Tabular data in which to select some columns.
#' @param cols Column(s) to select.
#' @rdname new_block
#' @export
new_select_block <- function(dat, cols = colnames(dat)[1L], ...) {
  all_cols <- colnames(dat)

  # Select_field only allow one value, not multi select
  fields <- list(
    column = select_field(cols, all_cols, multiple = TRUE, type = "name")
  )

  if (length(cols) == 0) {
    expr <- quote(identity())
  } else {
    expr <- quote(
      dplyr::select(.(column))
    )
  }

  new_block(
    fields = fields,
    expr = expr,
    ...,
    class = c("select_block", "transform_block")
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
  invisible(x)
}

#' @param session Shiny session
#' @rdname new_block
#' @export
update_fields.filter_block <- function(x, data, session, ...) {
  col_field <- x[["column"]]
  col_choices <- colnames(data)

  if (!identical(col_choices, attr(col_field, "choices"))) {

    if (!col_field %in% col_choices) {
      attr(x[["column"]], "choices") <- col_choices
      value(x[["column"]]) <- col_choices[1L]
      value(x[["value"]]) <- NA_character_
      ui_update(x[["value"]], session, "value", "value")
    } else {
      meta(x[["column"]], "choices") <- col_choices
    }

    ui_update(x[["column"]], session, "column", "column")
  }

  x
}

update_fields.select_block <- function(x, data, session, ...) {
  #browser()
}
