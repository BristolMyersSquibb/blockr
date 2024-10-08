% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/blocks.R
\name{new_join_block}
\alias{new_join_block}
\title{Join block}
\usage{
new_join_block(
  y = NULL,
  type = character(),
  by = character(),
  submit = NA,
  ...
)
}
\arguments{
\item{y}{Second dataset for join.}

\item{type}{Join type.}

\item{by}{Join columns.}

\item{submit}{Whether this block requires to press a submit button to get
the results. Boolean, default to FALSE, which means no submit button.
If NA, then no computation is triggered and the user needs to click on the button
to see the block result. If TRUE, computation is automatically triggered and the button
is shown (which is useful when restoring a stack).}

\item{...}{Further (metadata) attributes}
}
\description{
This block provides access to the dplyr join verbs and
returns a dataframe. This blocks is made to work with multiple
stack as the \code{y} parameter expects a dataframe from another stack.
}
