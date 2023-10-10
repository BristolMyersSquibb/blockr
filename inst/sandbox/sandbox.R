# Basic example
pkgload::load_all()
library(blockr.data)
stack <- new_stack(
  data_block,
  filter_block,
  #summarize_block#,
  #arrange_block,
  plot_block
)
serve_stack(stack)

# WIP for John

shinyApp(
  ui = tagList(
    generate_ui(stack, id = "mystack"),
    actionButton("add", "Add", class = "my-2")
  ),
  server = function(input, output, session) {
    vals <- reactiveValues(new_blocks = NULL)
    generate_server(stack, id = "mystack", new_blocks = vals$new_blocks)

    observeEvent(input$add, {
      # For John: this will have to be replaced by your masonry logic
      loc <- sample(seq_along(react_stack()), 1)
      block <- select_block
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