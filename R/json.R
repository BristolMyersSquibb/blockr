#' JSON serialization
#'
#' Object serialization as JSON.
#'
#' @param x Object to (de)serialize
#'
#' @export
to_json <- function(x = NULL) {
  UseMethod("to_json")
}

to_json_impl <- function(x) {

  cns <- constructive::construct(
    x,
    opts_environment("new.env"),
    compare = constructive::compare_options(ignore_function_env = TRUE)
  )

  jsonlite::toJSON(
    list(
      class = class(x),
      payload = paste0(cns[["code"]], collapse = "\n"),
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
to_json.workspace <- function(x) {

  payload <- list(
    stacks = eapply(x, to_json),
    title = attr(x, "title"),
    settings = attr(x, "settings")
  )

  jsonlite::toJSON(
    list(
      class = class(x),
      payload = payload,
      blockr = as.character(utils::packageVersion("blockr"))
    )
  )
}

#' @rdname to_json
#' @export
to_json.NULL <- function(x) {
  to_json(get_workspace())
}

#' @rdname to_json
#' @export
from_json <- function(x) {

  res <- jsonlite::fromJSON(x)

  stopifnot(setequal(names(res), c("class", "payload", "blockr")))

  if (identical(res[["class"]], "workspace")) {

    c(
      lapply(res[["payload"]][["stacks"]], from_json),
      title = res[["payload"]][["title"]],
      settings = jsonlite::toJSON(res[["payload"]][["settings"]])
    )

  } else {

    eval(parse(text = res[["payload"]]))
  }
}
