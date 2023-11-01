#' @param data Tabular data in which to select some columns.
#' @param columns Column(s) to select.
#' @rdname new_block
#' @export
new_mutate_block <- function(data, value = "tt = Time * 2", ...) {
  # all_cols <- function(data) colnames(data)

  mutate_expr <- function(data, value) {
    # Build expression that will go inside mutate()
    exprs <- try(parse(text = value))
    if (inherits(exprs, "try-error")) {
      exprs <- expression()
    }

    ans <- bquote(
      dplyr::mutate(..(exprs)),
      list(exprs = exprs),
      splice = TRUE
    )
    print(ans)
    # FIXME
    # I get dplyr::mutate((tt = Time * 2)) here but would like to get
    # dplyr::mutate(tt = Time * 2)
    ans
  }

  # Select_field only allow one value, not multi select
  fields <- list(
    value = new_string_field(value = value),
    # value = new_editor_field(value = value),
    expression = new_hidden_field(mutate_expr)
  )

  new_block(
    fields = fields,
    expr = quote(.(expression)),
    ...,
    class = c("mutate_block", "transform_block")
  )
}




#' @rdname new_block
#' @export
mutate_block <- function(data, ...) {
  initialize_block(new_mutate_block(data, ...), data)
}
