
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

## Contribute

Easiest is to run `make`, otherwise:

1.  Install npm dependencies with `packer::npm_install()`
2.  Build CSS by running the script in `dev/sass.R`

## Examples

<div class="card bslib-card bslib-mb-spacing html-fill-item html-fill-container" data-bslib-card-init data-full-screen="false" data-require-bs-caller="card()" data-require-bs-version="5">
<div class="card-body bslib-gap-spacing html-fill-item html-fill-container" style="margin-top:auto;margin-bottom:auto;flex:1 1 auto;">
<iframe class="html-fill-item" src="https://shinylive.io/r/editor/#code=NobwRAdghgtgpmAXGKAHVA6ASmANGAYwHsIAXOMpMAdzgCMAnRRASwgGdSoAbbgCgA6YOtyIEA1gyG4ABAzioi7GQF4ZQgBalSqdogD0+kWMkBaIgwDmGSy1IaArnQwsi+2o1PzF7IQEoBCG4WRigGAE8+YwkGAI4uCRkAHlMZCDhqAH1OKAlBCBlCmQATKC5M6PFcQKKZMIYoCEs4CtEJQLjA9jgGADcWnLzB8T8wAF8AXSA&amp;h=0" height="700" width="100%" style="border: 1px solid rgba(0,0,0,0.175); border-radius: .375rem;" allowfullscreen="" allow="autoplay" data-external="1"></iframe>
</div>
<bslib-tooltip placement="auto" bsOptions="[]" data-require-bs-version="5" data-require-bs-caller="tooltip()">
<template>Expand</template>
<span class="bslib-full-screen-enter badge rounded-pill"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="height:1em;width:1em;fill:currentColor;" aria-hidden="true" role="img"><path d="M20 5C20 4.4 19.6 4 19 4H13C12.4 4 12 3.6 12 3C12 2.4 12.4 2 13 2H21C21.6 2 22 2.4 22 3V11C22 11.6 21.6 12 21 12C20.4 12 20 11.6 20 11V5ZM4 19C4 19.6 4.4 20 5 20H11C11.6 20 12 20.4 12 21C12 21.6 11.6 22 11 22H3C2.4 22 2 21.6 2 21V13C2 12.4 2.4 12 3 12C3.6 12 4 12.4 4 13V19Z"/></svg></span>
</bslib-tooltip>
<script data-bslib-card-init>bslib.Card.initializeAllCards();</script>
</div>

### Create a stack

A simple stack of blocks providing a dataset selector and a filter
operation:

``` r
library(blockr)
library(blockr.data)

stack <- new_stack(
  data_block,
  filter_block
)

serve_stack(stack)
```

### Modify a stack

To add a block to a stack, you can leverage `add_block`:

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

Below is an app with an interface to dynamically add blocks. We leverage
the `new_blocks` slot of the `generate_server.stack` method. It accepts
the name of the block to insert as well as its position in the stack.

Note that [`{blockr.demo}`](https://github.com/blockr-org/block.demo)
utilises [`{masonry}`](https://github.com/blockr-org/masonry) to provide
a better user experience, allowing one to drag and drop blocks within
the stack.

``` r
library(shiny)
library(blockr)
library(blockr.data)

blocks <- list(
  filter_block,
  select_block,
  arrange_block,
  group_by_block,
  summarize_block,
  cheat_block,
  plot_block
)

stack <- new_stack(data_block)

shinyApp(
  ui = bslib::page_fluid(
    div(
      class = "d-flex justify-content-center",
      tags$button(
        type = "button",
        "Add a new block",
        class = "btn btn-primary",
        class = "my-2",
        `data-bs-toggle` = "offcanvas",
        `data-bs-target` = "#addBlockCanvas",
        `aria-controls` = "addBlockCanvas"
      )
    ),
    generate_ui(stack, id = "mystack"),
    off_canvas(
      id = "addBlockCanvas",
      title = "My blocks",
      position = "bottom",
      radioButtons(
        "selected_block",
        "Choose a block",
        choices = c(
          "filter_block" = 1,
          "select_block" = 2,
          "arrange block" = 3,
          "group_by block" = 4,
          "summarize block" = 5,
          "cheat block" = 6,
          "plot block" = 7
        ),
        inline = TRUE
      ),
      actionButton("add", icon("plus"), `data-bs-dismiss` = "offcanvas")
    )
  ),
  server = function(input, output, session) {
    vals <- reactiveValues(new_blocks = NULL)
    o <- generate_server(
      stack,
      id = "mystack",
      new_blocks = reactive(vals$new_blocks)
    )

    observeEvent(input$add, {
      block <- blocks[[as.numeric(input$selected_block)]]
      # add_block expect the current stack, the block to add and its position
      # (NULL is fine for the position, in that case the block will
      # go at the end)
      vals$new_blocks <- list(
        block = block,
        position = length(o$stack)
      )
    })
  }
)
```

Blocks can be removed in any context, but keep in mind that a data block
can’t be removed unless it is the last stack block.

At the moment, we don’t check whether removing a block breaks the
pipeline.

### Example with modules

The stack can be nested within modules. This is what we do in
[`{blockr.demo}`](https://github.com/blockr-org/block.demo).

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
