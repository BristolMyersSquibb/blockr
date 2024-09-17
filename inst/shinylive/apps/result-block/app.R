webr::install("blockr", repos = c("https://bristolmyerssquibb.github.io/webr-repos", "https://repo.r-wasm.org"))

library(blockr)
library(blockr.data)

serve_workspace(
  stack1 = new_stack(
    new_dataset_block("lab", "blockr.data"),
    new_select_block(c("STUDYID", "USUBJID"))
  ),
  stack2 = new_stack(new_result_block),
  stack3 = new_stack(new_dataset_block("ae", "blockr.data")),
  title = "My workspace"
)
