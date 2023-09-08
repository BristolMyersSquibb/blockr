
<!-- README.md is generated from README.Rmd. Please edit that file -->

# blockr

<!-- badges: start -->
<!-- badges: end -->

Building blocks for data manipulation and visualization operations.

## Installation

You can install the development version of blockr from
[GitHub](https://github.com/) with:

``` r
# install.packages("devtools")
devtools::install_github("nbenn/blockr")
```

## Example

A simple stack of blocks providing a dataset selector and a filter
operation.

``` r
library(blockr)

stack <- new_stack(
  new_data_block,
  new_filter_block
)

serve_stack(stack)
```
