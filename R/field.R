#' Fields
#'
#' Each block consists of a set of fields, which define the type of value
#' the field holds and can be used to customize how the UI is generated.
#'
#' @param value Field value
#' @param ... Further field components
#' @param type Field type (allowed values are `"literal"` and `"name"`)
#' @param class Field subclass
#'
#' @export
new_field <- function(value, ..., type = c("literal", "name"),
                      class = character()) {

  x <- list(value = value, ...)

  stopifnot(is.list(x), length(unique(names(x))) == length(x))

  structure(x, type = match.arg(type), class = c(class, "field"))
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

  if (is_initialized(x)) {
    UseMethod("validate_field", x)
  }

  x
}

#' @rdname new_field
#' @export
validate_field.field <- function(x) {
  stop("no base-class validator for fields available")
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
  value(x) <- new

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

  for (cmp in names(x)[lgl_ply(x, is.language)]) {
    expr <- do.call(bquote, list(expr = x[[cmp]], where = env))
    value(x, cmp) <- eval(expr)
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

  stopifnot(is.character(val), length(val) <= 1L)

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

  stopifnot(is.character(val), length(val) <= 1L)

  if (length(val) && !val %in% value(x, "choices")) {
    value(x) <- character()
  }

  x
}

#' @param choices Set of permissible values
#' @rdname new_field
#' @export
new_select_field <- function(value = character(), choices = character(), ...) {
  new_field(value, choices = choices, ..., class = "select_field")
}

#' @rdname new_field
#' @export
select_field <- function(...) validate_field(new_select_field(...))

#' @param name Field component name
#' @rdname new_field
#' @export
value <- function(x, name = "value") {

  stopifnot(is_field(x))

  res <- x[[name]]

  if (is.language(res)) {
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

  stopifnot(is_field(x))

  if (is.language(x[[name]])) {
    attr(x[[name]], "result") <- value
  } else {
    x[[name]] <- value
  }

  x
}
