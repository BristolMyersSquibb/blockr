#' JSON serialization
#'
#' Object serialization as JSON.
#'
#' @param x Object to (de)serialize
#' @param ... Forwarded to [jsonlite::toJSON()]
#'
#' @export
to_json <- function(x, ...) {
  UseMethod("to_json")
}

#' @rdname to_json
#' @export
to_json.field <- function(x, ...) {
  jsonlite::toJSON(
    list(content = unclass(x), attributes = attributes(x)),
    ...
  )
}

#' @rdname to_json
#' @export
from_json <- function(x, ...) {
  res <- jsonlite::fromJSON(x, ...)
  `attributes<-`(res[["content"]], res[["attributes"]])
}
