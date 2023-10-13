library(shiny)
library(blockr.data)
devtools::load_all()

options(shiny.fullstacktrace = TRUE)

stack1 <- new_stack(
  data_block,
  filter_block,
  select_block
)

block_ui <- function(id) {
  ns <- shiny::NS(id)
  uiOutput(ns("block"))
}

block_server <- function(id) {
  moduleServer(
    id,
    function(input, output, session){
      ns <- session$ns

      output$block <- renderUI({
        generate_ui(stack1, id = ns("b"))
      })

      generate_server(stack1, id = ns("b"))
    }
  )
}

ui <- function(req) {
  fluidPage(
    theme = bslib::bs_theme(5L),
    div(
      class = "row",
      block_ui("x")
    )
  )
}
server <- function(input, output, session) {
  block_server("x")
}

shinyApp(ui, server, options = list(port = 3002L))

