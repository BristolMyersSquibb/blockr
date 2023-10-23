devtools::load_all()
library(blockr.data)
library(shiny)

stack <- new_stack(
  data_block,
  plot_block
)

ui <- fluidPage(
  "test",
  theme = bslib::bs_theme(5L),
  generate_ui(stack)
)

server <- function(input, output){
  x <- generate_server(stack)

  observe({
    print(x$remove)
  })
}

shinyApp(ui, server, options = list(port = 3000L))
