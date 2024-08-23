#' Validate field generic
#'
#' Validator functions for fields.
#'
#' @param x A Field
#' @export
validate_field <- function(x) {
  UseMethod("validate_field", x)
}

#' @rdname validate_field
#' @export
validate_field.field <- function(x) {
  invisible(NULL)
}

#' @rdname validate_field
#' @export
validate_field.default <- function(x) {
  validation_failure("no validator available for class ", class(x),
    class = "no_validator"
  )
}

#' @rdname validate_field
#' @export
is_valid <- function(x) {
  UseMethod("is_valid", x)
}

#' @rdname validate_field
#' @export
is_valid.field <- function(x) {
  tryCatch(
    {
      validate_field(x)
      TRUE
    },
    validation_failure = function(e) {
      structure(FALSE, msg = conditionMessage(e))
    }
  )
}

validate_block <- function(x) {
  tmp <- lapply(names(x), \(name) {
    is_valid(x[[name]])
  })
  structure(
    all(unlist(tmp) == TRUE),
    msgs = unlist(lapply(tmp, \(res) attr(res, "msg"))),
    fields = names(x)[unlist(tmp) != TRUE]
  )
}

#' @param ... Message components (forwarded to [paste0()])
#' @param class Condition class (will be a subclass of `validation_failure`)
#' @rdname validate_field
#' @export
validation_failure <- function(..., class = character()) {
  rlang::abort(paste0(...), class = c(class, "validation_failure"))
}

validate_string <- function(x, arg = NULL) {
  if (!is_string(x)) {
    msg <- "expecting a string"

    if (not_null(arg)) {
      msg <- paste0(msg, " as `", arg, "`")
    }

    validation_failure(msg, class = "string_failure")
  }

  invisible(NULL)
}

validate_character <- function(x, arg = NULL) {
  if (!is.character(x) || !length(x)) {
    msg <- "expecting a non zero-length character vector"

    if (not_null(arg)) {
      msg <- paste0(msg, " as `", arg, "`")
    }

    validation_failure(msg, class = "character_failure")
  }

  invisible(NULL)
}

validate_bool <- function(x, arg = NULL) {
  if (!is_bool(x)) {
    msg <- "expecting a boolean"

    if (not_null(arg)) {
      msg <- paste0(msg, " as `", arg, "`")
    }

    validation_failure(msg, class = "bool_failure")
  }

  invisible(NULL)
}

validate_number <- function(x, arg = NULL) {
  if (!is_number(x)) {
    msg <- "expecting a number"

    if (not_null(arg)) {
      msg <- paste0(msg, " as `", arg, "`")
    }

    validation_failure(msg, class = "number_failure")
  }

  invisible(NULL)
}

validate_file <- function(x) {
  if (!file.exists(x)) {
    validation_failure("file does not exist", class = "file_failure")
  }

  invisible(NULL)
}

validate_range <- function(x, min, max) {
  if (x < min || x > max) {
    validation_failure("expecting a value in the specified range",
      class = "range_failure"
    )
  }

  invisible(NULL)
}
