webr::install("blockr", repos = c("https://bristolmyerssquibb.github.io/webr-repos/", "https://repo.r-wasm.org")) #nolint

library(blockr)
library(palmerpenguins)
library(ggplot2)

new_ggplot_block <- function(col_x = character(), col_y = character(), ...) {

  data_cols <- function(data) colnames(data)

  new_block(
    fields = list(
      x = new_select_field(col_x, data_cols, type = "name"),
      y = new_select_field(col_y, data_cols, type = "name")
    ),
    expr = quote(
      ggplot(mapping = aes(x = .(x), y = .(y)))
    ),
    class = c("ggplot_block", "plot_block"),
    ...
  )
}

new_geompoint_block <- function(color = character(), shape = character(), ...) {

  data_cols <- function(data) colnames(data$data)

  new_block(
    fields = list(
      color = new_select_field(color, data_cols, type = "name"),
      shape = new_select_field(shape, data_cols, type = "name")
    ),
    expr = quote(
      geom_point(aes(color = .(color), shape = .(shape)), size = 2)
    ),
    class = c("plot_layer_block", "plot_block"),
    ...
  )
}

block_input_check.plot_block <- function(x, data, ...) {

  if (inherits(data, "data.frame")) {
    return(invisible(NULL))
  }

  input_failure("Expecting data.frame input.")
}

block_output_ptype.plot_block <- function(x, ...) ggplot()

block_input_check.plot_layer_block <- function(x, data, ...) {
  if (inherits(data, "ggplot")) {
    return(invisible(NULL))
  }

  input_failure("Expecting ggplot input.")
}

block_output_ptype.plot_layer_block <- function(x, ...) ggplot()

register_blocks(
  constructor = c(new_ggplot_block, new_geompoint_block),
  name = c("ggplot block", "geompoint block"),
  description = c(
    "Builds a ggplot object",
    "Add points geom to ggplot object"
  ),
  package = "blockr.demo",
  category = c("Visualization", "Visualization")
)

stack <- new_stack(
  data_block = new_dataset_block("penguins", "palmerpenguins"),
  filter_block = new_filter_block("sex", "female", submit = TRUE),
  plot_block = new_ggplot_block("flipper_length_mm", "body_mass_g"),
  layer_block = new_geompoint_block("species", "species")
)
serve_stack(stack)
