% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/blocks.R
\name{new_filter_block}
\alias{new_filter_block}
\title{Filter block}
\usage{
new_filter_block(
  columns = character(),
  values = character(),
  filter_fun = "==",
  submit = NA,
  ...
)
}
\arguments{
\item{columns}{Columns used for filtering}

\item{values}{Values used for filtering}

\item{filter_fun}{Filter function for the expression}

\item{submit}{Whether this block requires to press a submit button to get
the results. Boolean, default to FALSE, which means no submit button.
If NA, then no computation is triggered and the user needs to click on the button
to see the block result. If TRUE, computation is automatically triggered and the button
is shown (which is useful when restoring a stack).}

\item{...}{Further (metadata) attributes}
}
\description{
This block provides access to \link[dplyr]{filter} verb and
returns the filtered data.
}
