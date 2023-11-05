#' @rdname new_field
#' @export
new_pairlists_field <- function(value = character(), ...) {
  new_field(value, ..., class = c("pairlists_field"))
}

#' @rdname generate_ui
#' @export
ui_input.pairlists_field <- function(x, id, name) {
  ace_module_ui(input_ids(x, id), exprs_init = NULL)
  # uiOutput(id)
}

#' @rdname generate_ui
#' @export
ui_update.pairlists_field <- function(x, session, id, name) {
  # renderUI(input_ids(x, id), ace_module_ui("mmmm1", exprs_init = value(x, "value")))
}

validate_field.pairlists_field <- function(x) {
  val <- value(x)

  # if (!is.character(val) || length(val) != 1L) {
  #   value(x) <- ""
  # }

  x
}
