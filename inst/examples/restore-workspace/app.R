library(blockr)

set_workspace(
  stack_1 = new_stack(
    # Won't autoclick on submit
    block_11 = new_dataset_block("anscombe"),
    block_12 = new_filter_block("x1", 10, ">")
  ),
  # Submit autoclick
  stack_2 = new_stack(
    block_21 = new_dataset_block("anscombe"),
    block_22 = new_filter_block("x1", 10, ">", submit = TRUE)
  )
)

tmp <- withr::local_tempfile()

save_workspace(tmp)
clear_workspace()

# Dummy demo to show how restore workspace works
restore_workspace(tmp)

serve_workspace(clear = FALSE)
