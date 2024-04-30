
<!-- README.md is generated from README.Rmd. Please edit that file -->

# blockr

<!-- badges: start -->

[![ci](https://github.com/blockr-org/blockr/actions/workflows/ci.yml/badge.svg)](https://github.com/blockr-org/blockr/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/blockr-org/blockr/graph/badge.svg?token=9AO88LK8FJ)](https://codecov.io/github/blockr-org/blockr)
<!-- badges: end -->

Building blocks for data manipulation and visualization operations.

`{blockr}` has been built for webR (wasm) and is available for download
with
`webr::install("blockr", repos = "https://blockr-org.github.io/webr-repos")`.

``` r
library(blockr)
library(blockr.data)

stack <- new_stack(
  dataset_block,
  select_block
)
serve_stack(stack)
```

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
