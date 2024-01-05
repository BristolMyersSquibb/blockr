devtools::load_all()
library(blockr.data)
library(shiny)

stack <- new_stack(
  data_block,
  select_block,
  filter_block,
  title = "test"
)

ui <- fluidPage(
  "test",
  theme = bslib::bs_theme(5L),
  generate_ui(stack),
  actionButton("lock", "Toggle Lock")
)

server <- function(input, output, session) {
  x <- generate_server(stack)

  observe({
    print(x$remove)
  })

  observeEvent(input$lock, {
    toggle_lock()
  })

  observe_lock(function(x) {
    print(x)
  })
}

shinyApp(ui, server)
