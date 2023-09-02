#' UI
#'
#' Generic for UI generation
#'
#' @param x Object for which to generate UI components
#'
#' @export
generate_ui <- function(x) {
  UseMethod("generate_ui")
}

#' @rdname generate_ui
#' @export
generate_ui.block <- function(x) {
  lapply(x, ui_input, paste0(attr(x, "name"), names(x)), names(x))
}

#' @rdname generate_ui
#' @export
generate_ui.stack <- function(x) {
  shiny::fluidPage(lapply(x, generate_ui))
}

#' @param id,name Field ID and name
#' @rdname generate_ui
#' @export
ui_input <- function(x, id, name) {
  UseMethod("ui_input", x)
}

#' @rdname generate_ui
#' @export
ui_input.field <- function(x, id, name) {
  stop("no base-class UI input for fields available")
}

#' @rdname generate_ui
#' @export
ui_input.string_field <- function(x, id, name) {
  shiny::textInput(id, name, x)
}

#' @rdname generate_ui
#' @export
ui_input.select_field <- function(x, id, name) {
  shiny::selectInput(id, name, attr(x, "choices"), x)
}
