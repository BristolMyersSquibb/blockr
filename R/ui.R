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

  data_switch <- NULL
  if (!inherits(x, "plot_block")) {
    data_switch <- bslib::input_switch(
      ns("data_switch"),
      "Show data?",
      value = TRUE
    )
    data_switch <- shiny::tagAppendAttributes(
      data_switch,
      `data-bs-toggle` = "collapse",
      href = sprintf("#%s", ns("collapse_data")),
      `aria-expanded` = "true",
      `aria-controls` = ns("collapse_data")
    )
  }

  shiny::tagList(
    # Ensure collapse is visible
    shiny::tags$head(
      shiny::tags$script(
        sprintf(
          "$(function() {
            const bsCollapse = new bootstrap.Collapse('#%s', {
              toggle: true
            });
          });",
          ns("collapse_data")
        )
      )
    ),
    div_card(
      title = shiny::h4(attr(x, "name")),
      bslib::layout_sidebar(
        sidebar = shiny::tagList(
          data_switch,
          do.call(shiny::div, unname(fields))
        ),
        ui_code(x, ns),
        shiny::tags$div(
          class = "collapse",
          id = ns("collapse_data"),
          ui_output(x, ns)
        )
      )
    )
  )
}

#' @rdname generate_ui
#' @export
generate_ui.stack <- function(x, ...) {
  stopifnot(...length() == 0L)

  bslib::page_fluid(
    do.call(
      bslib::accordion,
      c(
        lapply(x, generate_ui, id = attr(x, "name")),
        title = attr(x, "name"),
        open = TRUE
      )
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
  shiny::selectInput(
    id,
    name,
    value(x, "choices"),
    value(x),
    # Support multi select
    multiple = if (!is.null(attr(x, "multiple"))) {
      attr(x, "multiple")
    } else {
      FALSE
    }
  )
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

#' Custom card container
#' @keywords internal
div_card <- function(..., title = NULL, footer = NULL) {
  bslib::accordion_panel(
    # class = "panel panel-default", #nolint start
    # style = "margin: 10px;",
    title = if (not_null(title)) title,
    value = "plop",
    ... # ,
    # if (not_null(footer)) {
    #  shiny::div(footer, class = "panel-footer")
    # } #nolint end
  )
}

#' Custom code container
#' @keywords internal
custom_verbatim_output <- function(id) {
  tmp <- shiny::verbatimTextOutput(id)
  tmp$attribs$style <- "max-height: 400px; overflow-y: scroll"
  tmp
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
  custom_verbatim_output(ns("output"))
}

#' @rdname generate_ui
#' @export
ui_output.plot_block <- function(x, ns) {
  shiny::plotOutput(ns("plot"))
}

#' @rdname generate_ui
#' @export
ui_code <- function(x, ns) {
  UseMethod("ui_code", x)
}

#' @rdname generate_ui
#' @export
ui_code.block <- function(x, ns) {
  custom_verbatim_output(ns("code"))
}
