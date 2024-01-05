filter_expr <- function(value = c(a = "2.1", b = "4.5")) {
  if (is.null(value)) {
    return(quote(dplyr::filter()))
  }
  stopifnot(inherits(value, "character"))

  parse_one <- function(text) {
    expr <- try(parse(text = text))
    if (inherits(expr, "try-error")) {
      expr <- expression()
    }
    expr
  }

  print(constructive::construct(value))

  exprs <- do.call(c, lapply(value, parse_one))

  bquote(
    dplyr::filter(..(exprs)),
    list(exprs = exprs),
    splice = TRUE
  )
}

new_filter2_block <- function(data, value = NULL, ...) {
  fields <- list(
    # value = new_keyvalue_field(value = value),
    value = new_keyvalue_field(value = value, submit = TRUE, multiple = TRUE, key = "none"),
    expression = new_hidden_field(filter_expr)
  )

  new_block(
    fields = fields,
    expr = quote(.(expression)),
    ...,
    class = c("filter2_block", "transform_block")
  )
}

#' @rdname new_block
#' @export
filter2_block <- function(data, ...) {
  initialize_block(new_filter2_block(data, ...), data)
}
