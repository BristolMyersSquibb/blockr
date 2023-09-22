
<!-- README.md is generated from README.Rmd. Please edit that file -->

# blockr

<!-- badges: start -->

[![check](https://github.com/nbenn/blockr/actions/workflows/check.yml/badge.svg)](https://github.com/nbenn/blockr/actions/workflows/check.yml)
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
  data_block,
  filter_block
)

serve_stack(stack)
```
