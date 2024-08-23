#' Fields
#'
#' Each block consists of a set of fields, which define the type of value
#' the field holds and can be used to customize how the UI is generated.
#'
#' @param value Field value
#' @param ... Further field components
#' @param type Field type (allowed values are `"literal"` and `"name"`)
#' @param title A brief title for the field, primarily for display purposes.
#' @param descr A description of the field, explaining its purpose or usage.
#' @param status The status of the field (experimental)
#' @param class Field subclass
#' feature. Default to FALSE. Not yet used.
#'
#' @export
#' @rdname new_field
new_field <- function(value, ..., type = c("literal", "name"), title = "",
                      descr = "", status = c("active", "disabled", "invisible"),
                      class = character()) {

  x <- list(value = value, ...)

  status <- match.arg(status)

  stopifnot(is.list(x), length(unique(names(x))) == length(x))

  structure(
    x,
    type = match.arg(type),
    class = c(class, "field"),
    title = title,
    descr = descr,
    status = status
  )
}

#' @rdname new_field
#' @param x An object inheriting form `"field"`
#' @export
is_field <- function(x) inherits(x, "field")

#' Initialize field generic
#'
#' TBD
#'
#' @rdname initialize_field
#' @inheritParams is_field
#' @param env Environment with data and other field values
#' @export
#' @returns The field.
initialize_field <- function(x, env = list()) {
  UseMethod("initialize_field", x)
}

#' @rdname initialize_field
#' @export
initialize_field.field <- function(x, env = list()) {
  update_functional_field_components(x, env)
}

#' @rdname initialize
#' @export
is_initialized.field <- function(x) {
  all(lengths(get_field_component_values(x)) > 0)
}

#' Update field generic
#'
#' Update a field with a new value.
#' Needed by \link{update_fields} in a block. Necessary to keep
#' the R object in sync with the Shiny interface state (input state).
#'
#' @inheritParams is_field
#' @param new Value to set
#' @inheritParams initialize_field
#' @returns The modified field.
#' @rdname update_field
#' @export
update_field <- function(x, new, env = list()) {
  UseMethod("update_field", x)
}

#' @rdname update_field
#' @export
update_field.field <- function(x, new, env = list()) {
  x <- update_field_components(x, env)
  x <- update_field_value(x, new)
  x
}

#' @rdname update_field
#' @export
update_field.field <- function(x, new, env = list()) {
  x <- update_field_components(x, env)
  x <- update_field_value(x, new)
  x
}

#' @rdname update_field
#' @export
update_field_components <- function(x, env = list()) {
  UseMethod("update_field_components", x)
}

#' @rdname update_field
#' @export
update_field_components.field <- function(x, env = list()) {

  update_field_value(
    update_functional_field_components(x, env),
    field_value(x)
  )
}

#' @rdname update_field
#' @export
update_field_value <- function(x, new) {
  UseMethod("update_field_value", x)
}

#' @rdname update_field
#' @export
update_field_value.field <- function(x, new) {

  if (length(new)) {
    set_field_component_value(x, "value", new)
  } else {
    x
  }
}

#' Get field attribute value
#'
#' Get the field value attribute. If it is a function,
#' return the result attribute instead.
#'
#' @inheritParams is_field
#' @returns Field value
#' @export
field_value <- function(x) UseMethod("field_value", x)

#' @rdname field_value
#' @export
field_value.field <- function(x) field_component(x, "value")

#' @param name Component name
#' @rdname field_value
#' @export
field_component <- function(x, name) UseMethod("field_component", x)

#' @rdname field_value
#' @export
field_component.field <- function(x, name) {
  get_field_component_value(x, name)
}

#' @returns Field value
#' @export
value <- function(x, name = "value") {
  switch(name, value = field_value(x), field_component(x, name))
}
