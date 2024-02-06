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
    is.list(fields), length(fields) >= 1L, all(lgl_ply(fields, is_field)),
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
evaluate_block.plot_block <- evaluate_block.transform_block

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

#' @param data Result from previous block
#' @rdname new_block
#' @export
evaluate_block.html_block <- evaluate_block.plot_block

#' @rdname new_block
#' @param dat Multiple datasets.
#' @param selected Selected dataset.
#' @export
new_data_block <- function(
    ...,
    dat = as.environment("package:datasets"),
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
    dataset = new_select_field(selected, datasets)
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

#' @rdname new_block
#' @export
data_block <- function(...) {
  initialize_block(new_data_block(...))
}

#' @rdname new_block
#' @export
new_upload_block <- function(...) {

  read_data <- function(dat) {
    if (length(dat) == 0) {
      return(data.frame())
    }

    data_func <- utils::read.csv # TO DO switch
    bquote(
      .(read_func)(.(path)),
      list(read_func = data_func, path = dat$datapath)
    )
  }

  new_block(
    fields = list(
      dat = new_upload_field(),
      expression = new_hidden_field(read_data)
    ),
    expr = quote(.(expression)),
    ...,
    class = c("upload_block", "data_block")
  )
}

#' @rdname new_block
#' @export
upload_block <- function(...) {
  initialize_block(new_upload_block(...))
}

#' @rdname new_block
#' @param volumes Paths accessible by the shinyFiles browser.
#' @export
new_filesbrowser_block <- function(volumes = c(home = path.expand("~")), ...) {
  read_data <- function(dat) {
    if (length(dat) == 0 || is.integer(dat) || length(dat$files) == 0) {
      cat("No files have been selected yet.")
      return(data.frame())
    }

    files <- shinyFiles::parseFilePaths(volumes, dat)
    data_func <- utils::read.csv # TO DO switch

    bquote(
      .(read_func)(.(path)),
      list(read_func = data_func, path = files$datapath)
    )
  }

  new_block(
    fields = list(
      dat = new_filesbrowser_field(volumes = volumes),
      expression = new_hidden_field(read_data)
    ),
    expr = quote(.(expression)),
    ...,
    class = c("filesbrowser_block", "data_block")
  )
}

#' @rdname new_block
#' @export
filesbrowser_block <- function(...) {
  initialize_block(new_filesbrowser_block(...))
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
#' @param filter_fun Default filter fun for the expression.
#' @rdname new_block
#' @export
new_filter_block <- function(
    data,
    columns = colnames(data)[1L],
    values = character(),
    filter_fun = "==",
    ...) {
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
    columns = new_select_field(columns, col_choices, multiple = TRUE),
    values = new_list_field(values, sub_fields),
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
      )
    ),
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
    columns = new_select_field(columns, all_cols, multiple = TRUE)
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

#' @param data Tabular data in which to perform summarise.
#' @param func Summarize function to apply.
#' @param default_columns If you know in advance each function to apply,
#' you can also pass predefined selected column for each summary.
#' Therefore when not of length 0, columns should have the same length
#' as func.
#' @rdname new_block
#' @export
new_summarize_block <- function(
    data,
    func = c("mean", "se"),
    default_columns = character(),
    ...) {
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
    funcs = new_select_field(func, func_choices, multiple = TRUE),
    columns = new_list_field(sub_fields = sub_fields),
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

#' @rdname new_block
#' @export
summarize_block <- function(data, ...) {
  initialize_block(new_summarize_block(data, ...), data)
}

#' @rdname new_block
#' @export
select_block <- function(data, ...) {
  initialize_block(new_select_block(data, ...), data)
}

#' @rdname new_block
#' @export
new_arrange_block <- function(data, columns = colnames(data)[1], ...) {
  all_cols <- function(data) colnames(data)

  # Type as name for arrange and group_by
  fields <- list(
    columns = new_select_field(columns, all_cols, multiple = TRUE, type = "name")
  )

  new_block(
    fields = fields,
    expr = quote(dplyr::arrange(..(columns))),
    ...,
    class = c("arrange_block", "transform_block")
  )
}

#' @rdname new_block
#' @export
arrange_block <- function(data, ...) {
  initialize_block(new_arrange_block(data, ...), data)
}

#' @rdname new_block
#' @export
new_group_by_block <- function(data, columns = colnames(data)[1], ...) {
  all_cols <- function(data) colnames(data)

  # Select_field only allow one value, not multi select
  fields <- list(
    columns = new_select_field(columns, all_cols, multiple = TRUE, type = "name")
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

#' @rdname new_block
#' @export
group_by_block <- function(data, ...) {
  initialize_block(new_group_by_block(data, ...), data)
}

#' @rdname new_block
#' @param data Input data coming from previous block.
#' @param y Second data block.
#' @param type Join type.
#' @param by_col If you know in advance which column you want
#' to join
#' @export
new_join_block <- function(
    data,
    y = data(package = "blockr.data")$result[, "Item"],
    type = character(),
    by_col = character(),
    ...) {
  # by depends on selected dataset and the input data.
  choices <- intersect(
    colnames(data),
    colnames(eval(as.name(y)))
  )

  default <- if (length(choices) == 0) {
    character()
  } else {
    if (length(by_col) > 0) {
      by_col
    } else {
      choices[[1]]
    }
  }

  join_expr <- function(data, join_func, y, by) {
    if (length(by) == 0) stop("Nothing to merge, restoring defaults.")
    bquote(
      .(join_func)(y = .(y), by = .(by)),
      list(join_func = as.name(join_func), y = as.name(y), by = by)
    )
  }

  join_types <- c(
    "left",
    "inner",
    "right",
    "full",
    "semi",
    "anti"
  )

  if (length(type) == 0) type <- join_types[1]

  fields <- list(
    join_func = new_select_field(
      paste(type, "join", sep = "_"),
      paste(join_types, "join", sep = "_")
    ),
    y = new_select_field(y[[1]], y),
    by = new_select_field(default, choices, multiple = TRUE),
    expression = new_hidden_field(join_expr)
  )

  attr(fields$y, "type") <- "name"
  # TO DO: expression is ugly: try to get rid of get and
  # unlist.
  expr <- quote(.(expression))

  new_block(
    fields = fields,
    expr = expr,
    ...,
    class = c("join_block", "transform_block", "submit_block")
  )
}

#' @rdname new_block
#' @export
join_block <- function(data, ...) {
  initialize_block(new_join_block(data, ...), data)
}

#' @rdname new_block
#' @param n_rows Number of rows to return.
#' @param n_rows_min Minimum number of rows.
#' @export
new_head_block <- function(
    data,
    n_rows = numeric(),
    n_rows_min = 1L,
    ...) {
  tmp_expr <- function(n_rows) {
    bquote(
      head(n = .(n_rows)),
      list(n_rows = n_rows)
    )
  }

  fields <- list(
    n_rows = new_numeric_field(n_rows, n_rows_min, nrow(data)),
    expression = new_hidden_field(tmp_expr)
  )

  new_block(
    fields = fields,
    expr = quote(.(expression)),
    ...,
    class = c("head_block", "transform_block")
  )
}

#' @rdname new_block
#' @export
head_block <- function(data, ...) {
  initialize_block(new_head_block(data, ...), data)
}

#' @rdname new_block
#' @export
html_block <- function(data, ...) {
  initialize_block(new_html_block(data, ...), data)
}

#' @param data Tabular data in which to select some columns.
#' @param ... Any other params. TO DO
#' @rdname new_block
#' @export
new_html_block <- function(
  data,
  ...
) {
  # For plot blocks, fields will create input to style the plot ...
  fields <- list(
    prefix = new_string_field(""),
    suffix = new_string_field(""),
    main_tag = new_string_field("h1"),
    prefix_tag = new_string_field("span"),
    suffix_tag = new_string_field("span"),
    icon = new_string_field("info"),
    text_colour = new_string_field("white"),
    colour = new_select_field(
      "info",
      c(
        "white",
        "primary",
        "secondary",
        "info",
        "success",
        "danger",
        "warning",
        "dark",
        "light"
      )
    )
  )

  new_block(
    fields = fields,
    expr = quote({
      prefix_tag <- do.call(.(prefix_tag), list(.(prefix), .noWS = "after"))
      suffix_tag <- do.call(.(suffix_tag), list(.(suffix), .noWS = "before"))
      main_tag <- do.call(.(main_tag), list(data[1], .noWS = "after"))

      cl <- sprintf("w-100 p-2 rounded bg-%s", .(colour))

      icon <- ""
      if (.(icon) != "")
        icon <- icon(.(icon), class = "float-right")

      div(
        class = cl,
        style = sprintf("color:%s;", .(text_colour)),
        div(
          class = "row",
          div(
            class = "col-md-10",
            prefix_tag,
            main_tag,
            suffix_tag
          ),
          div(
            class = "col-md-2 fs-1",
            icon
          )
        )
      )
    }),
    ...,
    lass = c("html_block")
  )
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

#' @param data Block input data
#' @rdname new_block
#' @export
update_fields.html_block <- update_fields.transform_block
