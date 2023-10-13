devtools::load_all()
library(blockr.data)
library(shiny)

stack <- new_stack(
  data_block,
  select_block
)

ui <- fluidPage(
  "test",
  theme = bslib::bs_theme(5L),
  generate_ui(stack)
)

server <- function(input, output){
  generate_server(stack)
}

shinyApp(ui, server, options = list(port = 3000L))
