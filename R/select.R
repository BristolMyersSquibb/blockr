# experimental module field

select_module_server <- function(id) {
  moduleServer(id, function(input, output, session) {
    ns <- session$ns
    r_result <- reactiveVal(value = NULL)

    observe({
      r_result(input$i_select)
    })

    r_result
  })
}

select_module_ui <- function(id, init = NULL) {
  ns <- NS(id)
  if (is.null(init)) {
    init <- list()
    init$label <- NULL
    init$choices <- NULL
    init$selected <- NULL
  }
  selectInput(ns("i_select"), label = init$label, choices = init$choices, selected = init$selected)
}








# select_field <- function(id, init) {
#   ui = select_module_ui,
#   server = select_module_server
# }


# container(
#   select_field
# )





# # ?selectInput
# ui <- bslib::page_fluid(
#   select_field$ui("m1", init = list(choices = c("A", "B"), selected = "A")),
#   verbatimTextOutput("o_result")
# )
# server <- function(input, output) {
#   r_result <- select_field$server("m1")
#   output$o_result <- renderPrint({
#     r_result()
#   })
# }
# # Run the application
# shinyApp(ui = ui, server = server)





# field container
# container(..., add = )   # could this return a new field?




# # ?selectInput
# ui <- bslib::page_fluid(
#   select_module_ui("m1", init = list(choices = c("A", "B"), selected = "A")),
#   verbatimTextOutput("o_result")
# )
# server <- function(input, output) {
#   r_result <- select_module_server("m1")
#   output$o_result <- renderPrint({
#     r_result()
#   })
# }
# # Run the application
# shinyApp(ui = ui, server = server)


# module_ui()
# module_server()  -> generic
