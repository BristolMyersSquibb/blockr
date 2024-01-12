#' Serialization
#'
#' Object (de)serialization.
#'
#' @param x Object to (de)serialize
#'
#' @export
blockr_serialize <- function(x) {
  UseMethod("blockr_serialize")
}

serialize_impl <- function(x) {

  cns <- constructive::construct(
    x,
    constructive::opts_environment("new.env"),
    compare = constructive::compare_options(ignore_function_env = TRUE)
  )

  list(
    class = class(x),
    payload = paste0(cns[["code"]], collapse = "\n"),
    blockr = as.character(utils::packageVersion("blockr"))
  )
}

#' @rdname blockr_serialize
#' @export
blockr_serialize.field <- serialize_impl

#' @rdname blockr_serialize
#' @export
blockr_serialize.block <- serialize_impl

#' @rdname blockr_serialize
#' @export
blockr_serialize.stack <- serialize_impl

#' @rdname blockr_serialize
#' @export
blockr_serialize.workspace <- function(x) {

  payload <- list(
    stacks = eapply(x, blockr_serialize),
    title = attr(x, "title"),
    settings = attr(x, "settings")
  )

  list(
    class = class(x),
    payload = payload,
    blockr = as.character(utils::packageVersion("blockr"))
  )
}

#' @rdname blockr_serialize
#' @export
blockr_deserialize <- function(x) {

  stopifnot(setequal(names(x), c("class", "payload", "blockr")))

  if (identical(x[["class"]], "workspace")) {

    c(
      lapply(x[["payload"]][["stacks"]], blockr_deserialize),
      title = x[["payload"]][["title"]],
      settings = jsonlite::toJSON(x[["payload"]][["settings"]])
    )

  } else {

    eval(parse(text = x[["payload"]]))
  }
}

#' @rdname blockr_serialize
#' @export
from_json <- function(x) {
  blockr_deserialize(jsonlite::fromJSON(x))
}

#' @rdname blockr_serialize
#' @export
to_json <- function(x = get_workspace()) {
  jsonlite::toJSON(blockr_serialize(x))
}
