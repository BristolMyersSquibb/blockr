library(blockr)
library(blockr.data)

blocks <- available_blocks()

stacks <- lapply(1:3, \(x) new_stack(data_block))
names(stacks) <- paste("stack", 1:3, sep = "-")

do.call(set_workspace, args = c(stacks, list(title = "My workspace")))
ws <- get_workspace()

shinyApp(
  ui = bslib::page_fluid(
    generate_ui(ws, id = "myworkspace")
  ),
  server = function(input, output, session) {
    generate_server(ws, id = "myworkspace")
  }
)
