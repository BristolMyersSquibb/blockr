webr::install("blockr", repos = c("https://bristolmyerssquibb.github.io/webr-repos", "https://repo.r-wasm.org"))

## file: app.R
library(blockr)

stack <- new_stack(
  new_filesbrowser_block,
  new_csv_block,
  new_select_block
)
serve_stack(stack)

## file: penguins.csv
