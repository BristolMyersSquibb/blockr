devtools::load_all()
library(blockr.data)
library(shiny)

stack <- new_stack(data_block)

ui <- fluidPage(
  theme = bslib::bs_theme(5L),
  actionButton("add", "Add"),
  generate_ui(stack)
)

server <- function(input, output, session) {
  nb <- eventReactive(input$add, {
    list(
      position = NULL,
      block = available_blocks()[[1]]
    )
  })

  x <- generate_server(stack, new_block = nb)
}

shinyApp(ui, server)
