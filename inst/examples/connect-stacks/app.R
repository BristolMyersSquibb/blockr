library(blockr)
library(blockr.data)

lab_data_block <- function(...) {
  initialize_block(new_data_block(
    ...,
    dat = as.environment("package:blockr.data"),
    selected = "lab"
  ))
}

ae_data_block <- function(...) {
  initialize_block(new_data_block(
    ...,
    dat = as.environment("package:blockr.data"),
    selected = "ae"
  ))
}

serve_workspace(
  stack1 = new_stack(lab_data_block, head_block),
  stack2 = new_stack(ae_data_block, join_block),
  title = "My workspace"
)
