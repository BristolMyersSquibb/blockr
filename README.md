# blockr

<!-- badges: start -->

[![lifecycle](https://img.shields.io/badge/lifecycle-experimental-orange.svg)](https://lifecycle.r-lib.org/articles/stages.html#experimental)
[![status](https://github.com/BristolMyersSquibb/blockr/actions/workflows/ci.yaml/badge.svg)](https://github.com/BristolMyersSquibb/blockr/actions/workflows/ci.yaml)
<!-- badges: end -->

Functionality for blockr is provided by multiple independent R packages,
some of which are bundled together for convenience reasons.

## Installation

You can install the development version of blockr from
[GitHub](https://github.com/) with:

``` r
# install.packages("pak")
pak::pak("BristolMyersSquibb/blockr")
```

## Example

``` r
run_app(
  blocks = c(
    a = new_dataset_block("iris"),
    b = new_scatter_block(x = "Sepal.Length", y = "Sepal.Width")
  ),
  links = list(from = "a", to = "b", input = "data")
)
```
