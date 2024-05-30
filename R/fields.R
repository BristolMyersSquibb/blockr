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
  validate_string(value(x))
  NextMethod()
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

  new_field(value, choices = choices, multiple = multiple, ...,
            class = "select_field")
}

#' @rdname validate_field
#' @export
validate_field.select_field <- function(x) {

  mul <- value(x, "multiple")

  validate_bool(mul, "multiple")

  val <- value(x)

  if (mul) {
    validate_character(val)
  } else {
    validate_string(val)
  }

  if (!all(val %in% value(x, "choices"))) {
    validation_failure("selected value(s) not among provided choices",
                       class = "enum_failure")
  }

  NextMethod()
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
  validate_bool(value(x))
  NextMethod()
}

#' Numeric field constructor
#'
#' Numeric fields are translated into \link[shiny]{numericInput}
#'
#' @inheritParams new_string_field
#' @inheritParams shiny::numericInput
#' @rdname numeric_field
#' @export
new_numeric_field <- function(value = numeric(), min = numeric(),
                              max = numeric(), ...) {
  new_field(value, min = min, max = max, ..., class = "numeric_field")
}

#' @rdname validate_field
#' @export
validate_field.numeric_field <- function(x) {

  val <- value(x)
  min <- value(x, "min")
  max <- value(x, "max")

  validate_number(val)

  if (length(min)) {
    validate_number(min, "min")
  }

  if (length(max)) {
    validate_number(max, "max")
  }

  if (length(min) && length(max)) {
    validate_range(val, min, max)
  }

  NextMethod()
}

#' Submit field constructor
#'
#' Submit fields are translated into \link[shiny]{actionButton}
#'
#' @inheritParams new_string_field
#' @rdname submit_field
#' @export
new_submit_field <- function(...) {
  new_field(value = 0, ..., class = "submit_field")
}

#' Upload field constructor
#'
#' Upload fields are translated into \link[shiny]{fileInput}
#'
#' @inheritParams new_string_field
#' @rdname upload_field
#' @export
new_upload_field <- function(value = character(), ...) {
  new_field(value, ..., class = "upload_field")
}

#' @rdname validate_field
#' @export
validate_field.upload_field <- function(x) {

  val <- value(x)

  validate_string(val)
  validate_file(val)

  NextMethod()
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
  new_field(value, volumes = volumes, ..., class = "filesbrowser_field")
}

#' @rdname validate_field
#' @export
validate_field.filesbrowser_field <- function(x) {

  val <- value(x)

  validate_string(val)
  validate_file(val)

  vol <- value(x, "volumes")

  if (!is.character(vol) && !length(vol)) {
    validation_failure("expecting a nonzero length character vector as ",
                       "`volumes`", class = "character_failure")
  }

  NextMethod()
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
new_variable_field <- function(field = character(), components = list(), ...) {

  new_field(NULL, field = field, components = as.list(components), ...,
            class = "variable_field")
}

#' @rdname validate_field
#' @export
validate_field.variable_field <- function(x) {
  validate_field(materialize_variable_field(x))
  NextMethod()
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
  min <- value(x, "min")
  max <- value(x, "max")

  validate_number(val[1L])
  validate_number(val[2L])

  if (length(min)) {
    validate_number(min, "min")
  }

  if (length(max)) {
    validate_number(max, "max")
  }

  if (length(min) && length(max)) {
    validate_range(val[1L], min, max)
    validate_range(val[2L], min, max)
  }

  NextMethod()
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

#' List field constructor
#'
#' A field that can contain subfields. See \link{new_filter_block} for
#' a usecase.
#'
#' @inheritParams new_string_field
#' @param sub_fields Fields contained in `list_field`
#' @rdname list_field
#' @export
new_list_field <- function(sub_fields = list(), ...) {
  new_field(NULL, sub_fields = sub_fields, ..., class = "list_field")
}

#' @rdname validate_field
#' @export
validate_field.list_field <- function(x) {

  for (sub in get_sub_fields(x)) {
    validate_field(sub)
  }

  NextMethod()
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
