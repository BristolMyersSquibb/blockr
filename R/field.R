#' Fields
#'
#' Each block consists of a set of fields, which define the type of value
#' the field holds and can be used to customize how the UI is generated.
#'
#' @param value Field value
#' @param ... Further (metadata) attributes
#' @param class Field subclass
#'
#' @export
new_field <- function(value, ..., class = character()) {
  structure(value, ..., class = c(class, "field"))
}

#' @param x An object inheriting form `"field"`
#' @rdname new_field
#' @export
validate_field <- function(x) {
  UseMethod("validate_field")
}

#' @rdname new_field
#' @export
validate_field.field <- function(x) {
  stop("no base-class validator for fields available")
}

#' @param id,name Field ID and name
#' @rdname new_field
#' @export
ui_input <- function(id, name, x) {
  UseMethod("ui_input", x)
}

#' @rdname new_field
#' @export
ui_input.field <- function(id, name, x) {
  stop("no base-class UI input for fields available")
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
string_field <- function(value) {
  validate_field(
    new_field(value, class = "string_field")
  )
}

#' @rdname new_field
#' @export
ui_input.string_field <- function(id, name, x) {
  shiny::textInput(id, name, x)
}

#' @rdname new_field
#' @export
validate_field.select_field <- function(x) {
  stopifnot(is_string(x), x %in% attr(x, "choices"))
  x
}

#' @param choices Set of permissible values
#' @rdname new_field
#' @export
select_field <- function(value, choices) {
  validate_field(
    new_field(value, choices = choices, class = "select_field")
  )
}

#' @rdname new_field
#' @export
ui_input.select_field <- function(id, name, x) {
  shiny::selectInput(id, name, attr(x, "choices"), x)
}
