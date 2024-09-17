webr::install("blockr", repos = c("https://bristolmyerssquibb.github.io/webr-repos", "https://repo.r-wasm.org"))

library(blockr)

stack <- new_stack(
  new_upload_block,
  new_csv_block,
  new_select_block
)
serve_stack(stack)
