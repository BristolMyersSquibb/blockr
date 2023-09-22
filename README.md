
<!-- README.md is generated from README.Rmd. Please edit that file -->

# blockr

<!-- badges: start -->

[![check](https://github.com/cynkra/blockr/actions/workflows/check.yml/badge.svg)](https://github.com/cynkra/blockr/actions/workflows/check.yml)
[![coverage](https://github.com/cynkra/blockr/actions/workflows/coverage.yml/badge.svg)](https://github.com/cynkra/blockr/actions/workflows/coverage.yml)
[![pkgdown](https://github.com/cynkra/blockr/actions/workflows/pkgdown.yaml/badge.svg)](https://github.com/cynkra/blockr/actions/workflows/pkgdown.yaml)
[![lint](https://github.com/cynkra/blockr/actions/workflows/lint.yaml/badge.svg)](https://github.com/cynkra/blockr/actions/workflows/lint.yaml)
<!-- badges: end -->

Building blocks for data manipulation and visualization operations.

## Installation

You can install the development version of blockr from
[GitHub](https://github.com/) with:

``` r
# install.packages("devtools")
devtools::install_github("cynkra/blockr")
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
