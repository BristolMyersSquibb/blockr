
<!-- README.md is generated from README.Rmd. Please edit that file -->

# blockr

<!-- badges: start -->

[![ci](https://github.com/blockr-org/blockr/actions/workflows/ci.yml/badge.svg)](https://github.com/blockr-org/blockr/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/blockr-org/blockr/graph/badge.svg?token=9AO88LK8FJ)](https://codecov.io/github/blockr-org/blockr)
<!-- badges: end -->

Building blocks for data manipulation and visualization operations.

## Installation

You can install the development version of blockr from
[GitHub](https://github.com/) with:

``` r
# install.packages("devtools")
devtools::install_github("blockr-org/blockr")
```

## Examples

### Create a stack

A simple stack of blocks providing a dataset selector and a filter
operation:

``` r
library(blockr)

stack <- new_stack(
  data_block,
  filter_block,
  plot_block
)

serve_stack(stack)
```

### Modify a stack

To add a block to add stack, you can leverage `add_block`:

``` r
stack <- new_stack(data_block) |>
  add_block(select_block) |>
  add_block(filter_block, 1)
```

If you specify the position (last parameter), you can add a block right
after the given index. For instance, the above command first inserts a
select block after the data block. Then, a filter block is included
right after the data block.

Note that you can’t add a block before the data block and before the
plot block. In a later version, we may add multiple plots per stack.

### Moving block

TBD

### Dynamically add a block

``` r
stack <- new_stack(data_block)
shinyApp(
  ui = tagList(
    bslib::page_fluid(generate_ui(stack, id = "mystack")),
    actionButton("add", "Add", class = "my-2")
  ),
  server = function(input, output, session) {
    vals <- reactiveValues(new_blocks = NULL)
    generate_server(stack, id = "mystack", new_blocks = reactive(vals$new_blocks))

    observeEvent(input$add, {
      # For John: this will have to be replaced by your masonry logic
      loc <- sample(seq_along(stack), 1)
      block <- select_block
      # add_block expect the current stack, the block to add and its position
      # (NULL is fine for the position, in that case the block will
      # go at the end)
      vals$new_blocks <- list(
        block = block,
        position = loc
      )
    })
  }
)
```

### Example with modules

``` r
library(shiny)
library(blockr.data)
library(blockr)

options(shiny.fullstacktrace = TRUE)

stack1 <- new_stack(
  data_block,
  filter_block,
  select_block
)

block_ui <- function(id) {
  ns <- shiny::NS(id)
  uiOutput(ns("block"))
}

block_server <- function(id) {
  moduleServer(
    id,
    function(input, output, session){
      ns <- session$ns

      output$block <- renderUI({
        generate_ui(stack1, id = ns("b"))
      })

      generate_server(stack1, id = "b")
    }
  )
}

ui <- function(req) {
  fluidPage(
    theme = bslib::bs_theme(5L),
    div(
      class = "row",
      block_ui("x")
    )
  )
}
server <- function(input, output, session) {
  block_server("x")
}

shinyApp(ui, server)
```
