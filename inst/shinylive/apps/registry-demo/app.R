webr::install("blockr", repos = c("https://bristolmyerssquibb.github.io/webr-repos", "https://repo.r-wasm.org"))

library(blockr)

new_tail_block <- function(data, n_rows = numeric(), ...) {

  n_rows_max <- function(data) nrow(data)

  new_block(
    fields = list(
      n_rows = new_numeric_field(n_rows, 1L, n_rows_max)
    ),
    expr = quote(tail(n = .(n_rows))),
    class = c("tail_block", "transform_block"),
    ...
  )
}

register_block(
  constructor = new_tail_block,
  name = "tail block",
  description = "return last n rows",
  classes = c("tail_block", "transform_block"),
  input = "data.frame",
  output = "data.frame"
)

stack <- new_stack(new_dataset_block)
serve_stack(stack)
