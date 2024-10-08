% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/registry.R
\name{available_blocks}
\alias{available_blocks}
\alias{block_name}
\alias{block_descr}
\alias{register_block}
\alias{register_blocks}
\alias{unregister_blocks}
\alias{construct_block}
\title{Block registry}
\usage{
available_blocks()

block_name(blocks = available_blocks())

block_descr(blocks = available_blocks())

register_block(
  constructor,
  name,
  description,
  classes,
  input,
  output,
  package = NA_character_,
  category = "uncategorized"
)

register_blocks(
  constructor,
  name,
  description,
  classes,
  input,
  output,
  package = NA_character_,
  category = "uncategorized"
)

unregister_blocks(ids = NULL, package = NULL)

construct_block(block, ...)
}
\arguments{
\item{blocks}{Block description object(s)}

\item{constructor}{Block constructor}

\item{name, description}{Metadata describing the block}

\item{classes}{Block classes}

\item{input, output}{Object types the block consumes and produces}

\item{package}{Package where block is defined}

\item{category}{Useful to sort blocks by topics. If not specified,
blocks are uncategorized.}

\item{ids}{Character vector of block IDs (first entry in class attribute)}

\item{block}{Block name or description object}

\item{...}{Forwarded to \code{register_block()}}
}
\description{
List available blocks.
}
