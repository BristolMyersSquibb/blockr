#' Fields
#'
#' Each block consists of a set of fields, which define the type of value
#' the field holds and can be used to customize how the UI is generated.
#'
#' @param value Field value
#' @param ... Further (metadata) attributes
#' @param type Field type (allowed values are `"literal"` and `"name"`)
#' @param class Field subclass
#'
#' @export
new_field <- function(value, ..., type = c("literal", "name"),
                      class = character()) {

  structure(value, ..., type = match.arg(type), class = c(class, "field"))
}

#' @param x An object inheriting form `"field"`
#' @rdname new_field
#' @export
validate_field <- function(x) {

  if (length(x)) {
    UseMethod("validate_field", x)
  }

  x
}

#' @rdname new_field
#' @export
validate_field.field <- function(x) {
  stop("no base-class validator for fields available")
}

#' @rdname new_field
#' @export
is_field <- function(x) inherits(x, "field")

#' @rdname new_field
#' @export
validate_field.string_field <- function(x) {
  stopifnot(is_string(x))
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
  stopifnot(is_string(x), x %in% attr(x, "choices"))
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

`value<-` <- function(x, value) {

  stopifnot(is_field(x))

  attributes(value) <- attributes(x)

  validate_field(value)
}

value <- function(x) {
  stopifnot(is_field(x))
  c(x)
}

`meta<-` <- function(x, which, value) {

  stopifnot(is_field(x))

  attr(x, which) <- value

  validate_field(x)
}

meta <- function(x, which) {
  stopifnot(is_field(x))
  attr(x, which)
}

#' @rdname new_field
#' @export
new_field_list <- function(...) {

  fields <- list(...)

  stopifnot(all(lgl_ply(fields, is_field)))

  structure(fields, class = "field_list")
}

#' @rdname new_field
#' @export
is_field_list <- function(x) {
  inherits(x, "field_list")
}
