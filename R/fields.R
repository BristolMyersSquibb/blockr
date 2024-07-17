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
  validate_string(field_component(x, "value"))
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

  mul <- field_component(x, "multiple")

  validate_bool(mul, "multiple")

  val <- field_component(x, "value")

  if (mul) {
    validate_character(val)
  } else {
    validate_string(val)
  }

  if (!all(val %in% field_component(x, "choices"))) {
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
  validate_bool(field_component(x, "value"))
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

  val <- field_component(x, "value")
  min <- field_component(x, "min")
  max <- field_component(x, "max")

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

  val <- field_component(x, "value")

  validate_string(val)
  validate_file(val)

  NextMethod()
}

#' @rdname update_field
#' @export
update_field_value.upload_field <- function(x, new, ...) {
  NextMethod(new = new$datapath)
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

  val <- field_component(x, "value")

  validate_string(val)
  validate_file(val)

  vol <- field_component(x, "volumes")

  if (!is.character(vol) && !length(vol)) {
    validation_failure("expecting a nonzero length character vector as ",
                       "`volumes`", class = "character_failure")
  }

  NextMethod()
}

#' @rdname update_field
#' @export
update_field_value.filesbrowser_field <- function(x, new, ...) {

  if (is.integer(new)) {
    return(x)
  }

  files <- shinyFiles::parseFilePaths(field_component(x, "volumes"), new)

  NextMethod(new = unname(files$datapath))
}

#' Variable field constructor
#'
#' Variable field is intended to conditionally display
#' different field based on a condition.
#'
#' @inheritParams new_string_field
#' @rdname variable_field
#' @param field Field type
#' @param components Variable list of field components
#' @param package Package weher to find the field constructor (as
#'   `new_{class_name}`)
#' @export
new_variable_field <- function(field = character(), components = list(),
                               package = "blockr", ...) {

  if (!is.function(components)) {
    components <- as.list(components)
  }

  new_field(NULL, field = field, components = components, package = package,
            ..., class = "variable_field")
}

#' @rdname initialize
#' @export
is_initialized.variable_field <- function(x) {
  is_variable_field_ready(x) && is_initialized(materialize_variable_field(x))
}

is_variable_field_ready <- function(x) {
  all(lengths(get_field_component_values(x, c("field", "package"))) > 0)
}

#' @rdname validate_field
#' @export
validate_field.variable_field <- function(x) {

  validate_string(field_component(x, "field"))
  validate_string(field_component(x, "package"))

  validate_field(materialize_variable_field(x))

  NextMethod()
}

#' @rdname field_value
#' @export
field_value.variable_field <- function(x) {

  if (!is_variable_field_ready(x)) {
    return(list())
  }

  field_value(materialize_variable_field(x))
}

materialize_variable_field <- function(x) {

  res <- materialize_field(
    get_field_component_value(x, "field"),
    get_field_component_value(x, "components"),
    get_field_component_value(x, "package")
  )

  copy_attrs(res, x)
}

materialize_field <- function(field, components, package) {
  fun <- do.call("::", list(pkg = package, name = paste0("new_", field)))
  do.call(fun, coal(components, list()))
}

copy_attrs <- function(x, y) {

  attributes(x) <- c(
    some_attrs(y, drop = c("class", "names")),
    list(class = class(x), names = names(x))
  )

  x
}

some_attrs <- function(x, drop = c("class", "names")) {
  res <- attributes(x)
  res[!names(res) %in% drop]
}

rm_attrs <- function(x, keep = "names") {
  attributes(x) <- attributes(x)[keep]
  x
}

#' @rdname update_field
#' @export
update_field_components.variable_field <- function(x, env = list()) {

  val <- field_value(x)
  tmp <- update_functional_field_components(x, env)

  res <- materialize_variable_field(tmp)
  res <- update_field_components(res, env)

  if (!identical(val, list())) {
    res <- update_field_value(res, val)
  }

  res <- rm_attrs(res)

  set_field_component_value(tmp, "components", res)
}

#' @rdname update_field
#' @export
update_field_value.variable_field <- function(x, new) {

  if (!length(new)) {
    return(x)
  }

  res <- materialize_variable_field(x)
  res <- update_field_value(res, new)
  res <- rm_attrs(res)

  set_field_component_value(x, "components", res)
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

  val <- field_component(x, "value")
  min <- field_component(x, "min")
  max <- field_component(x, "max")

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

#' @rdname update_field
#' @export
update_field_value.hidden_field <- function(x, ...) {
  x
}

#' List field constructor
#'
#' A field that can contain subfields. See \link{new_filter_block} for
#' a usecase.
#'
#' @inheritParams new_variable_field
#' @param name Sub-field name(s)
#' @rdname list_field
#' @export
new_list_field <- function(field = character(), components = list(),
                           name = character(), package = "blockr", ...) {

  args <- c(
    list(field = field, components = components, package = package),
    list(...)
  )

  args <- c(
    list(value = NULL, name = name),
    args,
    list(class = "list_field")
  )

  do.call(new_field, args)
}

#' @rdname initialize
#' @export
is_initialized.list_field <- function(x) {
  is_list_field_ready(x) &&
    all(lgl_ply(materialize_list_field(x), is_initialized))
}

is_list_field_ready <- function(x) {
  all(lengths(get_field_component_values(x, c("field", "name", "package"))) > 0)
}

#' @rdname field_value
#' @export
field_value.list_field <- function(x) {

  if (!is_list_field_ready(x)) {
    return(list())
  }

  lapply(materialize_list_field(x), field_value)
}

materialize_list_field <- function(x) {

  args <- lapply(
    set_names(nm = setdiff(list_field_components(x), c("value", "name"))),
    function(i) get_field_component_value(x, i)
  )

  fld <- do.call(Map, c(new_variable_field, args))
  nme <- get_field_component_value(x, "name")

  set_names(fld, nme)
}

#' @rdname validate_field
#' @export
validate_field.list_field <- function(x) {

  cmps <- c("field", "name", "package")
  lens <- set_names(integer(3L), cmps)

  for (cmp in cmps) {
    tmp <- field_component(x, cmp)
    lens[cmp] <- length(tmp)
    validate_character(tmp)
  }

  if (any(lens != max(lens) & lens != 1L)) {
    validation_failure("expecting same lengths (up to length 1)",
                       class = "length_failure")
  }

  for (sub in materialize_list_field(x)) {
    validate_field(sub)
  }

  NextMethod()
}

#' @rdname update_field
#' @export
update_field_components.list_field <- function(x, env = list()) {

  val <- field_value(x)
  tmp <- update_functional_field_components(x, env)

  res <- materialize_list_field(tmp)
  res <- lapply(res, update_field_components, env)

  nme <- intersect(names(res), names(val))

  if (length(nme)) {
    res[nme] <- Map(update_field_value, res[nme], val[nme])
  }

  res <- lapply(res, get_field_component, "components")

  set_field_component_value(tmp, "components", res)
}

#' @rdname update_field
#' @export
update_field_value.list_field <- function(x, new) {

  if (!length(new) || any(!lengths(new))) {
    return(x)
  }

  new <- as.list(new)
  nme <- get_field_component_value(x, "name")

  if (is.null(names(new))) {
    stopifnot(length(new) == length(nme))
    names(new) <- nme
  } else {
    new <- new[nme]
  }

  res <- Map(
    update_field_value,
    materialize_list_field(x),
    new
  )

  cmp <- lapply(res, get_field_component, "components")

  set_field_component_value(x, "components", cmp)
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

#' @param autocomplete Additional autocomplete options
#' @rdname new_field
#' @export
new_expression_field <- function(value = "", autocomplete = character(), ...) {

  new_field(value, autocomplete = autocomplete, ...,
            class = "expression_field")
}

#' @rdname new_field
#' @export
validate_field.expression_field <- function(x) {

  validate_string(field_component(x, "value"))

  validate_character(
    field_component(x, "autocomplete"),
    allow_zero_length = TRUE
  )

  NextMethod()
}

#' @rdname new_block
#' @export
is_initialized.expression_field <- function(x) {
  val <- field_component(x, "value")
  length(val) && nchar(val) > 0
}
