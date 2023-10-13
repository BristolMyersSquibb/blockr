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

  ns <- NS(id)

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
      value = ns("block"),
      title = shiny::h4(
        shiny::HTML(
          sprintf(
            "Block: %s",
            strsplit(class(x)[[1]], "_")[[1]][1]
          )
        )
      ),
      bslib::layout_sidebar(
        sidebar = shiny::tagList(
          actionButton(ns("remove"), icon("trash"), class = "pull-right"),
          data_switch,
          do.call(shiny::div, unname(fields))
        ),
        ui_code(x, ns),
        shiny::tags$div(
          class = "collapse",
          id = ns("collapse_data"),
          ui_output(x, ns),
          # we should just grab the block type
          # but we cannot predict the order of the classes
          # we should also pass it somewhere else but bslib seems
          # to strip everything
          `data-block-type` = paste0(class(x), collapse=","),
        )
      )
    )
  )
}

#' @rdname generate_ui
#' @export
generate_ui.stack <- function(x, id = NULL, ...) {
  stopifnot(...length() == 0L)

  id <- if (is.null(id)) attr(x, "name") else id

  ns <- NS(id)

  div(
    class = "stack",
    tags$script(
      HTML(
        sprintf(
          "$(function() {
            $(document).on(
              'shiny:inputchanged',
              function(event) {
                if (event.name.match('(last_changed|clientdata)') === null) {
                  Shiny.setInputValue(
                    '%s',
                    {
                      name: event.name,
                      value: event.value,
                      type: event.inputType,
                      binding: event.binding !== null ? event.binding.name : ''
                    }
                  );
                }
            });
          });
          ",
          ns("last_changed")
        )
      )
    ),
    do.call(
      bslib::accordion,
      c(
        lapply(x, function(b) {
          generate_ui(b, id = ns(attr(b, "name")))
        }),
        open = TRUE,
        id = ns("stack")
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
ui_input.switch_field <- function(x, id, name) {
  bslib::input_switch(input_ids(x, id), name, value(x))
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
ui_update.switch_field <- function(x, session, id, name) {
  bslib::update_switch(input_ids(x, id), name, value(x), session)
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

#' Custom card container
#' @keywords internal
div_card <- function(..., title = NULL, value) {
  panel_tag <- bslib::accordion_panel(
    title = if (not_null(title)) title,
    value = value,
    ...
  )
  tagAppendAttributes(panel_tag, class = "block")
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
  DT::dataTableOutput(ns("res"))
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
