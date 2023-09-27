
<!-- README.md is generated from README.Rmd. Please edit that file -->

# blockr

<!-- badges: start -->

[![ci](https://github.com/blockr-org/blockr/actions/workflows/ci.yml/badge.svg)](https://github.com/blockr-org/blockr/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/blockr-org/blockr/graph/badge.svg?token=988fQI8MPx)](https://codecov.io/gh/blockr-org/blockr)
<!-- badges: end -->

Building blocks for data manipulation and visualization operations.

## Installation

You can install the development version of blockr from
[GitHub](https://github.com/) with:

``` r
# install.packages("devtools")
devtools::install_github("blockr-org/blockr")
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
