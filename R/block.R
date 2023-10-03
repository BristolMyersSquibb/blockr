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

#' @param data Result from previous block
#' @rdname new_block
#' @export
evalute_block.plot_block <- function(x, data, ...) {
  stopifnot(...length() == 0L)
  tmp_expr <- strsplit(deparse1(generate_code(x)), "\\+")[[1]]
  gg_init <- str2lang(tmp_expr[[1]])
  gg_geom <- str2lang(tmp_expr[[2]])

  eval(
    substitute(data %>% expr + expr2, list(expr = gg_init, expr2 = gg_geom)),
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
#' @param columns Definition of the equality filter.
#' @param values Definition of the equality filter.
#' @rdname new_block
#' @export
new_filter_block <- function(data, columns = colnames(data)[1L],
                             values = character(), ...) {

  sub_fields <- function(data, columns) {

    determine_field <- function(x) {
      switch(
        class(x),
        factor = select_field,
        numeric = range_field,
        string_field
      )
    }

    field_args <- function(x) {

      switch(
        class(x),
        factor = list(levels(x)[1L], choices = levels(x)),
        numeric = list(range(x), min = min(x), max = max(x)),
        list()
      )
    }

    cols <- data[, columns, drop = FALSE]

    ctor <- lapply(cols, determine_field)
    args <- lapply(cols, field_args)

    Map(do.call, ctor, args)
  }


  filter_exps <- function(data, values) {

    filter_exp <- function(cls, col, val) {

      if (is.null(val)) {
        return(quote(TRUE))
      }

      switch(
        cls,
        numeric = bquote(
          dplyr::between(.(column), ..(values)),
          list(column = as.name(col), values = val),
          splice = TRUE
        ),
        bquote(.(column) == .(value), list(column = as.name(col), value = val))
      )
    }

    cols <- names(values)

    Reduce(
      function(x, y) bquote(.(lhs) | .(rhs), list(lhs = x, rhs = y)),
      Map(filter_exp, chr_ply(data[, cols, drop = FALSE], class), cols, values)
    )
  }

  col_choices <- function(data) colnames(data)

  fields <- list(
    columns = new_select_field(columns, col_choices, multiple = TRUE),
    values = new_list_field(values, sub_fields),
    expression = new_hidden_field(filter_exps)
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

#' @param data Tabular data in which to select some columns.
#' @param columns Column(s) to select.
#' @rdname new_block
#' @export
new_select_block <- function(data, columns = colnames(data)[1], ...) {
  all_cols <- function(data) colnames(data)

  # Select_field only allow one value, not multi select
  fields <- list(
    column = new_select_field(columns, all_cols, multiple = TRUE)
  )

  new_block(
    fields = fields,
    expr = quote(
      dplyr::select(.(column))
    ),
    ...,
    class = c("select_block", "transform_block")
  )
}

#' @rdname new_block
#' @export
select_block <- function(data, ...) {
  initialize_block(new_select_block(data, ...), data)
}

#' @param data Tabular data in which to select some columns.
#' @param plot_opts List containing options for ggplot (color, ...).
#' @param ... Any other params. TO DO
#' @rdname new_block
#' @import ggplot2
#' @export
new_plot_block <- function(
  data,
  plot_opts = list(colors = c("blue", "red")),
  ...
) {
  # For plot blocks, fields will create input to style the plot ...
  all_cols <- function(data) colnames(data)
  fields <- list(
    x_var = new_select_field(all_cols(data)[[1]], all_cols),
    y_var = new_select_field(all_cols(data)[[2]], all_cols),
    color = new_select_field(plot_opts$colors[[1]], plot_opts$colors)
  )

  new_block(
    fields = fields,
    expr = quote(
      ggplot() +
        geom_point(
          # We have to use aes_string over aes
          mapping = aes_string(
            x = .(x_var),
            y = .(y_var)
          ),
          color = .(color)
        )
    ),
    ...,
    class = c("plot_block")
  )
}

#' @rdname new_block
#' @export
plot_block <- function(data, ...) {
  initialize_block(new_plot_block(data, ...), data)
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

#' @param data Block input data
#' @rdname new_block
#' @export
update_fields.plot_block <- update_fields.transform_block
