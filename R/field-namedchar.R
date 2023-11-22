#' @rdname new_field
#' @export
new_namedchar_field <- function(value = character(), ...) {
  new_field(value, ..., class = c("namedchar_field"))
}

#' @rdname generate_ui
#' @export
ui_input.namedchar_field <- function(x, id, name) {
  uiOutput(input_ids(x, id))
}

validate_field.namedchar_field <- function(x) {
  val <- value(x)
  x
}
