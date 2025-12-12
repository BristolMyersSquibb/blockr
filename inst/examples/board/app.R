library(blockr)

run_app(
  blocks = c(
    data = new_dataset_block("mtcars", package = "datasets"),
    filter = new_filter_block(
      conditions = list(
        list(column = "cyl", values = c(4, 6), mode = "include")
      )
    ),
    select = new_select_block(
      columns = c("mpg", "hp", "wt", "cyl")
    ),
    export = new_write_block(),
    plot = new_ggplot_block(
      type = "point",
      x = "wt",
      y = "mpg",
      color = "cyl"
    )
  ),
  links = list(
    from = c("data", "filter", "select", "select"),
    to = c("filter", "select", "export", "plot"),
    input = c("data", "data", "...", "data")
  ),
  id = "board"
)
