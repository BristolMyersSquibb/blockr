#' Re-implement numeric_field, using server module
#'
#' @rdname generate_server
#' @export
generate_server.keyvalue_field <- function(x, ...) {
  function(id, init = NULL, data = NULL) {
    moduleServer(id, function(input, output, session) {
      ns <- session$ns

      submit <- isTRUE(x$submit)
      multiple <- isTRUE(x$multiple)
      key <- x$key

      r_n_max <- reactiveVal(0L)
      # dynamically add aceAutocomplete, aceTooltip for each new row
      observe({
        n <- length(r_value())
        if (n > r_n_max()) {
          add <- (r_n_max() + 1):n
          for (i in add) {
            aceAutocomplete(paste0("pl_", i, "_val"))
            aceTooltip(paste0("pl_", i, "_val"))
          }
          r_n_max(n)
        }
      }) |>
        bindEvent(r_value())

      # using reactiveVal(), instead of reactive, reduces the number of updates
      r_value_user <- reactiveVal(NULL)
      observe({
        ans <- get_exprs("pl_", input)
        value <- isolate(r_value())

        # previously used ids are not removed from dom
        if (length(ans) > length(value)) {
          ans <- ans[1:length(value)]
        }
        r_value_user(ans)
      })

      r_value <- reactiveVal(if (is.null(init()$value)) c(newcol = "") else init()$value)

      # by user input
      observe({
        req(r_value_user())
        r_value(r_value_user())
      }) |>
        bindEvent(r_value_user(), ignoreInit = TRUE)

      # by add button
      observe({
        r_value(c(r_value(), newcol = ""))
      }) |>
        bindEvent(input$i_add)

      # by remove button
      r_to_be_removed <- reactive({
        rms <- get_rms("pl_", input, garbage = character())
        to_be_rm <- names(rms[rms > 0])
        if (identical(length(to_be_rm), 0L)) return()
        ans <- as.integer(gsub("_rm$", "", gsub("^pl_", "", to_be_rm)))
        ans
      })
      observe({
        req(r_to_be_removed())
        # keep one expression
        if (length(r_value()) <= 1) return()
        r_value(r_value()[-r_to_be_removed()])
      }) |>
        bindEvent(r_to_be_removed())

      observe({
        if (!identical(r_value(), r_value_user())) {
          message("redraw")
          output$kv <- renderUI({
            # isolate here is needed, despite bindEvent(), for some reason
            keyvalue_ui(value = isolate(r_value()), multiple = TRUE, submit = TRUE, key = "suggest", ns = ns)
          })
        }
      }) |>
        bindEvent(r_value())

      if (submit) {
        r_result <- reactive({
          r_value()
        }) |>
          bindEvent(input$i_submit)
      } else {
        r_result <- reactive({
          r_value()
        }) |>
          bindEvent(input$i_submit)
      }

      r_result
    })
  }
}

#' @rdname generate_ui
#' @export
ui_input.keyvalue_field <- function(x, id, name) {
  ns <- NS(input_ids(x, id))
  uiOutput(
    ns("kv")
  )
}

#' @rdname new_field
#' @param submit Should a 'submit button' be shown?
#' @param key How to display the 'key' field
#' @export
new_keyvalue_field <- function(
    value = numeric(),
    multiple = TRUE,
    submit = TRUE,
    key = c("suggest", "empty", "none"),
    ...) {
  new_field(
    value,
    multiple = multiple,
    submit = submit,
    key = key,
    class = "keyvalue_field"
  )
}

#' @rdname new_field
#' @export
keyvalue_field <- function(...) {
  validate_field(new_keyvalue_field(...))
}

#' @rdname new_field
#' @export
validate_field.keyvalue_field <- function(x) {
  x
}


get_input_names <- function(prefix, input, garbage, regex) {
  input_names <- grep(paste0("^", prefix), names(input), value = TRUE)
  input_names <- grep(regex, input_names, value = TRUE)

  # see comment r_rms_garbage
  is_garbage <- gsub(regex, "", input_names) %in% garbage
  input_names[!is_garbage]
}

get_rms <- function(prefix, input, garbage) {
  input_names <- get_input_names(prefix, input, garbage, "_rm$")
  vapply(setNames(input_names, input_names), \(x) input[[x]], 0L)
}

get_exprs <- function(prefix, input, garbage = character()) {
  input_names <- get_input_names(prefix, input, garbage, "_name$|_val$")
  ans <- lapply(setNames(input_names, input_names), \(x) input[[x]])
  vals <- unlist(ans[grepl("_val$", names(ans))])
  names <- unlist(ans[grepl("_name$", names(ans))])
  setNames(vals, names) # a named character vector
}


#' Create a UI element for expressions
#'
#' This function generates a UI element for inputting expressions in a Shiny application.
#' It includes two `shinyAce::aceEditor` elements for inputting the name and value of a new column.
#'
#' @param id Character string, an identifier for the UI element.
#' @param value_name Default name for the new column.
#' @param value_val Default value for the new column.
#' @param delete_button Should a delete button be shown?
#' @param key How to display the 'key' field
#' @return A `div` element containing the UI components.
#' @importFrom shinyAce aceEditor aceAutocomplete aceTooltip
#' @export
#' @examples
#' \dontrun{
#' library(shiny)
#' library(shinyAce)
#' shinyApp(
#'   ui = bslib::page_fluid(
#'     exprs_ui(value_name = "bla", value_val = "blabla")
#'   ),
#'   server = function(input, output) {}
#' )
#' }
exprs_ui <- function(id = "",
                     value_name = "newcol",
                     value_val = NULL,
                     delete_button = TRUE,
                     key = c("suggest", "empty", "none")) {


  key <- match.arg(key)

  div(
    id = id,
    class = "input-group d-flex justify-content-between mt-1 mb-3",
    style = "border: 1px solid rgb(206, 212, 218); border-radius: 6px; margin-right: 20px;",
    tags$style(HTML("
      .shiny-ace {
        border: none;
        margin: 10px;
      }
    ")),
    if (key != "none") {
      span(
        style = "width: 20%",
        shinyAce::aceEditor(
          outputId = paste0(id, "_name"),
          # default value of 1000 may result in no update when clicking 'submit'
          # too fast.
          debounce = 300,
          value = value_name,
          mode = "r",
          autoComplete = "disabled",
          height = "20px",
          showPrintMargin = FALSE,
          highlightActiveLine = FALSE,
          tabSize = 2,
          theme = "tomorrow",
          maxLines = 1,
          fontSize = 14,
          showLineNumbers = FALSE
        )
      )
    },
    if (key != "none") {
      span(class = "input-group-text", icon("equals"), style = "margin: -1px;")
    },
    span(
      # class = ""
      style = "width: 70%",
      shinyAce::aceEditor(
        outputId = paste0(id, "_val"),
        debounce = 300,
        value = value_val,
        mode = "r",
        autoComplete = "live",
        autoCompleters = c("rlang", "static"),
        autoCompleteList = list(columns = c("demand", "Time")),
        height = "20px",
        showPrintMargin = FALSE,
        highlightActiveLine = FALSE,
        tabSize = 2,
        theme = "tomorrow",
        maxLines = 1,
        fontSize = 14,
        showLineNumbers = FALSE
        # placeholder = "type expression, e.g., `col1 + col2`"
      )
    ),
    if (delete_button) {
      tags$button(
        id = paste0(id, "_rm"),
        style = "margin: -1px;",
        type = "button",
        class = "btn btn-default action-button",
        icon("trash-can")
      )
    }
  )
}


# shinyApp(
#   ui = bslib::page_fluid(
#     keyvalue_ui(value = c(a = "ls()", b = "ls()"), multiple = TRUE, submit = TRUE, key = "suggest")
#   ),
#   server = function(input, output) {}
# )
keyvalue_ui <- function(value, multiple, submit, key, ns = function(x) x) {

  names <- names(value)
  values <- unname(value)
  ids <- ns(paste0("pl_", seq(value)))

  core_ui <- tagList(Map(
    function(name, value, id) {
      exprs_ui(id, value_name = name, value_val = value, delete_button = multiple, key = key)
    },
    name = names,
    value = values,
    id = ids
  ))

  div(
    div(
      id = ns("pls"),
      core_ui
    ),
    div(
      style = "width: 100%; display: flex; justify-content: flex-end;",
      div(
        style = "margin: 0px;",
        class = "mb-5",
        if (multiple) {
          actionButton(
            ns("i_add"),
            label = NULL,
            icon = icon("plus"),
            class = "btn btn-success",
            style = "margin-right: 7px"
          )
        },
        if (submit) {
          actionButton(
            ns("i_submit"),
            label = "Submit",
            icon = icon("paper-plane"),
            class = "btn btn-primary"
          )
        }
      )
    )
  )
}


