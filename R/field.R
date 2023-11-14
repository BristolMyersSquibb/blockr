#' Fields
#'
#' Each block consists of a set of fields, which define the type of value
#' the field holds and can be used to customize how the UI is generated.
#'
#' @param value Field value
#' @param ... Further field components
#' @param type Field type (allowed values are `"literal"` and `"name"`)
#' @param class Field subclass
#' @param exclude Experimental: Exclude field from being captured in the update_fields
#' feature. Default to FALSE. Not yet used.
#'
#' @export
new_field <- function(value, ..., type = c("literal", "name"),
                      class = character(), exclude = FALSE) {
  x <- list(value = value, ...)

  stopifnot(is.list(x), length(unique(names(x))) == length(x))

  structure(
    x,
    type = match.arg(type),
    class = c(class, "field"),
    exclude = exclude
  )
}

#' @rdname new_block
#' @export
is_initialized.field <- function(x) {
  all(lengths(values(x)) > 0)
}

#' @param x An object inheriting form `"field"`
#' @rdname new_field
#' @export
validate_field <- function(x) {
  UseMethod("validate_field", x)
}

#' @param new Value to set
#' @param env Environment with data and other field values
#'
#' @rdname new_field
#' @export
update_field <- function(x, new, env = list()) {
  UseMethod("update_field", x)
}

#' @rdname new_field
#' @export
update_field.field <- function(x, new, env = list()) {
  x <- eval_set_field_value(x, env)

  # Boolean need a special care because
  # when new is FALSE, then is_truthy()
  # will always be FALSE and the value
  # never updated ...
  if (inherits(x, "switch_field")) {
    value(x) <- new
  } else {
    if (is_truthy(new)) {
      value(x) <- new
    }
  }

  validate_field(x)
}

#' @rdname new_field
#' @export
initialize_field <- function(x, env = list()) {
  UseMethod("initialize_field", x)
}

#' @rdname new_field
#' @export
initialize_field.field <- function(x, env = list()) {
  validate_field(
    eval_set_field_value(x, env)
  )
}

eval_set_field_value <- function(x, env) {
  for (cmp in names(x)[lgl_ply(x, is.function)]) {
    fun <- x[[cmp]]
    tmp <- do.call(fun, env[methods::formalArgs(fun)])
    if (length(tmp) > 0) {
      value(x, cmp) <- tmp
    }
  }

  x
}

#' @rdname new_field
#' @export
is_field <- function(x) inherits(x, "field")

#' @rdname new_field
#' @export
validate_field.string_field <- function(x) {
  val <- value(x)

  if (!is.character(val) || length(val) != 1L) {
    value(x) <- ""
  }

  x
}

#' @rdname new_field
#' @export
new_string_field <- function(value = character(), ...) {
  new_field(value, ..., class = "string_field")
}

#' @rdname new_field
#' @export
string_field <- function(...) validate_field(new_string_field(...))

#' @rdname new_field
#' @export
validate_field.select_field <- function(x) {
  val <- value(x)
  opt <- value(x, "choices")

  if (isTRUE(value(x, "multiple"))) {
    len_ok <- length(val) > 0L
  } else {
    len_ok <- length(val) == 1L
  }

  if (!is.character(val) || !len_ok || !all(val %in% opt)) {
    value(x) <- opt[1L]
  }

  x
}

#' @param choices Set of permissible values
#' @param multiple Allow multiple selections
#' @rdname new_field
#' @export
new_select_field <- function(value = character(), choices = character(),
                             multiple = FALSE, ...) {
  new_field(value,
    choices = choices, multiple = multiple, ...,
    class = "select_field"
  )
}

#' @rdname new_field
#' @export
select_field <- function(...) validate_field(new_select_field(...))

#' @rdname new_field
#' @export
new_switch_field <- function(value = FALSE, ...) {
  new_field(value, ..., class = "switch_field")
}

#' @rdname new_field
#' @export
switch_field <- function(...) validate_field(new_switch_field(...))

#' @rdname new_field
#' @export
validate_field.switch_field <- function(x) {
  val <- value(x)

  if (length(val) == 0) {
    value(x) <- FALSE
  }
  x
}

#' @rdname new_field
#' @export
new_numeric_field <- function(
    value = numeric(),
    min = numeric(),
    max = numeric(),
    ...) {
  new_field(value, min = min, max = max, ..., class = "numeric_field")
}

#' @rdname new_field
#' @export
numeric_field <- function(...) {
  validate_field(new_numeric_field(...))
}

#' @rdname new_field
#' @export
validate_field.numeric_field <- function(x) {
  val <- value(x)

  if (!is.numeric(val) || length(val) == 0) {
    value(x) <- value(x, "min")
  } else if (val < value(x, "min")) {
    value(x) <- value(x, "min")
  } else if (val > value(x, "max")) {
    value(x) <- value(x, "max")
  }

  x
}

#' @rdname new_field
#' @export
new_submit_field <- function(...) {
  # action buttons always start from 0
  new_field(value = 0, ..., class = "submit_field")
}

#' @rdname new_field
#' @export
submit_field <- function(...) {
  validate_field(new_submit_field(...))
}

#' @rdname new_field
#' @export
validate_field.submit_field <- function(x) {
  x
}

#' @param name Field component name
#' @rdname new_field
#' @export
value <- function(x, name = "value") {
  stopifnot(is_field(x))

  res <- x[[name]]

  if (is.function(res)) {
    return(attr(res, "result"))
  }

  res
}

#' @rdname new_field
#' @export
values <- function(x, name = names(x)) {
  set_names(lapply(name, function(n) value(x, n)), name)
}

#' @param value Field value
#' @rdname new_field
#' @export
`value<-` <- function(x, name = "value", value) {
  if (is.null(x)) {
    return(NULL)
  }

  stopifnot(is_field(x))

  if (is.function(x[[name]])) {
    attr(x[[name]], "result") <- value
  } else {
    x[[name]] <- value
  }

  x
}

#' @param field Field type
#' @param components Variable list of field components
#' @rdname new_field
#' @export
new_variable_field <- function(value = character(), field = character(),
                               components = list(), ...) {
  new_field(value,
    field = field, components = components, ...,
    class = "variable_field"
  )
}

#' @rdname new_field
#' @export
variable_field <- function(...) validate_field(new_variable_field(...))

#' @rdname new_field
#' @export
validate_field.variable_field <- function(x) {
  val <- value(x, "field")
  opt <- c(
    "string_field",
    "select_field",
    "range_field",
    "numeric_field"
  )

  stopifnot(is.character(val), length(val) <= 1L)

  if (!length(val) || !val %in% opt) {
    value(x, "field") <- "string_field"
  }

  value(x, "components") <- c(
    validate_field(materialize_variable_field(x))
  )

  value(x) <- value(x, "components")[["value"]]

  x
}

materialize_variable_field <- function(x) {
  cmp <- value(x, "components")
  val <- value(x)

  if (is_truthy(val)) {
    cmp[["value"]] <- val
  }

  do.call(value(x, "field"), cmp)
}

#' @param min,max Slider boundaries (inclusive)
#' @rdname new_field
#' @export
new_range_field <- function(value = numeric(), min = numeric(),
                            max = numeric(), ...) {
  new_field(value, min = min, max = max, ..., class = "range_field")
}

#' @rdname new_field
#' @export
range_field <- function(...) validate_field(new_range_field(...))

#' @rdname new_field
#' @export
validate_field.range_field <- function(x) {
  val <- value(x)

  if (!is.numeric(val) || length(val) < 2L) {
    value(x) <- c(value(x, "min"), value(x, "max"))
  } else if (val[1L] < value(x, "min")) {
    value(x) <- c(value(x, "min"), val[2L])
  } else if (val[2L] > value(x, "max")) {
    value(x) <- c(val[1L], value(x, "max"))
  }

  x
}

#' @rdname new_field
#' @export
new_hidden_field <- function(value = expression(), ...) {
  new_field(value, ..., class = "hidden_field")
}

#' @rdname new_field
#' @export
hidden_field <- function(...) validate_field(new_hidden_field(...))

#' @rdname new_field
#' @export
validate_field.hidden_field <- function(x) {
  x
}

#' @param sub_fields Fields contained in `list_field`
#' @rdname new_field
#' @export
new_list_field <- function(value = list(), sub_fields = list(), ...) {
  new_field(value, sub_fields = sub_fields, ..., class = "list_field")
}

#' @rdname new_field
#' @export
list_field <- function(...) validate_field(new_list_field(...))

#' @rdname new_field
#' @export
validate_field.list_field <- function(x) {
  val <- value(x)
  sub <- value(x, "sub_fields")

  if (!is.list(val) || length(val) != length(sub) ||
    !setequal(names(val), names(sub))) {
    value(x) <- lst_xtr(sub, "value")
  }

  value(x, "sub_fields") <- lapply(
    update_sub_fields(sub, val),
    validate_field
  )

  x
}

update_sub_fields <- function(sub, val) {
  # Added this because of the join_block
  if (is.null(names(val))) {
    value(sub[[1]]) <- unlist(val)
  } else {
    for (fld in names(val)[lgl_ply(val, is_truthy)]) {
      value(sub[[fld]]) <- unlist(val[[fld]])
    }
  }

  sub
}
