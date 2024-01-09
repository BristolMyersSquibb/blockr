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
  uiOutput("lock")
)

server <- function(input, output, session) {
  x <- generate_server(stack)

  observe({
    print(x$remove)
  })

  locked <- reactiveVal(FALSE)
  output$lock <- renderUI({
    if (locked()) return()
    actionButton("lock", "Lock")
  })

  observeEvent(input$lock, {
    lock()
    print("lock")
    locked(TRUE)
  })
}

shinyApp(ui, server)
