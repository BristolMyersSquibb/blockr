#' Default layout for fields
#' Default layout for fields, places fields on rows
#' and collapses parts of inputs when there are too many.
#' @param x Object (block).
#' @param fields Named list of fields.
#' @param ... Currently ignored.
#' @export
layout <- function(x, fields, ...) UseMethod("layout", x)

#' @export
layout.block <- function(x, fields, ...) {
  # we remove hidden fields
  fields <- fields[lgl_ply(fields, Negate(inherits), "hidden_field")]

  if (length(fields) <= 6L) {
    return(layout_fields(fields))
  }

  id <- rand_names()

  fields_shown <- fields[1:6L]
  fields_hidden <- fields[7L:length(fields)]

  list(
    fields_shown |> layout_fields(),
    tags$a(
      `data-bs-toggle` = "collapse",
      href = sprintf("#%s", id),
      "show more inputs"
    ),
    div(
      id = id,
      class = "collapse",
      fields_hidden |> layout_fields()
    )
  )
}

#' Check if number is whole
#' @param n Number to check.
is_whole <- \(n = 0L) {
  stopifnot(is.numeric(n))
  ((n * 10L) %% 10L) == 0L
}

#' Layout fields on rows.
#' @keywords internal
layout_fields <- function(fields) {
  # split into groups of 6 => max inputs per row
  split(fields, ceiling(seq_along(fields) / 6)) |>
    lapply(\(fields) {
      # we divide by 3
      width <- 12 / length(fields)

      # it's simple if the number is whole
      if (is_whole(width)) {
        class <- sprintf("col-%d", width)

        layout <- div(
          class = "row",
          fields |>
            lapply(\(field) div(class = class, field)) |>
            unname()
        )

        return(layout)
      }

      width <- ceiling(width)
      indices <- seq_along(fields)

      div(
        class = "row",
        indices |>
          lapply(\(index) {
            w <- width

            if (index == length(fields)) {
              w <- width + 1
            }

            div(
              class = sprintf("col-%s", w),
              fields[[index]]
            )
          }) |>
          unname()
      )
    })
}
