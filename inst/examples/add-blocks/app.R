library(shiny)
library(blockr.data)
library(blockr)

stack <- new_stack(data_block)
shinyApp(
  ui = bslib::page_fluid(
    add_block_ui(identity),
    generate_ui(stack, id = "mystack")
  ),
  server = function(input, output, session) {
    vals <- reactiveValues(new_blocks = NULL)
    stack <- generate_server(
      stack,
      id = "mystack",
      new_blocks = reactive(vals$new_blocks)
    )

    observeEvent(input$add, {
      vals$new_blocks <- NULL
      # Always append to stack
      loc <- length(stack$blocks)
      block <- blocks[[as.numeric(input$selected_block)]]
      # add_block expect the current stack, the block to add and its position
      # (NULL is fine for the position, in that case the block will
      # go at the end)
      vals$new_blocks <- list(
        block = block,
        position = loc
      )
    })
  }
)
