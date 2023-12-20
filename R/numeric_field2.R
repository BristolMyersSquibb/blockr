#' Re-implement numeric_field, using server module
#'
#' @rdname numeric_field2
#' @export
generate_server.numeric_field2 <- function(x) {
  function(id, init = NULL, data = NULL) {
    moduleServer(id, function(input, output, session) {
      r_result <- reactive({
        message("init")
        print(init())
        input[["num_field"]]
      })
      r_result
    })
  }
}

#' @rdname numeric_field2
#' @export
ui_input.numeric_field2 <- function(x, id, name) {
  ns <- NS(input_ids(x, id))
  numericInput(
    ns("num_field"), name, value(x), value(x, "min"), value(x, "max")
  )
}

#' @rdname numeric_field2
#' @export
new_numeric_field2 <- function(
    value = numeric(),
    min = numeric(),
    max = numeric(),
    ...) {
  new_field(value, min = min, max = max, ..., class = "numeric_field2")
}

#' @rdname numeric_field2
#' @export
numeric_field2 <- function(...) {
  validate_field(new_numeric_field2(...))
}

#' @rdname numeric_field2
#' @export
validate_field.numeric_field2 <- function(x) {
  x
}


