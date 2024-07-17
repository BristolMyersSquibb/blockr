#' Data block constructor
#'
#' This block allows to selected data from a package,
#' the default being datasets.
#'
#' @inheritParams new_block
#' @param selected Selected dataset
#' @param package Name of an R package containing datasets
#' @export
new_dataset_block <- function(selected = character(), package = "datasets",
                              ...) {

  is_dataset_eligible <- function(x, pkg) {
    inherits(do.call("::", list(pkg = pkg, name = x)), "data.frame")
  }

  list_datasets <- function(package) {
    datasets <- utils::data(package = package)
    datasets <- datasets$results[, "Item"]

    options <- gsub("\\s+\\(.+\\)$", "", datasets)

    options[lgl_ply(options, is_dataset_eligible, package)]
  }

  new_block(
    fields = list(
      package = new_hidden_field(package, type = "name"),
      dataset = new_select_field(selected, list_datasets,
        type = "name",
        title = "Dataset"
      )
    ),
    expr = as.call(c(as.symbol("::"), quote(.(package)), quote(.(dataset)))),
    ...,
    class = c("dataset_block", "data_block")
  )
}

#' Upload block constructor
#'
#' This block allows to upload data from the user files system.
#' This block outputs a string containing the file path.
#'
#' @inheritParams new_block
#' @param file_path File path
#' @export
new_upload_block <- function(file_path = character(), ...) {
  new_block(
    fields = list(
      file = new_upload_field(file_path, title = "File")
    ),
    expr = quote(.(file)),
    ...,
    class = c("upload_block", "data_block")
  )
}

#' Files browser block constructor
#'
#' This block allows browse files on the server where the app is running.
#' It falls back to the user file system when running locally.
#' This block outputs a string containing the file path.
#'
#' @inheritParams new_upload_block
#' @param volumes Paths accessible by the shinyFiles browser
#' @export
new_filesbrowser_block <- function(file_path = character(),
                                   volumes = c(home = path.expand("~")), ...) {
  new_block(
    fields = list(
      file = new_filesbrowser_field(file_path,
        volumes = volumes,
        title = "File"
      )
    ),
    expr = quote(.(file)),
    ...,
    class = c("filesbrowser_block", "data_block")
  )
}

#' Data parser block constructor
#'
#' \code{new_parser_block}: this block allows to create any data parsing block.
#' Unless you need a new data parser, there is no need to use this directly.
#'
#' @inheritParams new_block
#' @export
new_parser_block <- function(expr, fields = list(), ..., class = character()) {
  safe_expr <- function(data) {
    if (length(data)) {
      expr
    } else {
      quote(identity())
    }
  }

  new_block(
    fields = c(
      fields,
      list(expression = new_hidden_field(safe_expr))
    ),
    expr = quote(.(expression)),
    ...,
    class = c(class, "parser_block", "transform_block")
  )
}

#' CSV data parser block
#'
#' \code{csv_block}: From a string given by \link{new_filesbrowser_block} and
#' \link{new_upload_block}, reads the related CSV file and returns
#' a dataframe.
#'
#' @rdname new_parser_block
#' @export
new_csv_block <- function(...) {
  new_parser_block(quote(utils::read.csv()), ..., class = "csv_block")
}

#' RDS data parser block
#'
#' \code{rds_block}: From a string given by \link{new_filesbrowser_block} and
#' \link{new_upload_block}, reads the related rds file and returns
#' a dataframe.
#'
#' @rdname new_parser_block
#' @export
new_rds_block <- function(...) {
  new_parser_block(quote(readRDS()), ..., class = "rds_block")
}

#' JSON data parser block
#'
#' \code{json_block}: From a string given by \link{new_filesbrowser_block} and
#' \link{new_upload_block}, reads the related json file and returns
#' a dataframe.
#'
#' @rdname new_parser_block
#' @export
new_json_block <- function(...) {
  new_parser_block(
    quote(jsonlite::fromJSON()),
    ...,
    class = "json_block"
  )
}

#' XPT data parser block
#'
#' \code{csv_block}: From a string given by \link{new_filesbrowser_block} and
#' \link{new_upload_block}, reads the related XPT file and returns
#' a dataframe.
#'
#' @rdname new_parser_block
#' @export
new_xpt_block <- function(...) {
  new_parser_block(quote(haven::read_xpt()), ..., class = "xpt_block")
}

#' Result block
#'
#' A result blocks allows one to reuse the data from one \link{stack} into
#' another one. This isn't relevant for single stack apps.
#'
#' @inheritParams new_block
#' @export
new_result_block <- function(...) {
  fields <- list(
    stack = new_result_field(title = "Stack")
  )

  new_block(
    fields = fields,
    expr = quote(.(stack)),
    ...,
    class = c("result_block", "data_block")
  )
}

#' Filter block
#'
#' This block provides access to \link[dplyr]{filter} verb and
#' returns the filtered data.
#'
#' @inheritParams new_block
#' @param columns Columns used for filtering
#' @param values Values used for filtering
#' @param filter_fun Filter function for the expression
#' @export
new_filter_block <- function(columns = character(), values = character(),
                             filter_fun = "==", ...) {

  sub_fields <- function(data, columns) {

    determine_field <- function(x) {
      switch(
        class(x),
        factor = "select_field",
        numeric = "numeric_field",
        "string_field"
      )
    }

    chr_ply(data[, columns, drop = FALSE], determine_field)
  }

  sub_args <- function(data, columns) {

    determine_args <- function(x) {
      switch(
        class(x),
        factor = list(choices = levels(x)),
        numeric = list(min = min(x), max = max(x)),
        list()
      )
    }

    lapply(data[, columns, drop = FALSE], determine_args)
  }

  sub_names <- function(columns) columns

  filter_exps <- function(data, columns, values, filter_func) {

    filter_exp <- function(fun, col, val) {
      bquote(
        eval(call(.(filter_func), .(column), .(value))),
        list(column = as.name(col), value = val, filter_func = fun)
      )
    }

    Reduce(
      function(x, y) bquote(.(lhs) | .(rhs), list(lhs = x, rhs = y)),
      Map(filter_exp, filter_func, columns, values)
    )
  }

  col_choices <- function(data) colnames(data)

  fun_opts <- function(data, columns) {

    determine_opts <- function(x) {

      default <- c("==", "!=")

      res <- switch(
        class(x),
        numeric = c(default, ">", "<", ">=", "<="),
        character = c(default, "startsWith", "endsWith", "grepl"),
        default
      )

      list(choices = res)
    }

    lapply(data[, columns, drop = FALSE], determine_opts)
  }

  fields <- list(
    columns = new_select_field(columns, col_choices, multiple = TRUE,
                               title = "Columns"),
    filter_func = new_list_field("select_field", fun_opts, sub_names,
                                 title = "Comparison"),
    values = new_list_field(sub_fields, sub_args, sub_names, title = "Value"),
    expression = new_hidden_field(filter_exps)
  )

  expr <- quote(
    dplyr::filter(.(expression))
  )

  new_block(
    fields = fields,
    expr = expr,
    ...,
    class = c("filter_block", "transform_block", "submit_block")
  )
}

#' Select block
#'
#' This block provides access to \link[dplyr]{select} verb and
#' returns a dataframe with the selected columns.
#'
#' @inheritParams new_block
#' @param columns Column(s) to select.
#' @export
new_select_block <- function(columns = character(), ...) {
  all_cols <- function(data) colnames(data)

  # Select_field only allow one value, not multi select
  fields <- list(
    columns = new_select_field(columns, all_cols,
      multiple = TRUE,
      title = "Columns"
    )
  )

  new_block(
    fields = fields,
    expr = quote(
      dplyr::select(.(columns))
    ),
    ...,
    class = c("select_block", "transform_block")
  )
}

#' Summarize block
#'
#' This block provides access to \link[dplyr]{summarize} verb and
#' returns a dataframe with the transformed columns.
#'
#' @inheritParams new_block
#' @inheritParams new_select_block
#' @param func Summarize function to apply.
#' @param default_columns If you know in advance each function to apply,
#' you can also pass predefined selected column for each summary.
#' Therefore when not of length 0, columns should have the same length
#' as func.
#' @export
new_summarize_block <- function(func = character(),
                                default_columns = character(), ...) {

  select_names <- function(funcs) funcs

  select_choices <- function(funcs) {
    replicate(
      length(funcs),
      set_fun_env(function(data) list(choices = colnames(data)))
    )
  }

  summarize_expr <- function(data, funcs, columns) {

    do_one <- function(fun) {

      col <- as.name(columns[[fun]])

      if (identical(fun, "se")) {
        bquote(
          sd(.(column), na.rm = TRUE) / sqrt(n()),
          list(column = col)
        )
      } else {
        bquote(
          .(fun)(.(column), na.rm = TRUE),
          list(fun = as.name(fun), column = col)
        )
      }
    }

    if (!length(columns) || any(!lengths(columns))) {
      return(quote(identity()))
    }

    bquote(
      dplyr::summarise(..(exprs), .groups = "drop"),
      list(exprs = lapply(set_names(funcs, toupper(names(columns))), do_one)),
      splice = TRUE
    )
  }

  if (length(default_columns) > 0) {

    stopifnot(length(func) == length(default_columns))

    select_choices <- set_functional_field_component_value(
      select_choices,
      Map(
        set_functional_field_component_value,
        select_choices(func),
        default_columns
      )
    )
  }

  func_choices <- c(
    "mean", "median", "sd", "se", "min", "max", "n", "n_distinct"
  )

  fields <- list(
    funcs = new_select_field(func, func_choices, multiple = TRUE,
                             title = "Functions"),
    columns = new_list_field("select_field", select_choices, select_names,
                             title = "Columns"),
    expression = new_hidden_field(summarize_expr)
  )

  # TO DO: find way to name the new
  # column instead of res ...

  new_block(
    fields = fields,
    expr = quote(.(expression)),
    ...,
    class = c("summarize_block", "transform_block", "submit_block")
  )
}

#' Arrange block
#'
#' This block provides access to \link[dplyr]{arrange} verb and
#' returns a dataframe.
#'
#' @inheritParams new_block
#' @inheritParams new_select_block
#' @export
new_arrange_block <- function(columns = character(), ...) {
  all_cols <- function(data) colnames(data)

  # Type as name for arrange and group_by
  fields <- list(
    columns = new_select_field(columns, all_cols,
      multiple = TRUE,
      type = "name", title = "Columns"
    )
  )

  new_block(
    fields = fields,
    expr = quote(dplyr::arrange(..(columns))),
    ...,
    class = c("arrange_block", "transform_block")
  )
}

#' Group by block
#'
#' This block provides access to \link[dplyr]{group_by} verb and
#' returns a dataframe.
#'
#' @inheritParams new_block
#' @inheritParams new_select_block
#' @export
new_group_by_block <- function(columns = character(), ...) {
  all_cols <- function(data) colnames(data)

  # Select_field only allow one value, not multi select
  fields <- list(
    columns = new_select_field(columns, all_cols,
      multiple = TRUE,
      type = "name", title = "Columns"
    )
  )

  new_block(
    fields = fields,
    expr = quote(dplyr::group_by(..(columns))),
    ...,
    class = c("group_by_block", "transform_block")
  )
}

#' Join block
#'
#' This block provides access to the dplyr join verbs and
#' returns a dataframe. This blocks is made to work with multiple
#' stack as the `y` parameter expects a dataframe from another stack.
#'
#' @inheritParams new_block
#' @inheritParams new_select_block
#' @param y Second dataset for join.
#' @param type Join type.
#' @param by Join columns.
#'
#' @export
new_join_block <- function(y = NULL, type = character(), by = character(),
                           ...) {
  by_choices <- function(data, y) {
    intersect(colnames(data), colnames(y))
  }

  join_types <- c("left", "inner", "right", "full", "semi", "anti")

  if (length(type)) {
    type <- match.arg(type, join_types)
  } else {
    type <- join_types[1L]
  }

  fields <- list(
    join_func = new_select_field(
      paste(type, "join", sep = "_"),
      paste(join_types, "join", sep = "_"),
      type = "name",
      title = "Type"
    ),
    y = new_result_field(y, title = "Stack"),
    by = new_select_field(by, by_choices, multiple = TRUE, title = "By")
  )

  new_block(
    fields = fields,
    expr = quote(.(join_func)(y = .(y), by = .(by))),
    ...,
    class = c("join_block", "transform_block", "submit_block")
  )
}

#' Head block
#'
#' This allows to select the first n rows of the input dataframe.
#'
#' @inheritParams new_block
#' @inheritParams new_select_block
#' @param n_rows Number of rows to return.
#' @param n_rows_min Minimum number of rows.
#' @export
new_head_block <- function(n_rows = numeric(), n_rows_min = 1L, ...) {
  n_rows_max <- function(data) nrow(data)

  fields <- list(
    n_rows = new_numeric_field(n_rows, n_rows_min, n_rows_max,
      title = "Number of rows"
    )
  )

  new_block(
    fields = fields,
    expr = quote(head(n = .(n_rows))),
    ...,
    class = c("head_block", "transform_block")
  )
}
