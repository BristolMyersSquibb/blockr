#' UI
#'
#' Generic for UI generation
#'
#' @param x Object for which to generate UI components
#' @param ... Generic consistency
#' @param .hidden Whether to initialise the block hidden.
#'
#' @export
generate_ui <- function(x, ...) {
  UseMethod("generate_ui")
}

#' @param id UI IDs
#' @rdname generate_ui
#' @export
generate_ui.block <- function(x, id, ..., .hidden = !getOption("BLOCKR_DEV", FALSE)) {
  stopifnot(...length() == 0L)

  ns <- NS(id)

  fields <- Map(
    ui_input,
    x,
    id = chr_ply(names(x), ns),
    name = names(x)
  )

  code_id <- ns("codeCollapse")
  output_id <- ns("outputCollapse")

  header <- block_title(x, code_id, output_id, ns, .hidden)

  block_class <- "block"
  if (.hidden) {
    block_class <- sprintf("%s d-none", block_class)
  }

  inputs_hidden <- ""
  loading_class <- "d-none"
  if (.hidden) {
    inputs_hidden <- "d-none"
    loading_class <- ""
  }

  layout <- attr(x, "layout")

  div(
    class = block_class,
    `data-block-type` = paste0(class(x), collapse = ","),
    `data-value` = ns("block"),
    shiny::div(
      class = "card shadow-sm p-2 mb-2 border",
      shiny::div(
        class = "card-body p-1",
        header,
        div(
          class = "block-validation"
        ),
        div(
          class = sprintf("block-inputs %s", inputs_hidden),
          layout(fields)
        ),
        div(
          class = "collapse block-code",
          id = code_id,
          uiCode(x, ns)
        ),
        div(
          class = sprintf("%s block-output", inputs_hidden),
          id = output_id,
          uiOutputBlock(x, ns),
          div(
            class = sprintf(
              "block-loading d-flex justify-content-center %s",
              loading_class
            ),
            div(
              class = "spinner-border text-primary",
              role = "status",
              span(
                class = "visually-hidden",
                "Loading..."
              )
            )
          )
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
  body_id <- sprintf("%s-body", id)

  ns <- NS(id)

  tagList(
    shiny::div(
      class = "card stack border",
      id = id,
      stack_header(x, ns),
      shiny::div(
        class = "card-body p-1",
        id = body_id,
        lapply(x, \(b) {
          generate_ui(b, id = ns(attr(b, "name")))
        })
      )
    ),
    sortable::sortable_js(
      body_id,
      options = sortable::sortable_options(
        draggable = ".block",
        handle = ".block-handle"
      )
    ),
    blockrDependencies(),
    highlightDependencies()
  )
}

#' @importFrom shiny tags div
block_title <- function(block, code_id, output_id, ns, .hidden) {
  hidden_class <- ""
  if (.hidden) {
    hidden_class <- "d-none"
  }

  title <- class(block)[1] |>
    (\(.) gsub("_.*$", "", .))() |>
    tools::toTitleCase()

  div(
    class = sprintf("m-0 card-title block-title %s", hidden_class),
    div(
      class = "d-flex",
      div(
        class = "flex-grow-1",
        shiny::p(
          span(icon("grip-vertical"), class = "block-handle text-muted"),
          title,
          class = "fw-bold"
        )
      ),
      div(
        class = "flex-grow-1",
        span(
          class = "block-feedback text-muted",
          span(textOutput(ns("nrow"), inline = TRUE), class = "fw-bold"),
          "rows |",
          class = "block-feedback text-muted",
          span(textOutput(ns("ncol"), inline = TRUE), class = "fw-bold"),
          "cols"
        )
      ),
      div(
        class = "flex-shrink-1",
        actionLink(
          ns("remove"),
          icon("trash"),
          class = "text-decoration-none block-remove",
        ),
        tags$a(
          class = "text-decoration-none block-code-toggle",
          `data-bs-toggle` = "collapse",
          href = sprintf("#%s", code_id),
          `aria-expanded` = "false",
          `aria-controls` = code_id,
          iconCode()
        ),
        tags$a(
          class = "text-decoration-none block-output-toggle",
          href = sprintf("#%s", output_id),
          iconOutput()
        )
      )
    )
  )
}

#' @importFrom shiny icon tags div
stack_header <- function(stack, ns) {
  title <- attr(stack, "name")

  div(
    class = "card-header",
    div(
      class = "d-flex",
      if (not_null(title)) {
        div(
          class = "flex-grow-1",
          bmsui::togglerTextInput(
            ns("title"),
            title,
            restore = TRUE
          )
        )
      },
      div(
        class = "flex-shrink-1",
        div(
          class = "ps-1 py-2",
          actionLink(
            ns("remove"),
            "",
            class = "text-decoration-none stack-remove",
            iconTrash()
          ),
          tags$a(
            class = "text-decoration-none stack-copy-code",
            iconCode()
          ),
          tags$a(
            class = "text-decoration-none stack-edit-toggle",
            iconEdit()
          )
        )
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
  selectizeInput(
    input_ids(x, id), name, value(x, "choices"), value(x), value(x, "multiple"),
    options = list(
      dropdownParent = "body",
      placeholder = "Please select an option below"
    )
  )
}

#' @rdname generate_ui
#' @export
ui_input.switch_field <- function(x, id, name) {
  bslib::input_switch(input_ids(x, id), name, value(x))
}

#' @rdname generate_ui
#' @export
ui_input.numeric_field <- function(x, id, name) {
  numericInput(
    input_ids(x, id), name, value(x), value(x, "min"), value(x, "max")
  )
}

#' @rdname generate_ui
#' @export
ui_input.submit_field <- function(x, id, name) {
  actionButton(
    input_ids(x, id),
    name,
    icon = icon("play"),
    class = "btn btn-success mt-4"
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
ui_update.numeric_field <- function(x, session, id, name) {
  updateNumericInput(
    session, input_ids(x, id), name, value(x), value(x, "min"), value(x, "max")
  )
}

#' @rdname generate_ui
#' @export
ui_update.submit_field <- function(x, session, id, name) {
  updateActionButton(
    session,
    input_ids(x, id),
    name
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
uiOutputBlock <- function(x, ns) {
  UseMethod("uiOutputBlock", x)
}

#' @rdname generate_ui
#' @export
uiOutputBlock.block <- function(x, ns) {
  DT::dataTableOutput(ns("res"))
}

#' @rdname generate_ui
#' @export
uiOutputBlock.plot_block <- function(x, ns) {
  shiny::plotOutput(ns("plot"))
}

#' @rdname generate_ui
#' @export
uiOutputBlock.ggiraph_block <- function(x, ns) {
  ggiraph::girafeOutput(ns("plot"))
}

#' @rdname generate_ui
#' @export
uiCode <- function(x, ns) {
  UseMethod("uiCode", x)
}

#' @rdname generate_ui
#' @export
uiCode.block <- function(x, ns) {
  div(
    class = "position-relative",
    tags$a(
      class = "btn btn-sm btn-info position-absolute top-0 end-0 block-copy-code",
      icon("copy")
    ),
    shiny::verbatimTextOutput(ns("code"))
  )
}

#' @importFrom shiny icon
iconCode <- function() {
  icon("code")
}

#' @importFrom shiny icon
iconEdit <- function() {
  icon("edit")
}

#' @importFrom shiny icon
iconOutput <- function() {
  icon("arrow-right-from-bracket")
}

#' @importFrom shiny icon
iconTrash <- function() {
  icon("trash")
}
