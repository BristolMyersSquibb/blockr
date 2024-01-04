#' Re-implement numeric_field, using server module
#'
#' @rdname generate_server
#' @export
generate_server.keyvalue_field <- function(x, ...) {
  function(id, init = NULL, data = NULL) {
    moduleServer(id, function(input, output, session) {
      ns <- session$ns

      aceAutocomplete("pl_1_val")
      aceTooltip("pl_1_val")

      r_result <- reactiveVal(value = NULL)
      observeEvent(input$i_submit, {
        r_result(get_exprs("pl_", input, garbage = r_rms_garbage()))
      })

      # remove namedchar UI on trash click
      r_rms_previous <- reactiveVal(integer())
      # store removed elements (since I cannot find a way to 'flush' input after
      # removing a UI element)
      r_rms_garbage <- reactiveVal(character())
      observe({
        rms <- get_rms("pl_", input, garbage = character())
        rms_previous <- isolate(r_rms_previous())
        nms_both <- intersect(names(rms), names(rms_previous))
        to_be_rm <- gsub("_rm$", "", nms_both[rms[nms_both] != rms_previous[nms_both]])
        if (length(to_be_rm) > 0) {
          removeUI(paste0("#", ns(to_be_rm)))
          # make sure it is not read again in the future
          r_rms_garbage(c(isolate(r_rms_garbage()), to_be_rm))
        }
        r_rms_previous(rms)
      })

      observeEvent(input$i_add, {
        pl_ints <-
          names(get_rms("pl_", input, garbage = r_rms_garbage())) |>
          gsub("_rm$", "", x = _) |>
          gsub("^pl_", "", x = _) |>
          as.integer()

        if (length(pl_ints) == 0) {
          # if everything is in garbage
          last_pl_int <- max(as.integer(gsub("^pl_", "", x = r_rms_garbage())))
        } else {
          last_pl_int <- max(pl_ints)
        }

        next_pl <- paste0("pl_", last_pl_int + 1L)
        insertUI(
          paste0("#", ns("pls")),
          ui = exprs_ui(ns(next_pl)),
          where = "beforeEnd",
          session = session
        )

        aceAutocomplete(paste0(next_pl, "_val"))
        aceTooltip(paste0(next_pl, "_val"))
      })

      r_result # return 'namedchar'
    })
  }
}

#' @rdname generate_ui
#' @export
ui_input.keyvalue_field <- function(x, id, name) {
  ns <- NS(input_ids(x, id))
  init <- exprs_ui(ns("pl_1"))
  div(
    div(
      id = ns("pls"),
      init
    ),
    div(
      style = "width: 100%; display: flex; justify-content: flex-end;",
      div(
        style = "margin: 0px;",
        class = "mb-5",
        actionButton(
          ns("i_add"),
          label = NULL,
          icon = icon("plus"),
          class = "btn btn-success",
          style = "margin-right: 7px"
        ),
        actionButton(
          ns("i_submit"),
          label = "Submit",
          icon = icon("paper-plane"),
          class = "btn btn-primary"
        )
      )
    )
  )
}

#' @rdname new_field
#' @export
new_keyvalue_field <- function(
    value = numeric(),
    ...) {
  new_field(value, class = "keyvalue_field")
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

get_exprs <- function(prefix, input, garbage) {
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
exprs_ui <- function(id = "", value_name = "newcol", value_val = NULL) {
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
    ),
    span(class = "input-group-text", icon("equals"), style = "margin: -1px;"),
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
    tags$button(
      id = paste0(id, "_rm"),
      style = "margin: -1px;",
      type = "button",
      class = "btn btn-default action-button",
      icon("trash-can")
    )
  )
}


