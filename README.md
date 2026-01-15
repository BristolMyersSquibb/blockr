
<!-- README.md is generated from README.Rmd. Please edit that file -->

# blockr

<!-- badges: start -->

[![lifecycle](https://img.shields.io/badge/lifecycle-experimental-orange.svg)](https://lifecycle.r-lib.org/articles/stages.html#experimental)
[![status](https://github.com/BristolMyersSquibb/blockr/actions/workflows/ci.yaml/badge.svg)](https://github.com/BristolMyersSquibb/blockr/actions/workflows/ci.yaml)
[![coverage](https://codecov.io/gh/BristolMyersSquibb/blockr/graph/badge.svg?token=988fQI8MPx)](https://app.codecov.io/gh/BristolMyersSquibb/blockr)
<!-- badges: end -->

blockr is a framework to build data analyses and dashboards in minutes,
click by click.

It is composed of a set of R packages which share a common API and
design. This blockr package is a meta-package which bundles many of
these lower-level packages, making it easy to install and load the
framework in a few simple commands.

To learn more about blockr:

- Read the [docs](https://bristolmyerssquibb.github.io/blockr/).
- Visit the [YouTube channel](https://www.youtube.com/@blockr-project).

## Installation

You can install the development version of blockr from
[GitHub](https://github.com/) with

``` r
# install.packages("pak")
pak::pak("BristolMyersSquibb/blockr")
```

or released versions via [CRAN](https://cran.r-project.org) as

``` r
install.packages("blockr")
```

This will install several blockr packages, including blockr.core,
blockr.dag, blockr.dock, blockr.dplyr, blockr.ggplot, and blockr.io.

## Example

``` r
library(blockr)

run_app(
  blocks = c(
    a = new_dataset_block("iris")
  )
)
```
