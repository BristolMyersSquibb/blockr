default_layout_fields <- function(fields, ...) {
  unname(fields)
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
