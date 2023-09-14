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

  plots <- if (inherits(x, "plot_block")) {
    # TO DO: why calling ui_output fails?
    shiny::plotOutput(ns("plot"))
    #ui_output(x, id = ns("plot"))
  }

  div_card(
    title = shiny::h4(attr(x, "name")),
    do.call(shiny::div, unname(fields)),
    shiny::verbatimTextOutput(ns("code")),
    custom_verbatim_output(ns("data")),
    plots
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
  shiny::textInput(id, name, x)
}

#' @rdname generate_ui
#' @export
ui_input.select_field <- function(x, id, name) {
  shiny::selectInput(
    id,
    name,
    attr(x, "choices"),
    x,
    # Support multi select
    multiple = if (!is.null(attr(x, "multiple"))) {
      attr(x, "multiple")
    } else {
      FALSE
    }
  )
}

#' @rdname generate_ui
#' @export
ui_output <- function(x, id) {
  UseMethod("ui_output", x)
}

#' @rdname generate_ui
#' @export
ui_output.plot_block <- function(id) {
  shiny::plotOutput(id)
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
  shiny::updateTextInput(session, id, name, x)
}

#' @rdname generate_ui
#' @export
ui_update.select_field <- function(x, session, id, name) {
  shiny::updateSelectInput(session, id, name, attr(x, "choices"), x)
}

#' Custom card container
#' @keywords internal
div_card <- function(..., title = NULL, footer = NULL) {
  shiny::div(
    class = "panel panel-default",
    style = "margin: 10px;",
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

#' Custom code container
#' @keywords internal
custom_verbatim_output <- function(id) {
  tmp <- shiny::verbatimTextOutput(id)
  tmp$attribs$style <- "max-height: 400px; overflow-y: scroll"
  tmp
}