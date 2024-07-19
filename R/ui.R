#' UI
#'
#' Generic for UI generation
#'
#' @param x Object for which to generate UI components
#' @param ... Generic consistency
#' @param .hidden Whether to initialise the block hidden.
#'
#' @export
#' @rdname generate_ui
generate_ui <- function(x, ...) {
  UseMethod("generate_ui")
}

#' Block fields generic
#'
#' Generic for creating fields UI container
#'
#' @inheritParams generate_ui
#' @rdname ui_fields
#' @export
ui_fields <- function(x, ...) {
  UseMethod("ui_fields", x)
}

#' @rdname ui_fields
#' @param ns Module namespace
#' @param inputs_hidden For styling purposes: CSS class to apply
#' when the block is collapsed.
#' @export
ui_fields.block <- function(x, ns, inputs_hidden, ...) {
  fields <- Map(
    ui_input,
    x,
    id = chr_ply(names(x), ns),
    name = get_field_names(x)
  )

  div(
    class = sprintf("block-inputs mt-2 %s", inputs_hidden),
    layout(x, fields)
  )
}

#' Block body generic
#'
#' Generic for creating fields UI container
#'
#' @inheritParams ui_fields
#' @rdname block_body
#' @export
block_body <- function(x, ...) {
  UseMethod("block_body", x)
}

#' @rdname block_body
#' @export
block_body.block <- function(x, ns, inputs_hidden, ...) {
  result_id <- ns("outputCollapse")

  loading_class <- "d-none"
  if (inputs_hidden == "") {
    loading_class <- ""
  }

  tagList(
    tags$a(
      class = "text-decoration-none block-output-toggle",
      href = sprintf("#%s", result_id),
      iconOutput()
    ),
    ui_fields(x, ns, inputs_hidden),
    div(
      class = sprintf("%s block-output", inputs_hidden),
      id = result_id,
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
}

#' Block code generic
#'
#' Generic for creating the block code UI elements that
#' are the toggle and the code container.
#'
#' @inheritParams ui_fields
#' @rdname block_code
#' @export
block_code <- function(x, ...) {
  UseMethod("block_code", x)
}

#' @rdname block_code
#' @export
block_code.block <- function(x, ns, inputs_hidden, ...) {
  code_id <- ns("codeCollapse")

  div(
    class = sprintf("%s block-output", inputs_hidden),
    tags$a(
      class = "text-decoration-none block-code-toggle",
      `data-bs-toggle` = "collapse",
      href = sprintf("#%s", code_id),
      `aria-expanded` = "false",
      `aria-controls` = code_id,
      iconCode()
    ),
    div(
      class = "collapse block-code",
      id = code_id,
      uiCode(x, ns)
    )
  )
}

#' Block header generic
#'
#' Generic for creating the block header.
#'
#' @inheritParams ui_fields
#' @param hidden_class TBD.
#' @rdname block_header
#' @export
block_header <- function(x, ...) {
  UseMethod("block_header", x)
}

#' @importFrom shiny tags div p
#' @rdname block_header
#' @export
block_header.block <- function(x, ns, hidden_class, ...) {
  title <- get_block_title(x)

  div(
    class = sprintf("m-0 card-title block-title %s", hidden_class),
    div(
      class = "d-flex",
      div(
        class = "flex-grow-1",
        p(
          block_icon(x),
          title,
          class = "fw-bold m-0"
        )
      ),
      data_info(x, ns),
      div(
        class = "block-tools flex-shrink-1"
      )
    )
  )
}

#' Data info generic
#'
#' Generic for creating the data info tags,
#' to display the number of columns, rows, ...
#'
#' @inheritParams ui_fields
#' @rdname data_info
#' @export
data_info <- function(x, ...) {
  UseMethod("data_info")
}

#' @rdname data_info
#' @export
data_info.block <- function(x, ns, ...) {
  NULL
}

#' @rdname data_info
#' @export
data_info.data_block <- function(x, ns, ...) {
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
  )
}

#' @rdname data_info
#' @export
data_info.transform_block <- data_info.data_block

#' Block remove generic
#'
#' Generic for creating block remove button.
#'
#' @inheritParams ui_fields
#' @inheritParams inject_remove_button
#' @rdname remove_button
#' @export
remove_button <- function(x, ...) {
  UseMethod("remove_button", x)
}

#' @rdname remove_button
#' @export
remove_button.block <- function(x, id, ...) {
  actionLink(
    id,
    icon("trash"),
    class = "text-decoration-none block-remove",
  )
}

#' @param id UI IDs
#' @rdname generate_ui
#' @export
generate_ui.block <- function(x, id, ...,
                              .hidden = !getOption("BLOCKR_DEV", FALSE)) {
  stopifnot(...length() == 0L)

  ns <- NS(id)

  block_class <- "block"
  inputs_hidden <- ""
  if (.hidden) {
    inputs_hidden <- "d-none"
    block_class <- sprintf("%s d-none", block_class)
  }

  div(
    class = block_class,
    `data-block-type` = paste0(class(x), collapse = ","),
    `data-value` = ns("block"),
    div(
      class = "card shadow-sm p-2 mb-2 border",
      div(
        class = "card-body p-1",
        block_header(x, ns, inputs_hidden),
        div(class = "block-validation"),
        block_body(x, ns, inputs_hidden),
        block_code(x, ns, inputs_hidden),
        download_ui(x, ns, inputs_hidden)
      )
    )
  )
}

#' Add block UI interface
#'
#' Useful to allow stack to add blocks to it.
#' The selected block can be accessed through `input$selected_block`.
#' Combined to the blocks registry API, this allows to select a block from R
#' like \code{available_blocks()[[input$selected_block]]}.
#'
#' @param ns Stack namespace. Default to \link{identity} so
#' that it can be used when the stack is the top level element.
#'
#' @export
add_block_ui <- function(ns = identity) {
  add_block_ui_id <- ns("add")

  log_debug("Adding \"add block\" UI with ID ", add_block_ui_id)

  tagList(
    tags$a(
      icon("plus"),
      class = "stack-add-block text-decoration-none",
      `data-bs-toggle` = "offcanvas",
      `data-bs-target` = sprintf("#%s", ns("addBlockCanvas")),
      `aria-controls` = ns("addBlockCanvas")
    ),
    off_canvas(
      id = ns("addBlockCanvas"),
      title = "Blocks",
      position = "bottom",
      radioButtons(
        ns("selected_block"),
        "Choose a block",
        choices = names(available_blocks()),
        inline = TRUE
      ),
      actionButton(
        add_block_ui_id,
        icon("plus"),
        `data-bs-dismiss` = "offcanvas"
      )
    )
  )
}

#' @rdname generate_ui
#' @export
generate_ui.stack <- function(x, id = NULL, ...) {
  stopifnot(...length() == 0L)

  id <- coal(id, get_stack_name(x))
  ns <- NS(id)

  tagList(
    div(
      class = "card stack border",
      id = id,
      stack_header(x, id, ns),
      div(
        class = "card-body p-1",
        id = sprintf("%s-body", id),
        lapply(seq_along(x), \(i) {
          hidden <- i != length(x)

          if (getOption("BLOCKR_DEV", FALSE)) {
            hidden <- FALSE
          }

          inject_remove_button(x[[i]], ns, .hidden = hidden)
        })
      )
    ),
    useBlockr(),
    tags$script(HTML(sprintf("Shiny.setInputValue('%s', 1);", ns("rendered"))))
  )
}

#' @inheritParams generate_ui
#' @rdname inject_remove_button
#' @export
inject_remove_button <- function(x, ...) {
  UseMethod("inject_remove_button")
}

#' Inject remove button into block header
#'
#' This has to be called from the stack parent
#' namespace. This can also be called dynamically when
#' inserting a new block within a stack.
#'
#' @param ns Parent namespace.
#' @param .hidden Whether to initialise the block with
#' hidden inputs.
#'
#' @export
#' @rdname inject_remove_button
inject_remove_button.block <- function(x, ns, .hidden = !getOption("BLOCKR_DEV", FALSE), ...) {
  id <- attr(x, "name")
  tmp <- generate_ui(x, id = ns(id), .hidden = .hidden)
  # Remove button now belongs to the stack namespace!
  htmltools::tagQuery(tmp)$
    find(".block-tools")$
    prepend(remove_button(x, ns(sprintf("remove-block-%s", id))))$
    allTags() # nolint
}

#' Inject remove button into stack header
#'
#' This has to be called from the workspace parent
#' namespace. This can also be called dynamically when
#' inserting a new stack within a workspace.
#'
#' @param id Parent ID
#'
#' @export
#' @rdname inject_remove_button
inject_remove_button.stack <- function(x, id, ...) {
  stop("Not implemented")
}

#' @rdname remove_button
#' @export
remove_button.stack <- function(x, id, ...) {
  actionLink(
    id,
    icon("trash"),
    class = "text-decoration-none stack-remove",
  )
}

#' Stack header generic
#'
#' Generic for creating stack header.
#'
#' @inheritParams ui_fields
#' @param title Stack title.
#' @rdname stack_header
#' @export
stack_header <- function(x, ...) {
  UseMethod("stack_header", x)
}

#' @rdname stack_header
#' @importFrom shiny icon tags div
stack_header.stack <- function(x, title, ns, ...) {
  icon <- iconEdit()

  edit_class <- "text-decoration-none stack-edit-toggle"

  # the stack is empty we render it editable (open)
  # with correct icon
  if (!length(x)) {
    edit_class <- sprintf("%s editable", edit_class)
    icon <- iconEditable()
  }

  div(
    class = "card-header",
    div(
      class = "d-flex",
      div(
        class = "flex-grow-1 d-inline-flex",
        stackTitleInput(x, ns)
      ),
      div(
        class = "flex-shrink-1",
        actionLink(
          ns("remove"),
          class = "text-decoration-none stack-remove",
          icon("trash")
        ),
        add_block_ui(ns),
        actionLink(
          ns("copy"),
          class = "text-decoration-none stack-copy-code",
          iconCode()
        ),
        tags$a(
          class = edit_class,
          icon
        )
      )
    )
  )
}

stackTitleInput <- function(x, ns) {
  div(
    class = "stack-title",
    `data-title` = get_stack_title(x),
    span(
      class = "cursor-pointer stack-title-display",
      get_stack_title(x)
    ),
    div(
      class = "d-none input-group stack-title-input",
      tags$input(
        id = ns("newTitle"),
        type = "text",
        class = "form-control form-control-sm",
        value = get_stack_title(x)
      ),
      tags$button(
        class = "btn btn-sm btn-success stack-title-save",
        type = "button",
        icon("paper-plane")
      )
    )
  )
}

#' @rdname generate_ui
#' @export
generate_ui.workspace <- function(x, id, ...) {
  stopifnot(...length() == 0L)

  ns <- NS(id)

  stacks <- get_workspace_stacks(workspace = x)

  stack_ui <- div(
    class = "d-flex stacks flex-wrap",
    if (length(stacks) > 0) {
      lapply(seq_along(stacks), \(i) {
        div(
          class = "flex-grow-1 stack-col m-1",
          id = sprintf("%sStackCol", names(stacks)[i]),
          generate_ui(stacks[[i]], ns(names(stacks)[i]))
        )
      })
    }
  )

  tagList(
    workspaceDeps(),
    div(
      class = "d-flex justify-content-center",
      actionButton(
        ns("add_stack"),
        label = "Add stack",
        icon = icon("plus"),
        width = NULL,
        span(class = "badge bg-secondary", textOutput(ns("n_stacks"))),
        class = "mx-2"
      ),
      actionButton(
        ns("clear_stacks"),
        "Clear all",
        icon("trash"),
        class = "bg-danger",
        class = "mx-2"
      ),
      downloadButton(
        ns("serialize"),
        "Save",
        class = "mx-2"
      ),
    ),
    div(class = "m-2 row workspace", stack_ui)
  )
}

#' UI input generic
#'
#' For a given field, generates the corresponding
#' shiny input tag. All \link{ui_update} updates
#' the corresponding input on the server side. \link{input_ids}
#' is reponsible for finding the element id.
#'
#' @inheritParams generate_ui
#' @param name Field name.
#' @rdname ui_input
#' @export
ui_input <- function(x, id, name) {
  UseMethod("ui_input", x)
}

#' @rdname ui_input
#' @export
ui_input.string_field <- function(x, id, name) {
  textInput(input_ids(x, id), name, field_value(x))
}

#' @rdname ui_input
#' @export
ui_input.select_field <- function(x, id, name) {
  selectizeInput(
    input_ids(x, id),
    name,
    field_component(x, "choices"),
    field_value(x),
    field_component(x, "multiple"),
    options = list(
      dropdownParent = "body",
      placeholder = "Please select an option below"
    )
  )
}

#' @rdname ui_input
#' @export
ui_input.switch_field <- function(x, id, name) {
  bslib::input_switch(input_ids(x, id), name, field_value(x))
}

#' @rdname ui_input
#' @export
ui_input.numeric_field <- function(x, id, name) {
  numericInput(
    input_ids(x, id), name, value(x), value(x, "min"), value(x, "max")
  )
}

#' @rdname ui_input
#' @export
ui_input.submit_field <- function(x, id, name) {
  actionButton(
    input_ids(x, id),
    name,
    icon = icon("play"),
    class = "btn btn-success mt-4"
  )
}

#' @rdname ui_input
#' @export
ui_input.upload_field <- function(x, id, name) {

  val <- field_value(x)

  fileInput(
    input_ids(x, id),
    name,
    placeholder = if (length(val)) val else "No file selected"
  )
}

#' @rdname ui_input
#' @export
ui_input.filesbrowser_field <- function(x, id, name) {
  shinyFiles::shinyFilesButton(
    input_ids(x, id),
    label = "File select",
    title = "Please select a file",
    multiple = FALSE
  )
}

#' @rdname ui_input
#' @export
ui_input.result_field <- function(x, id, name) {
  ns <- NS(input_ids(x, id))

  selectizeInput(
    ns("select-stack"),
    name,
    list_workspace_stacks(),
    field_value(x),
    options = list(
      dropdownParent = "body",
      placeholder = "Please select an option below"
    )
  )
}

#' @rdname ui_input
#' @export
ui_input.variable_field <- function(x, id, name) {

  field <- materialize_variable_field(x)

  div(
    id = paste0(id, "_cont"),
    ui_input(field, id, name)
  )
}

#' @rdname ui_input
#' @export
ui_input.range_field <- function(x, id, name) {

  min <- field_component(x, "min")
  max <- field_component(x, "max")

  sliderInput(
    input_ids(x, id),
    name,
    min,
    max,
    coal(field_value(x), c(min, max), continue = function(x) length(x) != 2L)
  )
}

#' @rdname ui_input
#' @export
ui_input.hidden_field <- function(x, id, name) {
  NULL
}

#' @rdname ui_input
#' @export
ui_input.list_field <- function(x, id, name) {

  fields <- materialize_list_field(x)

  args <- c(
    list(id = paste0(id, "_cont")),
    map(ui_input, fields, input_ids(x, id), names(fields))
  )

  do.call(div, args)
}

#' @rdname ui_input
#' @export
ui_input.expression_field <- function(x, id, name) {

  shinyAce::aceEditor(
    input_ids(x, id),
    mode = "r",
    value = field_value(x),
    height = "20px",
    showPrintMargin = FALSE,
    highlightActiveLine = FALSE,
    tabSize = 2,
    theme = "tomorrow",
    maxLines = 1,
    fontSize = 14,
    showLineNumbers = FALSE,
    autoComplete = "live",
    autoCompleters = c("rlang", "static"),
    autoCompleteList = list(extra_values = field_component(x, "autocomplete"))
  )
}

#' @param session Shiny session
#' @rdname ui_input
#' @export
ui_update <- function(x, session, id, name) {
  UseMethod("ui_update", x)
}

#' @rdname ui_input
#' @export
ui_update.string_field <- function(x, session, id, name) {
  updateTextInput(
    session,
    input_ids(x, id),
    get_field_name(x, name),
    field_value(x)
  )
}

#' @rdname ui_input
#' @export
ui_update.select_field <- function(x, session, id, name) {
  updateSelectInput(
    session,
    input_ids(x, id),
    get_field_name(x, name),
    field_component(x, "choices"),
    field_value(x)
  )
}

#' @rdname ui_input
#' @export
ui_update.switch_field <- function(x, session, id, name) {
  bslib::update_switch(
    input_ids(x, id),
    get_field_name(x, name),
    field_value(x),
    session
  )
}

#' @rdname ui_input
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
    ui = ui_input(field, ns_id, get_field_name(x, name)),
    session = session
  )
}

#' @rdname ui_input
#' @export
ui_update.range_field <- function(x, session, id, name) {
  updateSliderInput(
    session,
    input_ids(x, id),
    get_field_name(x, name),
    field_value(x),
    field_component(x, "min"),
    field_component(x, "max")
  )
}

#' @rdname ui_input
#' @export
ui_update.numeric_field <- function(x, session, id, name) {
  updateNumericInput(
    session,
    input_ids(x, id),
    get_field_name(x, name),
    field_value(x),
    field_component(x, "min"),
    field_component(x, "max")
  )
}

#' @rdname ui_input
#' @export
ui_update.submit_field <- function(x, session, id, name) {
  updateActionButton(
    session,
    input_ids(x, id),
    name
  )
}

#' @rdname ui_input
#' @export
ui_update.upload_field <- function(x, session, id, name) {
  NULL
}

#' @rdname ui_input
#' @export
ui_update.filesbrowser_field <- function(x, session, id, name) {
  shinyFiles::shinyFileChoose(
    session$input,
    input_ids(x, id),
    roots = x$volumes
  )
}

#' @rdname ui_input
#' @export
ui_update.hidden_field <- function(x, session, id, name) {
  NULL
}

#' @rdname ui_input
#' @export
ui_update.list_field <- function(x, session, id, name) {
  ns <- session$ns
  ns_id <- ns(id)

  removeUI(
    selector = paste0("#", ns_id, "_cont", " > div"),
    multiple = TRUE,
    session = session
  )

  fields <- materialize_list_field(x)

  insertUI(
    selector = paste0("#", ns_id, "_cont"),
    ui = do.call(
      tagList,
      map(
        ui_input, fields, input_ids(x, ns_id), paste0(name, ": ", names(fields))
      )
    ),
    session = session
  )
}

ace_observer_env <- new.env()

 #' @rdname generate_ui
 #' @export
ui_update.expression_field <- function(x, session, id, name) {

  ns <- session$ns
  ns_id <- ns(id)

  iids <- input_ids(x, ns_id)

  if (!exists(iids, envir = ace_observer_env, inherits = FALSE)) {

    observers <- list(
     autocomplete = shinyAce::aceAutocomplete(input_ids(x, id), session),
     tooltip = shinyAce::aceTooltip(input_ids(x, id), session)
    )

    assign(iids, observers, envir = ace_observer_env)
  }

  val <- field_value(x)
  xtr <- field_component(x, "autocomplete")

  if (identical(session$input[[input_ids(x, id)]], val)) {
    shinyAce::updateAceEditor(
      session,
      input_ids(x, id),
      autoCompleteList = list(extra_values = xtr)
    )
  } else {
    shinyAce::updateAceEditor(
      session,
      input_ids(x, id),
      field_value(x),
      autoCompleteList = list(extra_values = xtr)
    )
  }
}

#' @rdname ui_input
#' @export
input_ids <- function(x, ...) {
  UseMethod("input_ids", x)
}

#' @rdname ui_input
#' @export
input_ids.block <- function(x, ...) {
  Map(input_ids, x, names(x))
}

#' @rdname ui_input
#' @export
input_ids.field <- function(x, name, ...) {
  name
}

#' @rdname generate_ui
#' @param name Input name.
#' @export
input_ids.list_field <- function(x, name, ...) {

  nme <- field_component(x, "name")

  if (length(nme)) {
    nme <- paste0(name, "_", nme)
  }

  Map(input_ids, materialize_list_field(x), nme)
}

#' @rdname ui_input
#' @export
input_ids.hidden_field <- function(x, name, ...) {
  character()
}

#' Render block output generic
#'
#' Renders the block output.
#' @param x Block.
#' @param ns Output namespace
#' @rdname uiOutputBlock
#' @export
uiOutputBlock <- function(x, ns) {
  UseMethod("uiOutputBlock", x)
}

#' @rdname uiOutputBlock
#' @export
uiOutputBlock.block <- function(x, ns) {
  DT::dataTableOutput(ns("res"))
}

#' @rdname uiOutputBlock
#' @export
uiOutputBlock.upload_block <- function(x, ns) {
  shiny::verbatimTextOutput(ns("res"))
}

#' @rdname uiOutputBlock
#' @export
uiOutputBlock.filesbrowser_block <- uiOutputBlock.upload_block

#' @rdname uiOutputBlock
#' @export
uiOutputBlock.plot_block <- function(x, ns) {
  shiny::plotOutput(ns("plot"))
}

#' Copy code generic
#'
#' Generate ui to copy block code and output
#' the code content.
#'
#' @rdname uiCode
#' @inheritParams ui_fields
#' @export
uiCode <- function(x, ns) {
  UseMethod("uiCode", x)
}

#' @rdname uiCode
#' @export
uiCode.block <- function(x, ns) {
  div(
    class = "position-relative",
    actionButton(
      ns("copy"),
      class = "btn-sm btn-info position-absolute top-0 end-0 block-copy-code",
      "",
      icon = icon("copy")
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
  icon("chevron-up")
}

#' @importFrom shiny icon
iconEditable <- function() {
  icon("chevron-down")
}

#' @importFrom shiny icon
iconOutput <- function() {
  icon("chevron-up")
}

#' @importFrom shiny icon
iconTrash <- function() {
  icon("trash")
}

#' Block icon generic
#'
#' Create a block icon depending in the block class
#' @param x Object inheriting from `"block"`.
#' @param ... For generic consistency.
#' @export
#' @rdname block_icon
block_icon <- function(x, ...) UseMethod("block_icon", x)

#' @rdname block_icon
#' @export
block_icon.default <- function(x, ...) {
  span(
    `data-bs-toggle` = "tooltip",
    `data-bs-title` = "Block",
    icon("cube")
  )
}

#' @rdname block_icon
#' @export
block_icon.data_block <- function(x, ...) {
  span(
    `data-bs-toggle` = "tooltip",
    `data-bs-title` = "Data block",
    icon("table")
  )
}

#' @rdname block_icon
#' @export
block_icon.transform_block <- function(x, ...) {
  span(
    `data-bs-toggle` = "tooltip",
    `data-bs-title` = "Transform block",
    icon("shuffle")
  )
}

#' @rdname block_icon
#' @export
block_icon.plot_block <- function(x, ...) {
  span(
    `data-bs-toggle` = "tooltip",
    `data-bs-title` = "Plot block",
    icon("chart-bar")
  )
}
