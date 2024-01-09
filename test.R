devtools::load_all()
library(blockr.data)
library(shiny)

stack <- new_stack(
  data_block,
  select_block,
<<<<<<< HEAD
  head_block,
  html_block
=======
  filter_block,
  title = "test"
>>>>>>> main
)

ui <- fluidPage(
  "test",
  theme = bslib::bs_theme(5L),
  generate_ui(stack)
)

server <- function(input, output) {
  x <- generate_server(stack)

  observe({
    print(x$remove)
  })
}

shinyApp(ui, server)
