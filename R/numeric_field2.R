#' Re-implement numeric_field, using server module
#'
#' @rdname numeric_field2
#' @export
generate_server.numeric_field2 <- function(x) {
  function(id, init = NULL, data = NULL) {
    moduleServer(id, function(input, output, session) {
      ns <- session$ns

      output$num_field <- renderUI({
        div(
          paste(colnames(data()), collapse = ", "),
          numericInput(ns("num_field_output"), value = init()$value, label = NULL, min = 1, max = 6)
        )
      })

      r_result <- reactive({
        n <- input[["num_field_output"]]
        coalesce(as.numeric(n), 1)
      })
      r_result
    })
  }
}

#' @rdname numeric_field2
#' @export
ui_input.numeric_field2 <- function(x, id, name) {
  ns <- NS(input_ids(x, id))
  uiOutput(
    ns("num_field")
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




#' @rdname new_block
#' @param n_rows Number of rows to return.
#' @param n_rows_min Minimum number of rows.
#' @export
new_head_block2 <- function(
    data,
    n_rows = numeric(),
    n_rows_min = 1L,
    ...) {
  tmp_expr <- function(n_rows) {
    bquote(
      head(n = .(n_rows)),
      list(n_rows = n_rows)
    )
  }

  fields <- list(
    n_rows = new_numeric_field2(n_rows, n_rows_min, nrow(data)),
    expression = new_hidden_field(tmp_expr)
  )

  new_block(
    fields = fields,
    expr = quote(.(expression)),
    ...,
    class = c("head_block2", "transform_block")
  )
}

#' @rdname new_block
#' @export
head_block2 <- function(data, ...) {
  initialize_block(new_head_block2(data, ...), data)
}

