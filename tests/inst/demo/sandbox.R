pkgload::load_all()
library(blockr.data)
stack <- new_stack(
  data_block,
  filter_block#,
  #summarize_block#,
  #arrange_block,
  #plot_block
)
serve_stack(stack)