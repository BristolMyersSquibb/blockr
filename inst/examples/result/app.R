library(blockr)

serve_workspace(
  stack1 = new_stack(new_dataset_block("iris")),
  stack2 = new_stack(new_dataset_block("mtcars")),
  stack3 = new_stack(new_result_block("stack1")),
  force = TRUE
)
