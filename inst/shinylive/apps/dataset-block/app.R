webr::install("blockr", repos = c("https://bristolmyerssquibb.github.io/webr-repos", "https://repo.r-wasm.org"))

library(blockr)
custom_data_block <- function(...) {
  new_dataset_block(
    selected = "lab",
    package = "blockr.data",
    ...
  )
}

stack <- new_stack(
  custom_data_block,
  new_select_block
)
serve_stack(stack)
