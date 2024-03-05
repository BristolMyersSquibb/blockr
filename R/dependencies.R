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

#' @importFrom htmltools htmlDependency
workspaceDeps <- function() {
  htmlDependency(
    "blockr-workspace",
    version = utils::packageVersion("blockr"),
    src = "assets",
    package = "blockr",
    script = "workspace.js"
  )
}

#' Use Blockr
#' Imports blockr dependencies
#' @export
useBlockr <- function() {
  tagList(coreDeps(), highlightDeps())
}
