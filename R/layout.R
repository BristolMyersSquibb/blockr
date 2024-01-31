is_whole <- \(n) {
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

#' Default layout for fields
#' Default layout for fields, places fields on rows
#' and collapses parts of inputs when there are too many.
#' @param fields List of fields.
#' @param ... Currently ignored.
#' @keywords internal
default_layout_fields <- function(fields, ...) {
  # we remove hidden fields
  fields <- fields[lengths(fields) > 0L]

  if (length(fields) < 6L) {
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

plot_layout_fields <- function(fields, ...) {
  tagList(
    div(
      class = "row",
      div(
        class = "col-md-3",
        fields$x_var
      ),
      div(
        class = "col-md-3",
        fields$y_var
      ),
      div(
        class = "col-md-3",
        fields$color
      ),
      div(
        class = "col-md-3",
        fields$shape
      )
    ),
    div(
      class = "row",
      div(
        class = "col-md-4",
        fields$x_lab
      ),
      div(
        class = "col-md-4",
        fields$y_lab
      ),
      div(
        class = "col-md-4",
        fields$point_size
      )
    ),
    div(
      class = "row",
      div(
        class = "col-md-4",
        fields$title
      ),
      div(
        class = "col-md-4",
        br(),
        fields$errors_toggle
      ),
      div(
        class = "col-md-4",
        br(),
        fields$lines_toggle
      )
    )
  )
}

ggiraph_layout_fields <- plot_layout_fields

filter_layout_fields <- function(fields, ...) {
  tagList(
    div(
      class = "row",
      div(
        class = "col-md-4",
        fields$columns
      ),
      div(
        class = "col-md-2",
        fields$filter_func
      ),
      div(
        class = "col-md-4",
        fields$values
      ),
      div(
        class = "col-md-2",
        fields$submit
      )
    ),
    fields$expression
  )
}

summarize_layout_fields <- function(fields, ...) {
  tagList(
    div(
      class = "row",
      div(
        class = "col-md-5",
        fields$funcs
      ),
      div(
        class = "col-md-5",
        fields$columns
      ),
      div(
        class = "col-md-2",
        fields$submit
      )
    ),
    fields$expression
  )
}

join_layout_fields <- function(fields, ...) {
  tagList(
    div(
      class = "row",
      div(
        class = "col-md-3",
        fields$join_func
      ),
      div(
        class = "col-md-4",
        fields$y
      ),
      div(
        class = "col-md-3",
        fields$by
      ),
      div(
        class = "col-md-2",
        fields$submit
      )
    ),
    fields$expression
  )
}
