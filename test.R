devtools::load_all()
library(blockr.data)
library(shiny)

stack <- new_stack(data_block)

#' ggscatterstats
#'
#' A new transform block.
#'
#' @export
ggscatterstats_block <- function(data, ...) {
  types <- c(
    "parametric",
    "nonparametric",
    "robust",
    "bayes"
  )
  num_cols <- colnames(dplyr::select_if(data, is.numeric))
  blockr::new_block(
    expr = quote({
      ggstatsplot::ggscatterstats(data = data,
                                  x = .(xx),
                                  y = .(y),
                                  type = .(type),
                                  #  conf.level = .(conf.level),
                                  xlab = .(xlab),
                                  ylab = .(ylab),
                                  title = .(title))
    }),
    fields = list(
      xx = blockr::new_select_field(num_cols[1], num_cols),
      y = blockr::new_select_field(num_cols[1], num_cols),
      type = blockr::new_select_field(types[1], types),
      #  conf.level = blockr::new_numeric_field(0.95),
      xlab = new_string_field(""),

      title = new_string_field(""),
      ylab = new_string_field("")
    ),
    class = c("ggscatterstats_block", "plot_block")
  )
}


blockr::register_block(
  constructor = ggscatterstats_block,
  name = "scatter plot",
  description = "scatter with stats",
  classes = c("ggscatterstats_block", "plot_block"),
  input = "data.frame",
  output = "data.frame"
)

shinyApp(
  ui = bslib::page_fluid(
    add_block_ui(),
    generate_ui(stack, id = "mystack")
  ),
  server = function(input, output, session) {
    vals <- reactiveValues(new_block = NULL)
    stack <- generate_server(
      stack,
      id = "mystack",
      new_block = reactive(vals$new_block)
    )

    observeEvent(input$add, {
      vals$new_block <- NULL
      # Always append to stack
      loc <- length(stack$blocks)
      block <- available_blocks()[[input$selected_block]]
      # add_block expect the current stack, the block to add and its position
      # (NULL is fine for the position, in that case the block will
      # go at the end)
      vals$new_block <- list(
        block = block,
        position = loc
      )
    })
  }
)
