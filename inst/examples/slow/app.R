library(shiny)
devtools::load_all()

new_slow_head_block <- function(
  data,
  ...
) {
  new_block(
    fields = list(
      n = new_numeric_field(
        5,
        min = 1,
        max = 10,
        title = "seconds to wait: set to 4 to test error handling"
      )
    ),
    expr = quote({
      if (.(n) == 4) {
        list()
      } else {
        Sys.sleep(.(n))
        head(data)
      }
    }),
    ...,
    class = c("slow_head_block", "transform_block")
  )
}

slow_head_block <- function(data, ...) {
  initialize_block(new_slow_head_block(data, ...), data)
}

stack <- new_stack(
  data_block,
  slow_head_block
)

ui <- fluidPage(
  theme = bslib::bs_theme(5L),
  generate_ui(stack)
)

server <- function(input, output, session) {
  generate_server(stack)
}

shinyApp(ui, server)
