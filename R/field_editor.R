#' @rdname new_field
#' @export
new_editor_field <- function(value = character(), ...) {
  new_field(value, ..., class = c("editor_field", "string_field"))
}

# #' @rdname generate_ui
# #' @export
# ui_input.string_field <- function(x, id, name) {
#   textInput(input_ids(x, id), name, value(x))
# }



expr_whitelisted <- function() {
  c("paste", "pmax", "pmin")
}


#' @rdname generate_ui
#' @export
ui_input.editor_field <- function(x, id, name) {
  print("create ui")
  shinyAce::aceEditor(
    outputId = input_ids(x, id),
    value = value(x, "value"),
    mode = "r",
    autoComplete = "live",
    autoCompleters = c("static"),
    autoCompleteList = list(R = expr_whitelisted()),
    height = "100px",
    theme = "tomorrow"
  )
}


#' @rdname generate_ui
#' @export
ui_update.editor_field <- function(x, session, id, name) {
  print("update")
  shinyAce::updateAceEditor(
    session, editorId = input_ids(x, id), value = value(x, "value")
  )
}


#   selectizeInput(
#     input_ids(x, id), name, value(x, "choices"), value(x), value(x, "multiple"),
#     options = list(
#       dropdownParent = "body",
#       placeholder = "Please select an option below"
#     )
#   )
# }
