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

  ns <- shiny::NS(
    shiny::NS(id)(attr(x, "name"))
  )

  fields <- Map(
    ui_input,
    x,
    id = chr_ply(names(x), ns),
    name = names(x)
  )

  div_card(
    title = shiny::h4(attr(x, "name")),
    do.call(shiny::div, unname(fields)),
    shiny::verbatimTextOutput(ns("code")),
    shiny::verbatimTextOutput(ns("data"))
  )
}

#' @rdname generate_ui
#' @export
generate_ui.stack <- function(x, ...) {

  stopifnot(...length() == 0L)

  do.call(
    shiny::fluidPage,
    c(
      lapply(x, generate_ui, id = attr(x, "name")),
      title = attr(x, "name")
    )
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
  shiny::textInput(id, name, value(x))
}

#' @rdname generate_ui
#' @export
ui_input.select_field <- function(x, id, name) {
  shiny::selectInput(id, name, value(x, "choices"), value(x))
}

#' @param session Shiny session
#' @rdname generate_ui
#' @export
ui_update <- function(x, session, id, name) {
  UseMethod("ui_update", x)
}

#' @rdname generate_ui
#' @export
ui_update.field <- function(x, session, id, name) {
  stop("no base-class UI update for fields available")
}

#' @rdname generate_ui
#' @export
ui_update.string_field <- function(x, session, id, name) {
  shiny::updateTextInput(session, id, name, value(x))
}

#' @rdname generate_ui
#' @export
ui_update.select_field <- function(x, session, id, name) {
  shiny::updateSelectInput(session, id, name, value(x, "choices"), value(x))
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
