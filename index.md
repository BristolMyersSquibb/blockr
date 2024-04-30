
<!-- README.md is generated from README.Rmd. Please edit that file -->

# blockr

<!-- badges: start -->

[![ci](https://github.com/blockr-org/blockr/actions/workflows/ci.yml/badge.svg)](https://github.com/blockr-org/blockr/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/blockr-org/blockr/graph/badge.svg?token=9AO88LK8FJ)](https://codecov.io/github/blockr-org/blockr)
<!-- badges: end -->

Building blocks for data manipulation and visualization operations.

<div class="card bslib-card bslib-mb-spacing html-fill-item html-fill-container" data-bslib-card-init data-full-screen="false" data-require-bs-caller="card()" data-require-bs-version="5">
<div class="card-body bslib-gap-spacing html-fill-item html-fill-container" style="margin-top:auto;margin-bottom:auto;flex:1 1 auto;">
<iframe class="html-fill-item" src="https://shinylive.io/r/editor/#code=NobwRAdghgtgpmAXGKAHVA6ASmANGAYwHsIAXOMpMAdzgCMAnRRASwgGdSoAbbgCgA6YOtyIEA1gyG4ABAzioi7GQF4ZQgBalSqdogD0+kWMkBaIgwDmGSy1IaArnQwsi+2o1PzF7IQEoBCG4WRigGAE8+YwkGAI4uCRkAHlMZCDhqAH1OKAlBCBlCmQATKC5M6PFcQKKZdjhuOAJSCtEJQLjA+oYANzhshPE+HIk-MABfAF0gA" height="700" width="100%" style="border: 1px solid rgba(0,0,0,0.175); border-radius: .375rem;" allowfullscreen="" allow="autoplay" data-external="1"></iframe>
</div>
<bslib-tooltip placement="auto" bsOptions="[]" data-require-bs-version="5" data-require-bs-caller="tooltip()">
<template>Expand</template>
<span class="bslib-full-screen-enter badge rounded-pill"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="height:1em;width:1em;fill:currentColor;" aria-hidden="true" role="img"><path d="M20 5C20 4.4 19.6 4 19 4H13C12.4 4 12 3.6 12 3C12 2.4 12.4 2 13 2H21C21.6 2 22 2.4 22 3V11C22 11.6 21.6 12 21 12C20.4 12 20 11.6 20 11V5ZM4 19C4 19.6 4.4 20 5 20H11C11.6 20 12 20.4 12 21C12 21.6 11.6 22 11 22H3C2.4 22 2 21.6 2 21V13C2 12.4 2.4 12 3 12C3.6 12 4 12.4 4 13V19Z"/></svg></span>
</bslib-tooltip>
<script data-bslib-card-init>bslib.Card.initializeAllCards();</script>
</div>

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
