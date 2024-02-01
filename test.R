devtools::load_all()
library(blockr.data)
library(shiny)

stack <- new_stack()

ui <- fluidPage(
  theme = bslib::bs_theme(5L),
  actionButton("add", "Add"),
  generate_ui(stack)
)

server <- function(input, output, session) {
  index <- 0L
  new_block <- eventReactive(input$add, {
    index <<- index + 1L
    list(
      position = index - 1L,
      block = available_blocks()[[index]]
    )
  })

  x <- generate_server(stack, new_block = new_block)
}

shinyApp(ui, server)
