mutate_expr <- function(value = c(a = "2.1", b = "4.5")) {
  if (is.null(value)) {
    return(quote(dplyr::mutate()))
  }
  stopifnot(inherits(value, "character"))

  parse_one <- function(text) {
    expr <- try(parse(text = text))
    if (inherits(expr, "try-error")) {
      expr <- expression()
    }
    expr
  }

  exprs <- do.call(c, lapply(value, parse_one))

  bquote(
    dplyr::mutate(..(exprs)),
    list(exprs = exprs),
    splice = TRUE
  )
}

#' Mutate block constructor
#'
#' Leverages the \link{keyvalue_field}
#'
#' @param value Default value.
#' @inheritParams select_block
#' @export
#' @rdname mutate_block
new_mutate_block <- function(data, value = NULL, ...) {
  fields <- list(
    value = new_keyvalue_field(value = value),
    expression = new_hidden_field(mutate_expr)
  )

  new_block(
    fields = fields,
    expr = quote(.(expression)),
    ...,
    class = c("mutate_block", "transform_block")
  )
}

#' @rdname mutate_block
#' @export
mutate_block <- function(data, ...) {
  initialize_block(new_mutate_block(data, ...), data)
}
