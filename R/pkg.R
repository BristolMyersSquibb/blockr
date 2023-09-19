pkg_name <- function() utils::packageName()

pkg_env <- function() asNamespace(pkg_name())

utils::globalVariables(c("..", "blk"))
