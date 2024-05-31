#' Fields
#'
#' Each block consists of a set of fields, which define the type of value
#' the field holds and can be used to customize how the UI is generated.
#'
#' @param value Field value
#' @param ... Further field components
#' @param type Field type (allowed values are `"literal"` and `"name"`)
#' @param title A brief title for the field, primarily for display purposes.
#' @param descr A description of the field, explaining its purpose or usage.
#' @param status The status of the field (experimental)
#' @param class Field subclass
#' @param exclude Experimental: Exclude field from being captured in the
#'   update_fields
#' feature. Default to FALSE. Not yet used.
#'
#' @export
#' @rdname new_field
new_field <- function(value, ..., type = c("literal", "name"),
                      title = "",
                      descr = "",
                      status = c("active", "disabled", "invisible"),
                      class = character(), exclude = FALSE) {

  x <- list(value = value, ...)

  status <- match.arg(status)

  stopifnot(is.list(x), length(unique(names(x))) == length(x))

  structure(
    x,
    type = match.arg(type),
    class = c(class, "field"),
    title = title,
    descr = descr,
    status = status,
    exclude = exclude
  )
}

#' @rdname new_field
#' @param x An object inheriting form `"field"`
#' @export
is_field <- function(x) inherits(x, "field")

#' Initialize field generic
#'
#' TBD
#'
#' @rdname initialize_field
#' @inheritParams is_field
#' @param env Environment with data and other field values
#' @export
#' @returns The field.
initialize_field <- function(x, env = list()) {
  UseMethod("initialize_field", x)
}

#' @rdname initialize_field
#' @export
initialize_field.field <- function(x, env = list()) {
  eval_set_field_value(x, env)
}

#' @rdname initialize
#' @export
is_initialized.field <- function(x) {
  all(lengths(values(x)) > 0)
}

#' Update field generic
#'
#' Update a field with a new value.
#' Needed by \link{update_fields} in a block. Necessary to keep
#' the R object in sync with the Shiny interface state (input state).
#'
#' @inheritParams is_field
#' @param new Value to set
#' @inheritParams initialize_field
#' @returns The modified field.
#' @rdname update_field
#' @export
update_field <- function(x, new, env = list()) {
  UseMethod("update_field", x)
}

#' @rdname update_field
#' @export
update_field.field <- function(x, new, env = list()) {

  if (length(new)) {
    value(x) <- new
  }

  eval_set_field_value(x, env)
}

#' @rdname update_field
#' @export
update_field.hidden_field <- function(x, new, env = list()) {
  eval_set_field_value(x, env)
}

eval_set_field_value <- function(x, env) {

  for (cmp in names(x)[lgl_ply(x, is.function)]) {

    fun <- x[[cmp]]
    arg <- env[methods::formalArgs(fun)]

    if (all(lengths(arg))) {

      tmp <- try(do.call(fun, arg), silent = TRUE)

      if (inherits(tmp, "try-error")) {
        log_error(tmp)
      } else if (length(tmp)) {
        value(x, cmp) <- tmp
      }

    } else {

      log_debug("skipping field eval for ", cmp)
    }
  }

  x
}

#' Get field attribute value
#'
#' Get the field value attribute. If it is a function,
#' return the result attribute instead.
#'
#' @inheritParams is_field
#' @param name Field component name
#' @returns Field value
#' @rdname value
#' @export
value <- function(x, name = "value") UseMethod("value", x)

#' @rdname value
#' @export
value.field <- function(x, name = "value") get_field_value(x, name)

get_field_value <- function(x, name) {

  res <- x[[name]]

  if (is.function(res)) {
    return(attr(res, "result"))
  }

  res
}

#' @rdname value
#' @export
value.variable_field <- function(x, name = "value") {
  value(materialize_variable_field(x), name)
}

materialize_variable_field <- function(x) {
  do.call(paste0("new_", x[["field"]]), x[["components"]])
}

#' @rdname value
#' @export
value.list_field <- function(x, name = "value") {

  if (identical(name, "value")) {
    return(lapply(get_sub_fields(x), value, name))
  }

  NextMethod()
}

#' Get all values from a field
#'
#' This calls \link{value} on all the field's names.
#'
#' @inheritParams value
#' @returns A list containing all values.
#' @export
values <- function(x, name = names(x)) {
  set_names(lapply(name, function(n) value(x, n)), name)
}

#' Assign new value to a field attribute.
#'
#' @param value Field value
#' @rdname value
#' @export
#' @returns The field.
`value<-` <- function(x, name = "value", value) {
  if (length(value)) {
    UseMethod("value<-", x)
  } else {
    x
  }
}

#' @rdname value
#' @export
`value<-.field` <- function(x, name = "value", value) {
  set_field_value(x, value, name)
}

set_field_value <- function(x, value, name) {

  if (is.function(x[[name]])) {
    if (!is.null(value)) attr(x[[name]], "result") <- value
  } else {
    x[[name]] <- value
  }

  x
}

#' @rdname value
#' @export
`value<-.upload_field` <- function(x, name = "value", value) {

  if (!identical(name, "value")) {
    return(NextMethod())
  }

  NextMethod(value = value$datapath)
}

#' @rdname value
#' @export
`value<-.filesbrowser_field` <- function(x, name = "value", value) {

  if (!identical(name, "value")) {
    return(NextMethod())
  }

  if (is.integer(value)) {
    return(x)
  }

  files <- shinyFiles::parseFilePaths(value(x, "volumes"), value)

  NextMethod(value = unname(files$datapath))
}

#' @rdname value
#' @export
`value<-.list_field` <- function(x, name = "value", value) {

  if (identical(name, "value")) {
    tmp <- get_sub_fields(x)
    hit <- intersect(names(value), names(tmp))
    tmp[hit] <- Map(`value<-`, tmp[hit], name, value)
    set_sub_fields(x, tmp)
  } else if (identical(name, "sub_fields")) {
    tmp <- value(x)
    x <- set_sub_fields(x, value)
    value(x) <- tmp
    x
  } else {
    stop("Unrecognized list_field component")
  }
}

get_sub_fields <- function(x) get_field_value(x, "sub_fields")

set_sub_fields <- function(x, val) set_field_value(x, val, "sub_fields")

get_field_name <- function(field, name = "") {
  title <- attr(field, "title")

  if (title == "") {
    return(name)
  }

  title
}

get_field_names <- function(x) {
  titles <- character(length(x))
  for (i in seq_along(x)) {
    titles[i] <- get_field_name(x[[i]], names(x)[i])
  }
  titles
}
