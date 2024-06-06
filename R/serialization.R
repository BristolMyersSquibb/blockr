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
  list(
    class = class(x),
    payload = serialize(x, NULL),
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
blockr_serialize.stack <- function(x) {
  serialize_impl(clear_stack_result(x))
}

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

    res <- c(
      lapply(x[["payload"]][["stacks"]], blockr_deserialize),
      title = x[["payload"]][["title"]],
      settings = jsonlite::toJSON(x[["payload"]][["settings"]])
    )

  } else {

    res <- unserialize(x[["payload"]])
  }

  if (!identical(x[["class"]], "stack")) {
    return(res)
  }

  eval_stack(res)
}

#' @rdname blockr_serialize
#' @export
from_json <- function(x) {

  dec_one <- function(x) {
    x[["payload"]] <- jsonlite::base64_dec(x[["payload"]])
    x
  }

  tmp <- jsonlite::fromJSON(x)

  stopifnot(all(c("class", "payload") %in% names(tmp)))

  if (identical(tmp[["class"]], "workspace")) {
    stopifnot("stacks" %in% names(tmp[["payload"]]))
    tmp[["payload"]][["stacks"]] <- lapply(tmp[["payload"]][["stacks"]],
                                           dec_one)
  } else {
    tmp[["payload"]] <- jsonlite::base64_dec(tmp[["payload"]])
  }

  blockr_deserialize(tmp)
}

#' @rdname blockr_serialize
#' @export
to_json <- function(x = get_workspace()) {

  enc_one <- function(x) {
    x[["payload"]] <- jsonlite::base64_enc(x[["payload"]])
    x
  }

  tmp <- blockr_serialize(x)

  stopifnot(all(c("class", "payload") %in% names(tmp)))

  if (identical(tmp[["class"]], "workspace")) {
    stopifnot("stacks" %in% names(tmp[["payload"]]))
    tmp[["payload"]][["stacks"]] <- lapply(tmp[["payload"]][["stacks"]],
                                           enc_one)
  } else {
    tmp[["payload"]] <- jsonlite::base64_enc(tmp[["payload"]])
  }

  jsonlite::toJSON(tmp)
}
