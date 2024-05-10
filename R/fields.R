#' String field constructor
#'
#' String fields are translated into \link[shiny]{textInput}
#'
#' @param value Default text input value.
#' @param ... Other parameters passed to \link{new_field} and may be needed
#' by \link{ui_input} to pass more options to the related shiny input.
#' @rdname string_field
#' @export
new_string_field <- function(value = character(), ...) {
  new_field(value, ..., class = "string_field")
}

#' @rdname validate_field
#' @export
validate_field.string_field <- function(x) {
  val <- value(x)

  if (!is.character(val) || length(val) != 1L) {
    value(x) <- ""
  }

  x
}

#' Select field constructor
#'
#' Select fields are translated into \link[shiny]{selectInput}
#'
#' @inheritParams new_string_field
#' @param choices Select choices
#' @param multiple Allow multiple selection
#' @rdname select_field
#' @export
new_select_field <- function(value = character(), choices = character(),
                             multiple = FALSE, ...) {
  new_field(value,
    choices = choices, multiple = multiple, ...,
    class = "select_field"
  )
}

#' @rdname validate_field
#' @export
validate_field.select_field <- function(x) {
  val <- value(x)

  if (length(val) && !all(val %in% value(x, "choices"))) {
    value(x) <- character()
  }

  x
}

#' Switch field constructor
#'
#' Switch fields are translated into \link[bslib]{input_switch}
#'
#' @inheritParams new_string_field
#' @rdname switch_field
#' @export
new_switch_field <- function(value = FALSE, ...) {
  new_field(value, ..., class = "switch_field")
}

#' @rdname validate_field
#' @export
validate_field.switch_field <- function(x) {
  val <- value(x)

  if (length(val) == 0) {
    value(x) <- FALSE
  }
  x
}

#' Numeric field constructor
#'
#' Numeric fields are translated into \link[shiny]{numericInput}
#'
#' @inheritParams new_string_field
#' @inheritParams shiny::numericInput
#' @rdname numeric_field
#' @export
new_numeric_field <- function(
    value = numeric(),
    min = numeric(),
    max = numeric(),
    ...) {
  new_field(value, min = min, max = max, ..., class = "numeric_field")
}

#' @rdname validate_field
#' @export
validate_field.numeric_field <- function(x) {
  val <- value(x)

  # Shiny does not care much about min and max
  # Let's be more strict.
  # Inf and -Inf are allowed
  stopifnot(
    is_truthy(value(x, "min")),
    is_truthy(value(x, "max")),
    value(x, "min") < value(x, "max"),
    length(value(x, "min")) == 1L,
    length(value(x, "max")) == 1L
  )

  if (length(val) == 1L) {
    # NA is allowed to return validation
    # error on the client
    if (!is.na(val)) {
      if (!is.numeric(val) || is.nan(val) || is.infinite(val)) {
        value(x) <- value(x, "min")
      } else if (val < value(x, "min")) {
        value(x) <- value(x, "min")
      } else if (val > value(x, "max")) {
        value(x) <- value(x, "max")
      }
    }
  }

  x
}

#' Submit field constructor
#'
#' Submit fields are translated into \link[shiny]{actionButton}
#'
#' @inheritParams new_string_field
#' @rdname submit_field
#' @export
new_submit_field <- function(...) {
  # action buttons always start from 0
  new_field(value = 0, ..., class = "submit_field")
}

#' @rdname validate_field
#' @export
validate_field.submit_field <- function(x) {
  x
}

#' Upload field constructor
#'
#' Upload fields are translated into \link[shiny]{fileInput}
#'
#' @inheritParams new_string_field
#' @rdname upload_field
#' @export
new_upload_field <- function(value = character(), ...) {
  new_field(
    value,
    ...,
    class = "upload_field"
  )
}

#' @rdname validate_field
#' @export
validate_field.upload_field <- function(x) {
  x
}

#' Files browser field constructor
#'
#' Files browser fields are translated into \link[shinyFiles]{shinyFilesButton}
#'
#' @inheritParams new_string_field
#' @param volumes Paths accessible by the shinyFiles browser
#' @rdname filesbrowser_field
#' @export
new_filesbrowser_field <- function(value = character(), volumes = character(),
                                   ...) {
  new_field(
    value,
    volumes = volumes,
    ...,
    class = "filesbrowser_field"
  )
}

#' @rdname validate_field
#' @export
validate_field.filesbrowser_field <- function(x) {
  x
}

#' Variable field constructor
#'
#' Variable field is intended to conditionally display
#' different field based on a condition.
#'
#' @note Currently broken. Don't use.
#'
#' @inheritParams new_string_field
#' @rdname variable_field
#' @param field Field type
#' @param components Variable list of field components
#' @export
new_variable_field <- function(value = character(), field = character(),
                               components = list(), ...) {
  new_field(value,
    field = field, components = components, ...,
    class = "variable_field"
  )
}

#' @rdname validate_field
#' @export
validate_field.variable_field <- function(x) {
  val <- value(x, "field")
  # TO DO: avoid hardcoding
  opt <- c(
    "string_field",
    "select_field",
    "switch_field",
    "range_field",
    "numeric_field",
    "upload_field",
    "filesbrowser_field"
  )

  stopifnot(is.character(val), length(val) <= 1L)

  if (!length(val) || !val %in% opt) {
    value(x, "field") <- "string_field"
  }

  value(x, "components") <- c(
    validate_field(materialize_variable_field(x))
  )

  value(x) <- value(x, "components")[["value"]]

  x
}

materialize_variable_field <- function(x) {
  cmp <- value(x, "components")
  val <- value(x)

  if (is_truthy(val)) {
    cmp[["value"]] <- val
  }

  do.call(value(x, "field"), cmp)
}

#' Range field constructor
#'
#' Range fields are translated into \link[shiny]{sliderInput}.
#'
#' @inheritParams new_string_field
#' @rdname range_field
#' @param min,max Slider boundaries (inclusive)
#' @export
new_range_field <- function(value = numeric(), min = numeric(),
                            max = numeric(), ...) {
  new_field(value, min = min, max = max, ..., class = "range_field")
}

#' @rdname validate_field
#' @export
validate_field.range_field <- function(x) {
  val <- value(x)

  if (!is.numeric(val) || length(val) < 2L) {
    value(x) <- c(value(x, "min"), value(x, "max"))
  } else if (val[1L] < value(x, "min")) {
    value(x) <- c(value(x, "min"), val[2L])
  } else if (val[2L] > value(x, "max")) {
    value(x) <- c(val[1L], value(x, "max"))
  }

  x
}

#' Hidden field constructor
#'
#' Hidden field is useful to host complex expression in
#' a field. See \link{new_filter_block} for a usecase.
#'
#' @inheritParams new_string_field
#' @rdname hidden_field
#' @export
new_hidden_field <- function(value = expression(), ...) {
  new_field(value, ..., class = "hidden_field")
}

#' @rdname validate_field
#' @export
validate_field.hidden_field <- function(x) {
  x
}

#' List field constructor
#'
#' A field that can contain subfields. See \link{new_filter_block} for
#' a usecase.
#'
#' @inheritParams new_string_field
#' @param sub_fields Fields contained in `list_field`
#' @rdname list_field
#' @export
new_list_field <- function(value = list(), sub_fields = list(), ...) {
  new_field(value, sub_fields = sub_fields, ..., class = "list_field")
}

#' @rdname validate_field
#' @export
validate_field.list_field <- function(x) {
  val <- value(x)
  sub <- value(x, "sub_fields")

  if (!is.list(val) || length(val) != length(sub) ||
    !setequal(names(val), names(sub))) { # nolint
    value(x) <- lst_xtr(sub, "value")
  }

  value(x, "sub_fields") <- lapply(
    update_sub_fields(sub, val),
    validate_field
  )

  x
}

#' Result field constructor
#'
#' Result field allows on to reuse the result of one stack
#' in another stack.
#'
#' @inheritParams new_string_field
#' @rdname result_field
#' @export
new_result_field <- function(value = list(), ...) {
  new_field(value, ..., class = "result_field")
}

#' @rdname validate_field
#' @export
validate_field.result_field <- function(x) {
  x
}
