devtools::load_all()
library(blockr.data)
library(shiny)

options(BLOCKR_DEV = T)

new_test_block <- function(data, ...) {
  fields <- letters |>
    lapply(\(x) new_string_field(x))

  names(fields) <- letters

  new_block(
    fields = fields,
    expr = quote({
      data
    }),
    ...,
    class = c("test_block", "transform_block")
  )
}

test_block <- function(data, ...) {
  initialize_block(new_test_block(data, ...), data)
}

stack <- new_stack(
  data_block,
  select_block
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
