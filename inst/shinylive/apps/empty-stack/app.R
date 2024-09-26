webr::install("blockr", repos = c("https://bristolmyerssquibb.github.io/webr-repos/", "https://repo.r-wasm.org")) #nolint

library(blockr)
library(blockr.data)
library(blockr.ggplot2)
library(blockr.cardinal)
library(blockr.pharmaverseadam)
library(blockr.pharmaversesdtm)
library(blockr.ggstatsplot)
library(blockr.clinical.timelines)
serve_stack(new_stack(), id = "mystack")
