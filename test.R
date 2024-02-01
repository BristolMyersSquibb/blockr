devtools::load_all()
library(blockr.data)
library(shiny)

stack <- new_stack(
  data_block,
  code_plot_block
)

ui <- fluidPage(
  theme = bslib::bs_theme(5L),
  useBlockr(),
  uiOutput("stack")
)

server <- function(input, output, session) {
  output$stack <- renderUI({
    generate_ui(stack)
  })
  x <- generate_server(stack)
}

shinyApp(ui, server)
