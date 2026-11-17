
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

Install blockr and everything you need to get started with

``` r
# install.packages("pak")
pak::pak("BristolMyersSquibb/blockr")
```

This installs the development versions of blockr.core, blockr.dock,
blockr.dag, blockr.dplyr, blockr.ggplot, blockr.io, blockr.ui, blockr.viz,
blockr.dm, blockr.script, blockr.session and blockr.assistant from GitHub. No
GitHub token is needed.

Domain packages such as blockr.pharma or blockr.stats are separate installs,
for example `pak::pak("BristolMyersSquibb/blockr.pharma")`.

An older release with fewer packages is on CRAN (`install.packages("blockr")`).

## Example

``` r
library(blockr)

run_app(
  blocks = c(
    a = new_dataset_block("iris")
  )
)
```

## AI

blockr.assistant needs a model provider and an API key before its features
work. See the
[blockr.assistant README](https://github.com/BristolMyersSquibb/blockr.assistant)
for how to set one up.
