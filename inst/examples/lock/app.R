devtools::load_all()

stack <- new_stack(data_block, select_block)
id <- "mystack"

shiny::shinyApp(
  ui = bslib::page_fluid(
    shiny::actionButton("lock", "Lock stacks"),
    generate_ui(stack, id)
  ),
  server = function(input, output, session) {
    shiny::observeEvent(input$lock, {
      lock()
    })

    vals <- reactiveValues(new_block = NULL)
    stack <- generate_server(
      stack,
      id,
      new_block = reactive(vals$new_block)
    )

    observeEvent(input$add, {
      vals$new_block <- NULL
      # Always append to stack
      loc <- length(stack$blocks)
      block <- available_blocks()[[input$selected_block]]
      # add_block expect the current stack, the block to add and its position
      # (NULL is fine for the position, in that case the block will
      # go at the end)
      vals$new_block <- list(
        block = block,
        position = loc
      )
    })
  }
)
