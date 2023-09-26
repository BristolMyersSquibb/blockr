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
    ui_code(x, ns),
    ui_output(x, ns)
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
ui_input.string_field <- function(x, id, name) {
  shiny::textInput(id, name, value(x))
}

#' @rdname generate_ui
#' @export
ui_input.select_field <- function(x, id, name) {
  shiny::selectInput(id, name, value(x, "choices"), value(x))
}

#' @rdname generate_ui
#' @export
ui_input.variable_field <- function(x, id, name) {

  field <- validate_field(
    materialize_variable_field(x)
  )

  shiny::div(
    id = paste0(id, "_cont"),
    ui_input(field, id, name)
  )
}

#' @rdname generate_ui
#' @export
ui_input.range_field <- function(x, id, name) {
  shiny::sliderInput(id, name, value(x, "min"), value(x, "max"), value(x))
}

#' @rdname generate_ui
#' @export
ui_input.hidden_field <- function(x, id, name) {
  NULL
}

#' @param session Shiny session
#' @rdname generate_ui
#' @export
ui_update <- function(x, session, id, name) {
  UseMethod("ui_update", x)
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

#' @rdname generate_ui
#' @export
ui_update.variable_field <- function(x, session, id, name) {

  ns <- session$ns
  ns_id <- ns(id)

  shiny::removeUI(
    selector = paste0("#", ns_id, "_cont", " > div"),
    session = session
  )

  field <- validate_field(
    materialize_variable_field(x)
  )

  shiny::insertUI(
    selector = paste0("#", ns_id, "_cont"),
    ui = ui_input(field, ns_id, name),
    session = session
  )
}

#' @rdname generate_ui
#' @export
ui_update.range_field <- function(x, session, id, name) {
  shiny::updateSliderInput(
    session, id, name, value(x), value(x, "min"), value(x, "max")
  )
}

#' @rdname generate_ui
#' @export
ui_update.hidden_field <- function(x, session, id, name) {
  NULL
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

#' @param ns Output namespace
#' @rdname generate_ui
#' @export
ui_output <- function(x, ns) {
  UseMethod("ui_output", x)
}

#' @rdname generate_ui
#' @export
ui_output.block <- function(x, ns) {
  shiny::verbatimTextOutput(ns("output"))
}

#' @rdname generate_ui
#' @export
ui_code <- function(x, ns) {
  UseMethod("ui_code", x)
}

#' @rdname generate_ui
#' @export
ui_code.block <- function(x, ns) {
  shiny::verbatimTextOutput(ns("code"))
}
