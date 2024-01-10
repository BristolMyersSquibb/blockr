#' JSON serialization
#'
#' Object serialization as JSON.
#'
#' @param x Object to (de)serialize
#'
#' @export
to_json <- function(x) {
  UseMethod("to_json")
}

to_json_impl <- function(x) {
  jsonlite::toJSON(
    list(
      payload = paste0(constructive::construct(x)[["code"]], collapse = "\n"),
      blockr = as.character(utils::packageVersion("blockr"))
    )
  )
}

#' @rdname to_json
#' @export
to_json.field <- to_json_impl

#' @rdname to_json
#' @export
to_json.block <- to_json_impl

#' @rdname to_json
#' @export
to_json.stack <- to_json_impl

#' @rdname to_json
#' @export
to_json.workspace <- to_json_impl

#' @rdname to_json
#' @export
from_json <- function(x) {

  res <- jsonlite::fromJSON(x)

  stopifnot(setequal(names(res), c("payload", "blockr")))

  eval(parse(text = res[["payload"]]))
}
