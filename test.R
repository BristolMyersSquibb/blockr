library(shiny)
devtools::load_all()

test_block <- function(...){
  first <- \() letters[1]
  all <- \() letters

  fields <- list(
    text = new_string_field("default"),
    select = new_select_field(first, all),
    bool = new_switch_field(TRUE),
    numeric = new_numeric_field(1L, min = 0, max = 10L),
    submit = new_submit_field(),
    browser = new_filesbrowser_field(),
    range = new_range_field(1, 0, 10)
  )

  new_block(
    fields = fields,
    expr = quote(iris),
    ...,
    class = c("data_block", "my_block")
  )
}

stack <-  new_stack(
  test_block
)

ui <- fluidPage(
  theme = bslib::bs_theme(5L),
  generate_ui(stack)
)

server <- function(input, output, session) {
  generate_server(stack)
}

shinyApp(ui, server)
