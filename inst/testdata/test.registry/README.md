
# test.registry

<!-- badges: start -->
<!-- badges: end -->

The goal of test.registry is to ...

## Installation

You can install the development version of test.registry from [GitHub](https://github.com/) with:

``` r
# install.packages("devtools")
devtools::install_github("blockr-org/blockr")
```

## Example

This is a basic example which shows you how to solve a common problem:

``` r
library(blockr)
library(test.registry)
stack <- new_stack(
  data_block,
  new_head_block
)
serve_stack(stack)
```

