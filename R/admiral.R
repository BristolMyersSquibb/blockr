# library(admiral)
# BOD |>
#   mutate(PARAMCD = as.character(1:n())) |>
#   derive_param_computed(
#     by_vars = exprs(Time),
#     parameters = c("4", "5"),
#     set_values_to = exprs(
#       demand = demand * 2,
#       PARAMCD = "17"
#     )
#   )
#
# pkgload::load_all(".");
# stack <- new_stack(data_block, mutate_block, admiral_dpc_block);
# serve_stack(stack)

#' @importFrom admiral derive_param_computed
#' @importFrom rlang exprs
new_admiral_dpc_block <- function(data,
                                  by_vars = NULL,
                                  parameters = NULL,
                                  set_values_to = NULL,
                                  ...) {

  # 0. helper functions
  handle_error <- function(e) {
    warning(e)
    expression()
  }

  parse_one <- function(x) {
    tryCatch(
      parse(text = x),
      error = handle_error
    )
  }

  parse_multiple <- function(x) {
    ans <- try({
      res <- lapply(x, parse_one)
      if (length(res)) {
        res <- do.call(c, res)
      }
    })
    if (inherits(ans, "try-error")) {
      return(expression())
    }
    res
  }

  # 1. main expression
  main_expr <- function(by_vars = NULL, parameters, set_values_to = NULL) {

    by_vars_expr <- parse_multiple(by_vars)
    set_values_to_expr <- parse_multiple(set_values_to)
    parameters_expr <- parse_multiple(parameters)

    ans <- bquote(
      admiral::derive_param_computed(
        by_vars = rlang::exprs(..(by_vars_expr)),
        parameters = c(.(parameters)),
        set_values_to = rlang::exprs(..(set_values_to_expr))
      ),
      list(
        by_vars_expr = by_vars_expr,
        parameters = parameters,
        set_values_to_expr = set_values_to_expr
      ),
      splice = TRUE
    )
    ans
  }

  # 2. functions for derived inputs

  # inputs can be functions that use 'data' or other fields
  # (this currently doesn't work for 'keyvalue_field')
  paramcd_values <- function(data) {
    unique(data$PARAMCD)
  }

  data_cols <- function(data) {
    colnames(data)
  }

  # 3. fields
  fields <- list(
    by_vars = new_select_field(
      value = by_vars,
      choices = data_cols,
      multiple = TRUE,
      title = "Grouping variables",
      descr = "For each group defined by by_vars an observation is added to the
               output dataset. Only variables specified in by_vars will be
               populated in the newly created records."
    ),
    parameters = new_select_field(
      value = parameters,
      choices = paramcd_values,
      multiple = TRUE,
      title = "Parameter codes",
      descr = "It is expected that all parameter codes (PARAMCD) which are
               required to derive the new parameter are specified for this
               parameter or the constant_parameters parameter."
    ),
    set_values_to = new_keyvalue_field(
      value = set_values_to,
      submit = FALSE,
      title = "Variables to be set",
      descr = "The specified variables are set to the specified values for the
              new observations."
    ),
    expression = new_hidden_field(main_expr)
  )

  # 4. block creation
  new_block(
    fields = fields,
    expr = quote(.(expression)),
    ...,
    class = c("admiral_dpc_block", "transform_block")
  )
}

#' @rdname new_block
#' @export
admiral_dpc_block <- function(data, ...) {
  initialize_block(new_admiral_dpc_block(data, ...), data)
}



# A simple, one column layout
#
# we need the fields, not the rendered fields, that's why I can't use the layout
# methods
ui_fields.admiral_dpc_block <- function(x, ns, inputs_hidden, ...) {

  html_card <- function(field, field_name) {
    div(
      div(
        tags$h5(attr(field, "title")),
        div(
          class = c("text-muted small mb-2"),
          attr(field, "descr")
        )
      ),
      tags$div(
        class = "w-100",
        ui_input(field, id = ns(field_name), name = NULL)
      )
    )
  }

  cards <- Map(
    html_card,
    field = x,
    field_name = names(x)
  )

  div(
    class = sprintf("block-inputs %s", inputs_hidden),
    div(cards, class = "mt-3")
  )

}
