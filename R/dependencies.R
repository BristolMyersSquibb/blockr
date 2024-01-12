#' @importFrom htmltools htmlDependency
coreDeps <- function() {
  htmlDependency(
    "blockr",
    version = utils::packageVersion("blockr"),
    src = "assets",
    package = "blockr",
    script = "index.js",
    stylesheet = "style.min.css"
  )
}

#' @importFrom htmltools htmlDependency
highlightDeps <- function() {
  htmlDependency(
    "highlight",
    version = utils::packageVersion("blockr"),
    src = "assets",
    package = "blockr",
    stylesheet = "highlight.min.css",
  )
}

#' Use Blockr
#' Imports blockr dependencies
#' @export
useBlockr <- function() {
  tagList(coreDeps(), highlightDeps())
}
