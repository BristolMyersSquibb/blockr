library(shiny)
library(blockr.data)
library(blockr)

blocks <- list(
  filter_block,
  select_block,
  arrange_block,
  group_by_block,
  summarize_block,
  cheat_block,
  plot_block
)
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
        choices = c(
          "filter_block" = 1,
          "select_block" = 2,
          "arrange block" = 3,
          "group_by block" = 4,
          "summarize block" = 5,
          "cheat block" = 6,
          "plot block" = 7
        ),
        inline = TRUE
      ),
      actionButton("add", icon("plus"), `data-bs-dismiss` = "offcanvas")
    )
  ),
  server = function(input, output, session) {
    vals <- reactiveValues(new_blocks = NULL)
    generate_server(
      stack,
      id = "mystack",
      new_blocks = reactive(vals$new_blocks)
    )

    observeEvent(input$add, {
      vals$new_blocks <- NULL
      # Always append to stack
      loc <- input$add
      block <- blocks[[as.numeric(input$selected_block)]]
      # add_block expect the current stack, the block to add and its position
      # (NULL is fine for the position, in that case the block will
      # go at the end)
      vals$new_blocks <- list(
        block = block,
        position = loc
      )
      print(vals$new_blocks)
    })
  }
)
