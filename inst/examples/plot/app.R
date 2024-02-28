library(blockr)

corrplot_block <- function(data, ...) {
  fields <- list(
    method = new_select_field(
      "circle",
      choices = c("circle", "square", "ellipse", "number", "shade", "color", "pie")
    ),
    type = new_select_field("full", choices = c("full", "lower", "upper")),
    order = new_select_field(
      "original",
      choices = c("original", "AOE", "FPC", "hclust", "alphabet")
    ),
    title = new_string_field()
  )
  new_block(
    fields = fields,
    expr = quote({
      corr_matrix <- data |>
        dplyr::select_if(is.numeric) |>
        purrr::discard(~ all(is.na(.))) |>  # removed those column which have all NA Values
        na.omit() |>  # removed the rows containing na values
        stats::cor()

      corrplot::corrplot(
        corr_matrix, method = .(method), type = .(type),
        order = .(order), addrect = 2, tl.col = "black", tl.srt = 45,
        diag = FALSE,
        title = .(title)
      )
    }),
    ...,
    class = c("corrplot_block", "plot_block")
  )
}

stack <- new_stack(
  data_block,
  corrplot_block
)

library(shiny)

ui <- fluidPage(
  theme = bslib::bs_theme(version = 5),
  generate_ui(stack)
)

server <- function(input, output, session) {
  generate_server(stack)
}

shinyApp(ui, server)
