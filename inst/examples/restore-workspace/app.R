library(blockr)

set_workspace(
  stack_1 = new_stack(
    block_11 = new_dataset_block("anscombe"),
    block_12 = new_select_block(c("x1", "y1"))
  ),
  stack_2 = new_stack(
    block_21 = new_dataset_block("anscombe"),
    block_22 = new_select_block(c("x2", "y2"))
  )
)

tmp <- withr::local_tempfile()

save_workspace(tmp)
clear_workspace()

# Dummy demo to show how restore workspace works
restore_workspace(tmp)

serve_workspace(clear = FALSE)
