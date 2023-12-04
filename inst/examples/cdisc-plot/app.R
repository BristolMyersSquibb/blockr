# Basic example
pkgload::load_all()
library(blockr.data)

# Note: sometimes memories issue due to the join block
# can be solved by restarting R between each run.

stack <- new_stack(
  demo_data_block,
  demo_join_block,
  demo_filter_block_1,
  demo_filter_block_2,
  demo_arrange_block,
  asfactor_block,
  demo_group_by_block,
  demo_summarize_block,
  ggiraph_block
)
serve_stack(stack)
