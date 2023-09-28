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

  ns <- NS(
    NS(id)(attr(x, "name"))
  )

  fields <- Map(
    ui_input,
    x,
    id = chr_ply(names(x), ns),
    name = names(x)
  )

  div_card(
    id = ns("block"),
    title = h4(attr(x, "name")),
    do.call(div, unname(fields)),
    ui_code(x, ns),
    ui_output(x, ns)
  )
}

#' @rdname generate_ui
#' @export
generate_ui.stack <- function(x, ...) {

  stopifnot(...length() == 0L)

  ns <- NS(attr(x, "name"))

  tagList(
    do.call(
      fluidPage,
      c(
        lapply(x, generate_ui, id = attr(x, "name")),
        title = attr(x, "name")
      )
    ),
    actionButton(ns("add"), icon("plus"))
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
  textInput(input_ids(x, id), name, value(x))
}

#' @rdname generate_ui
#' @export
ui_input.select_field <- function(x, id, name) {
  selectInput(
    input_ids(x, id), name, value(x, "choices"), value(x), value(x, "multiple")
  )
}

#' @rdname generate_ui
#' @export
input_ids <- function(x, ...) {
  UseMethod("input_ids", x)
}

#' @rdname generate_ui
#' @export
input_ids.block <- function(x, ...) {
  Map(input_ids, x, names(x))
}

#' @rdname generate_ui
#' @export
input_ids.field <- function(x, name, ...) {
  name
}

#' @rdname generate_ui
#' @export
input_ids.list_field <- function(x, name, ...) {
  sub_names <- names(value(x, "sub_fields"))
  set_names(paste0(name, "_", sub_names), sub_names)
}

#' @rdname generate_ui
#' @export
ui_input.variable_field <- function(x, id, name) {

  field <- validate_field(
    materialize_variable_field(x)
  )

  div(
    id = paste0(id, "_cont"),
    ui_input(field, id, name)
  )
}

#' @rdname generate_ui
#' @export
ui_input.range_field <- function(x, id, name) {
  sliderInput(
    input_ids(x, id), name, value(x, "min"), value(x, "max"), value(x)
  )
}

#' @rdname generate_ui
#' @export
ui_input.hidden_field <- function(x, id, name) {
  NULL
}

#' @rdname generate_ui
#' @export
ui_input.list_field <- function(x, id, name) {

  fields <- lapply(
    update_sub_fields(value(x, "sub_fields"), value(x)),
    validate_field
  )

  # TODO: indicate nesting of fields, nice version of
  # `paste0(name, "_", names(fields))` instead of just `names(fields)`

  args <- c(
    list(id = paste0(id, "_cont")),
    map(ui_input, fields, input_ids(x, id), names(fields))
  )

  do.call(div, args)
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
  updateTextInput(session, input_ids(x, id), name, value(x))
}

#' @rdname generate_ui
#' @export
ui_update.select_field <- function(x, session, id, name) {
  updateSelectInput(
    session, input_ids(x, id), name, value(x, "choices"), value(x)
  )
}

#' @rdname generate_ui
#' @export
ui_update.variable_field <- function(x, session, id, name) {

  ns <- session$ns
  ns_id <- ns(id)

  removeUI(
    selector = paste0("#", ns_id, "_cont", " > div"),
    session = session
  )

  field <- validate_field(
    materialize_variable_field(x)
  )

  insertUI(
    selector = paste0("#", ns_id, "_cont"),
    ui = ui_input(field, ns_id, name),
    session = session
  )
}

#' @rdname generate_ui
#' @export
ui_update.range_field <- function(x, session, id, name) {
  updateSliderInput(
    session, input_ids(x, id), name, value(x), value(x, "min"), value(x, "max")
  )
}

#' @rdname generate_ui
#' @export
ui_update.hidden_field <- function(x, session, id, name) {
  NULL
}

#' @rdname generate_ui
#' @export
ui_update.list_field <- function(x, session, id, name) {

  ns <- session$ns
  ns_id <- ns(id)

  removeUI(
    selector = paste0("#", ns_id, "_cont", " > div"),
    multiple = TRUE,
    session = session
  )

  fields <- lapply(
    update_sub_fields(value(x, "sub_fields"), value(x)),
    validate_field
  )

  insertUI(
    selector = paste0("#", ns_id, "_cont"),
    ui = do.call(
      tagList,
      map(
        ui_input, fields, input_ids(x, ns_id), paste0(name, "_", names(fields))
      )
    ),
    session = session
  )
}

div_card <- function(..., title = NULL, footer = NULL) {
  div(
    class = "panel panel-default",
    style = "margin: 10px",
    if (not_null(title)) {
      div(title, class = "panel-heading")
    },
    div(
      class = "panel-body",
      ...
    ),
    if (not_null(footer)) {
      div(footer, class = "panel-footer")
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
  verbatimTextOutput(ns("output"))
}

#' @rdname generate_ui
#' @export
ui_code <- function(x, ns) {
  UseMethod("ui_code", x)
}

#' @rdname generate_ui
#' @export
ui_code.block <- function(x, ns) {
  verbatimTextOutput(ns("code"))
}
