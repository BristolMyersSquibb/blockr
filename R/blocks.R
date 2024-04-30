#' Data block constructor
#'
#' This block allows to selected data from a package,
#' the default being datasets.
#'
#' @inheritParams new_block
#' @param dat Multiple datasets.
#' @param selected Selected dataset.
#' @export
#' @rdname data_block
new_dataset_block <- function(..., dat = as.environment("package:datasets"),
                              selected = character()) {

  is_dataset_eligible <- function(x) {
    inherits(
      get(x, envir = dat, inherits = FALSE),
      "data.frame"
    )
  }

  datasets <- ls(envir = dat)
  datasets <- datasets[lgl_ply(datasets, is_dataset_eligible)]

  if (length(selected) == 0) selected <- datasets[1]

  fields <- list(
    dataset = new_select_field(
      selected,
      datasets,
      title = "Dataset"
    )
  )

  expr <- substitute(
    get(.(dataset), envir = data),
    list(data = substitute(dat))
  )

  new_block(
    fields = fields,
    expr = expr,
    ...,
    class = c("dataset_block", "data_block")
  )
}

#' @rdname data_block
#' @export
data_block <- function(...) {
  initialize_block(new_dataset_block(...))
}

#' Upload block constructor
#'
#' This block allows to upload data from the user files system.
#' This block outputs a string containing the file path.
#'
#' @inheritParams new_block
#' @export
#' @rdname upload_block
new_upload_block <- function(...) {

  data_path <- function(file) {
    if (length(file)) file$datapath else character()
  }

  new_block(
    fields = list(
      file = new_upload_field(title = "File"),
      expression = new_hidden_field(data_path)
    ),
    expr = quote(c(.(expression))),
    ...,
    class = c("upload_block", "data_block")
  )
}

#' @rdname upload_block
#' @export
upload_block <- function(...) {
  initialize_block(new_upload_block(...))
}

#' Files browser block constructor
#'
#' This block allows browse files on the server where the app is running.
#' It falls back to the user file system when running locally.
#' This block outputs a string containing the file path.
#'
#' @inheritParams new_block
#' @param volumes Paths accessible by the shinyFiles browser.
#' @export
#' @rdname filesbrowser_block
new_filesbrowser_block <- function(volumes = c(home = path.expand("~")), ...) {

  data_path <- function(file) {
    if (length(file) == 0 || is.integer(file) || length(file$files) == 0) {
      return(character())
    }

    files <- shinyFiles::parseFilePaths(volumes, file)

    unname(files$datapath)
  }

  new_block(
    fields = list(
      file = new_filesbrowser_field(volumes = volumes, title = "File"),
      expression = new_hidden_field(data_path)
    ),
    expr = quote(c(.(expression))),
    ...,
    class = c("filesbrowser_block", "data_block")
  )
}

#' @export
#' @rdname filesbrowser_block
filesbrowser_block <- function(...) {
  initialize_block(new_filesbrowser_block(...))
}

#' Data parser block constructor
#'
#' \code{new_parser_block}: this block allows to create any data parsing block.
#' Unless you need a new data parser, there is no need to use this directly.
#'
#' @inheritParams new_block
#' @param data Data coming from any data reader block like \link{filesbrowser_block} and
#' \link{upload_block}.
#' @export
#' @rdname parser_block
new_parser_block <- function(data, expr, fields = list(), ...,
                             class = character()) {

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
#' \code{csv_block}: From a string given by \link{filesbrowser_block} and
#' \link{upload_block}, reads the related CSV file and returns
#' a dataframe.
#'
#' @rdname parser_block
#' @export
new_csv_block <- function(data, ...) {
  new_parser_block(data, expr = quote(utils::read.csv()), class = "csv_block")
}

#' @rdname parser_block
#' @export
csv_block <- function(data, ...) {
  initialize_block(new_csv_block(data, ...), data)
}

#' RDS data parser block
#'
#' \code{rds_block}: From a string given by \link{filesbrowser_block} and
#' \link{upload_block}, reads the related rds file and returns
#' a dataframe.
#'
#' @rdname parser_block
#' @export
new_rds_block <- function(data, ...) {
  new_parser_block(data, expr = quote(readRDS()), class = "rds_block")
}

#' @rdname parser_block
#' @export
rds_block <- function(data, ...) {
  initialize_block(new_rds_block(data, ...), data)
}

#' JSON data parser block
#'
#' \code{json_block}: From a string given by \link{filesbrowser_block} and
#' \link{upload_block}, reads the related json file and returns
#' a dataframe.
#'
#' @rdname parser_block
#' @export
new_json_block <- function(data, ...) {
  new_parser_block(data,
    expr = quote(jsonlite::fromJSON()),
    class = "json_block"
  )
}

#' @rdname parser_block
#' @export
json_block <- function(data, ...) {
  initialize_block(new_json_block(data, ...), data)
}

#' SAS data parser block
#'
#' \code{sas_block}: From a string given by \link{filesbrowser_block} and
#' \link{upload_block}, reads the related SAS file and returns
#' a dataframe.
#'
#' @rdname parser_block
#' @export
new_sas_block <- function(data, ...) {
  new_parser_block(data, expr = quote(haven::read_sas()), class = "sas_block")
}

#' @rdname parser_block
#' @export
sas_block <- function(data, ...) {
  initialize_block(new_sas_block(data, ...), data)
}

#' XPT data parser block
#'
#' \code{csv_block}: From a string given by \link{filesbrowser_block} and
#' \link{upload_block}, reads the related XPT file and returns
#' a dataframe.
#'
#' @rdname parser_block
#' @export
new_xpt_block <- function(data, ...) {
  new_parser_block(data, expr = quote(haven::read_xpt()), class = "xpt_block")
}

#' @rdname parser_block
#' @export
xpt_block <- function(data, ...) {
  initialize_block(new_xpt_block(data, ...), data)
}

#' Result block
#'
#' A result blocks allows one to reuse the data from one \link{stack} into
#' another one. This isn't relevant for single stack apps.
#'
#' @inheritParams new_block
#' @rdname result_block
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

#' @rdname result_block
#' @export
result_block <- function(...) {
  initialize_block(new_result_block(...))
}

#' Filter block
#'
#' This block provides access to \link[dplyr]{filter} verb and
#' returns the filtered data.
#'
#' @inheritParams new_block
#' @param data Tabular data to filter (rows).
#' @param columns Definition of the equality filter.
#' @param values Definition of the equality filter.
#' @param filter_fun Default filter fun for the expression.
#' @rdname filter_block
#' @export
new_filter_block <- function(data, columns = character(), values = character(),
                             filter_fun = "==", ...) {

  sub_fields <- function(data, columns) {
    determine_field <- function(x) {
      switch(class(x),
        factor = select_field,
        numeric = range_field,
        string_field
      )
    }

    field_args <- function(x) {
      switch(class(x),
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


  filter_exps <- function(data, values, filter_func) {
    filter_exp <- function(cls, col, val) {
      if (is.null(val)) {
        return(quote(TRUE))
      }

      switch(cls,
        numeric = bquote(
          dplyr::between(.(column), ..(values)),
          list(column = as.name(col), values = val),
          splice = TRUE
        ),
        bquote(
          eval(call(.(filter_func), .(column), .(value))),
          list(column = as.name(col), value = val, filter_func = filter_func)
        )
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
    columns = new_select_field(columns, col_choices, multiple = TRUE, title = "Columns"),
    filter_func = new_select_field(
      filter_fun,
      choices = c(
        "==",
        "!=",
        "!startsWith",
        "startsWith",
        "grepl",
        ">",
        "<",
        ">=",
        "<="
      ),
      title = "Comparison"
    ),
    values = new_list_field(values, sub_fields, title = "Value"),
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

#' @rdname filter_block
#' @export
filter_block <- function(data, ...) {
  initialize_block(new_filter_block(data, ...), data)
}

#' Select block
#'
#' This block provides access to \link[dplyr]{select} verb and
#' returns a dataframe with the selected columns.
#'
#' @inheritParams new_block
#' @param data Tabular data in which to select some columns.
#' @param columns Column(s) to select.
#' @rdname select_block
#' @export
new_select_block <- function(data, columns = character(), ...) {

  all_cols <- function(data) colnames(data)

  # Select_field only allow one value, not multi select
  fields <- list(
    columns = new_select_field(columns, all_cols, multiple = TRUE,
                               title = "Columns")
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

#' @rdname select_block
#' @export
select_block <- function(data, ...) {
  initialize_block(new_select_block(data, ...), data)
}

#' Summarize block
#'
#' This block provides access to \link[dplyr]{summarize} verb and
#' returns a dataframe with the transformed columns.
#'
#' @inheritParams new_block
#' @inheritParams select_block
#' @param func Summarize function to apply.
#' @param default_columns If you know in advance each function to apply,
#' you can also pass predefined selected column for each summary.
#' Therefore when not of length 0, columns should have the same length
#' as func.
#' @rdname summarize_block
#' @export
new_summarize_block <- function(data, func = c("mean", "se"),
                                default_columns = character(), ...) {

  if (length(default_columns) > 0) {
    stopifnot(length(func) == length(default_columns))
  }

  # Columns are only a select input
  sub_fields <- function(data, funcs) {
    all_cols <- colnames(data)
    tmp_selects <- lapply(
      seq_along(funcs),
      function(i) {
        default <- if (length(default_columns) > 0) {
          default_columns[[i]]
        } else {
          all_cols[[1]]
        }

        new_select_field(value = default, choices = all_cols)
      }
    )
    names(tmp_selects) <- funcs
    tmp_selects
  }

  summarize_expr <- function(data, funcs, columns) {
    # Build expressions that will go inside the summarize
    if (length(funcs) == 0) {
      return(quote(TRUE))
    }
    if (length(columns) == 0) {
      return(quote(TRUE))
    }

    tmp_exprs <- lapply(funcs, function(fun) {
      col <- columns[[fun]]

      if (is.null(col)) {
        return(quote(TRUE))
      }
      if (!any(col %in% colnames(data))) {
        return(quote(TRUE))
      }
      col <- as.name(col)

      expr <- if (fun == "se") {
        bquote(
          sd(.(column), na.rm = TRUE) / sqrt(n()),
          list(column = col)
        )
      } else {
        bquote(
          .(fun)(.(column), na.rm = TRUE),
          list(
            fun = as.name(fun),
            column = col
          )
        )
      }

      bquote(
        .(expr),
        list(
          expr = expr,
          column = col
        )
      )
    })

    names(tmp_exprs) <- toupper(names(columns))

    bquote(
      dplyr::summarise(..(exprs), .groups = "drop"),
      list(exprs = tmp_exprs),
      splice = TRUE
    )
  }

  func_choices <- c(
    "mean",
    "median",
    "sd",
    "se",
    "min",
    "max",
    "n",
    "n_distinct"
  )

  fields <- list(
    funcs = new_select_field(func, func_choices, multiple = TRUE, title = "Functions"),
    columns = new_list_field(sub_fields = sub_fields, title = "Columns"),
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

#' @rdname summarize_block
#' @export
summarize_block <- function(data, ...) {
  initialize_block(new_summarize_block(data, ...), data)
}

#' Arrange block
#'
#' This block provides access to \link[dplyr]{arrange} verb and
#' returns a dataframe.
#'
#' @inheritParams new_block
#' @inheritParams select_block
#' @rdname arrange_block
#' @export
new_arrange_block <- function(data, columns = character(), ...) {

  all_cols <- function(data) colnames(data)

  # Type as name for arrange and group_by
  fields <- list(
    columns = new_select_field(columns, all_cols, multiple = TRUE,
                               type = "name", title = "Columns")
  )

  new_block(
    fields = fields,
    expr = quote(dplyr::arrange(..(columns))),
    ...,
    class = c("arrange_block", "transform_block")
  )
}

#' @rdname arrange_block
#' @export
arrange_block <- function(data, ...) {
  initialize_block(new_arrange_block(data, ...), data)
}

#' Group by block
#'
#' This block provides access to \link[dplyr]{group_by} verb and
#' returns a dataframe.
#'
#' @inheritParams new_block
#' @inheritParams select_block
#' @rdname group_by_block
#' @export
new_group_by_block <- function(data, columns = character(), ...) {

  all_cols <- function(data) colnames(data)

  # Select_field only allow one value, not multi select
  fields <- list(
    columns = new_select_field(columns, all_cols, multiple = TRUE, type = "name", title = "Columns")
  )

  new_block(
    fields = fields,
    expr = quote(
      dplyr::group_by(..(columns))
    ),
    ...,
    class = c("group_by_block", "transform_block")
  )
}

#' @rdname group_by_block
#' @export
group_by_block <- function(data, ...) {
  initialize_block(new_group_by_block(data, ...), data)
}

#' Join block
#'
#' This block provides access to the dplyr join verbs and
#' returns a dataframe. This blocks is made to work with multiple
#' stack as the `y` parameter expects a dataframe from another stack.
#'
#' @inheritParams new_block
#' @inheritParams select_block
#' @param y Second dataset for join.
#' @param type Join type.
#' @param by Join columns.
#'
#' @rdname join_block
#' @export
new_join_block <- function(data, y = NULL, type = character(),
                           by = character(), ...) {

  by_choices <- function(data, y) {
    intersect(colnames(data), colnames(y))
  }

  if (!length(by) && not_null(y)) {
    by <- by_choices(data, y)[1L]
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

#' @rdname join_block
#' @export
join_block <- function(data, ...) {
  initialize_block(new_join_block(data, ...), data)
}

#' Head block
#'
#' This allows to select the first n rows of the input dataframe.
#'
#' @inheritParams new_block
#' @inheritParams select_block
#' @rdname head_block
#' @param n_rows Number of rows to return.
#' @param n_rows_min Minimum number of rows.
#' @export
new_head_block <- function(data, n_rows = numeric(), n_rows_min = 1L, ...) {

  tmp_expr <- function(n_rows) {
    bquote(
      head(n = .(n_rows)),
      list(n_rows = n_rows)
    )
  }

  n_rows_max <- function(data) nrow(data)

  fields <- list(
    n_rows = new_numeric_field(n_rows, n_rows_min, n_rows_max,
                               title = "Number of rows"),
    expression = new_hidden_field(tmp_expr)
  )

  new_block(
    fields = fields,
    expr = quote(.(expression)),
    ...,
    class = c("head_block", "transform_block")
  )
}

#' @rdname head_block
#' @export
head_block <- function(data, ...) {
  initialize_block(new_head_block(data, ...), data)
}
