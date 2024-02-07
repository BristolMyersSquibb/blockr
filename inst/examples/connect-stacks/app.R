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

stacks <- list(
  new_stack(lab_data_block, head_block),
  new_stack(ae_data_block, join_block)
)
names(stacks) <- paste("stack", 1:2, sep = "_")

do.call(set_workspace, args = c(stacks, list(title = "My workspace")))

serve_workspace(clear = FALSE)
