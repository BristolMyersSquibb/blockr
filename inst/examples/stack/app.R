library(blockr)

stack <- new_stack()
id <- "mystack"

shiny::shinyApp(
  ui = bslib::page_fluid(
    generate_ui(stack, id)
  ),
  server = function(input, output, session) {
    stack <- generate_server(stack, id)
  }
)
