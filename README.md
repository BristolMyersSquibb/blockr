
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

To learn more about blockr, visit [blockr.site](https://blockr.site).

## Installation

Install blockr and everything you need to get started with

``` r
# install.packages("pak")
pak::pak("BristolMyersSquibb/blockr")
```

This installs the development versions of blockr.core, blockr.dock,
blockr.dag, blockr.dplyr, blockr.ggplot, blockr.io, blockr.ui,
blockr.viz, blockr.dm, blockr.script, blockr.session and
blockr.assistant from GitHub. No GitHub token is needed.

Domain packages are separate installs, such as blockr.pharma with
`pak::pak("BristolMyersSquibb/blockr.pharma")` or blockr.stats with
`pak::pak("cynkra/blockr.stats")`.

An older release with fewer packages is on CRAN
(`install.packages("blockr")`).

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

The blockr.assistant package adds an AI assistant to the board. To turn
it on, pass its extension to `run_app()`:

``` r
run_app(
  blocks = c(a = new_dataset_block("iris")),
  extensions = list(new_dag_extension(), new_assistant_extension())
)
```

By default, the assistant uses `ellmer::chat_openai()`, which reads its
API key from the `OPENAI_API_KEY` environment variable. The
`blockr.chat_function` option switches to another provider, as the
[blockr.assistant
README](https://github.com/BristolMyersSquibb/blockr.assistant) says.
