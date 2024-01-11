library(shiny)
library(blockr.data)
library(blockr)

stack <- new_stack(data_block)
shinyApp(
  ui = bslib::page_fluid(
    div(
      class = "d-flex justify-content-center",
      tags$button(
        type = "button",
        "Add a new block",
        class = "btn btn-primary",
        class = "my-2",
        `data-bs-toggle` = "offcanvas",
        `data-bs-target` = "#addBlockCanvas",
        `aria-controls` = "addBlockCanvas"
      )
    ),
    generate_ui(stack, id = "mystack"),
    off_canvas(
      id = "addBlockCanvas",
      title = "My blocks",
      position = "bottom",
      radioButtons(
        "selected_block",
        "Choose a block",
        choices = names(available_blocks()),
        inline = TRUE
      ),
      actionButton("add", icon("plus"), `data-bs-dismiss` = "offcanvas")
    )
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
      block <- available_blocks()[[input$selected_block]]
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
