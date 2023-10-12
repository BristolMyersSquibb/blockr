# Basic example
pkgload::load_all()
library(blockr.data)
stack <- new_stack(
  data_block,
  cheat_block,
  #summarize_block#,
  #arrange_block,
  plot_block
)
serve_stack(stack)

# WIP for John
stack <- new_stack(data_block) |>
  add_block(select_block) |>
  add_block(filter_block, 1)

shinyApp(
  ui = tagList(
    bslib::page_fluid(generate_ui(stack, id = "mystack")),
    actionButton("add", "Add", class = "my-2")
  ),
  server = function(input, output, session) {
    vals <- reactiveValues(new_blocks = NULL)
    generate_server(stack, id = "mystack", new_blocks = reactive(vals$new_blocks))

    observeEvent(input$add, {
      # For John: this will have to be replaced by your masonry logic
      loc <- sample(seq_along(stack), 1)
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