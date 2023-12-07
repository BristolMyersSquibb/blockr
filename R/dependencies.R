#' @importFrom htmltools htmlDependency
blockrDependencies <- function() {
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
highlightDependencies <- function() {
  htmlDependency(
    "highlight",
    version = utils::packageVersion("blockr"),
    src = "assets",
    package = "blockr",
    stylesheet = "highlight.min.css",
  )
}
