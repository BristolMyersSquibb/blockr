#' UI
#'
#' Generic for UI generation
#'
#' @param x Object for which to generate UI components
#' @param ... Generic consistency
#'
#' @export
generate_ui <- function(x, ...) {
  UseMethod("generate_ui")
}

#' @param id UI IDs
#' @rdname generate_ui
#' @export
generate_ui.block <- function(x, id, ...) {

  stopifnot(...length() == 0L)

  ns <- shiny::NS(id)

  fields <- ls(envir = x)

  inputs <- set_names(
    vector("list", length(fields)),
    fields
  )

  for (field in fields) {
    inputs[[field]] <- ui_input(
      get(field, envir = x, inherits = FALSE),
      id = ns(field),
      name = field
    )
  }

  div_card(
    title = shiny::h4(attr(x, "name")),
    do.call(shiny::div, unname(inputs)),
    shiny::verbatimTextOutput(ns("code")),
    shiny::verbatimTextOutput(ns("data"))
  )
}

#' @rdname generate_ui
#' @export
generate_ui.stack <- function(x, ...) {

  stopifnot(...length() == 0L)

  shiny::fluidPage(
    lapply(x, generate_ui, id = attr(x, "name"))
  )
}

#' @param name Field name
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

div_card <- function(..., title = NULL, footer = NULL) {
  shiny::div(
    class = "panel panel-default",
    style = "margin: 10px",
    if (not_null(title)) {
      shiny::div(title, class = "panel-heading")
    },
    shiny::div(
      class = "panel-body",
      ...
    ),
    if (not_null(footer)) {
      shiny::div(footer, class = "panel-footer")
    }
  )
}
