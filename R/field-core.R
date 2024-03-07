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
#' @param exclude Experimental: Exclude field from being captured in the update_fields
#' feature. Default to FALSE. Not yet used.
#'
#' @export
#' @rdname field
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

#' @rdname new_block
#' @export
is_initialized.field <- function(x) {
  all(lengths(values(x)) > 0)
}

#' @param x An object inheriting form `"field"`
#' @rdname new_field
#' @export
validate_field <- function(x) {
  UseMethod("validate_field", x)
}

#' @param new Value to set
#' @param env Environment with data and other field values
#'
#' @rdname new_field
#' @export
update_field <- function(x, new, env = list()) {
  UseMethod("update_field", x)
}

#' @rdname new_field
#' @export
update_field.field <- function(x, new, env = list()) {
  x <- eval_set_field_value(x, env)

  if (is.null(new)) {
    return(validate_field(x))
  }

  value(x) <- new

  res <- validate_field(x)

  if (is_initialized(res)) {
    return(res)
  }

  eval_set_field_value(res, env)
}

#' @rdname new_field
#' @export
initialize_field <- function(x, env = list()) {
  UseMethod("initialize_field", x)
}

#' @rdname new_field
#' @export
initialize_field.field <- function(x, env = list()) {
  validate_field(
    eval_set_field_value(x, env)
  )
}

eval_set_field_value <- function(x, env) {
  for (cmp in names(x)[lgl_ply(x, is.function)]) {
    fun <- x[[cmp]]

    tmp <- try(
      do.call(fun, env[methods::formalArgs(fun)]),
      silent = TRUE
    )

    if (inherits(tmp, "try-error")) {
      log_error(tmp)
    } else if (length(tmp)) {
      value(x, cmp) <- tmp
    }
  }

  x
}

#' @param name Field component name
#' @rdname new_field
#' @export
value <- function(x, name = "value") {
  stopifnot(is_field(x))

  res <- x[[name]]

  if (is.function(res)) {
    return(attr(res, "result"))
  }

  res
}

#' @rdname new_field
#' @export
values <- function(x, name = names(x)) {
  set_names(lapply(name, function(n) value(x, n)), name)
}

#' @param value Field value
#' @rdname new_field
#' @export
`value<-` <- function(x, name = "value", value) {
  if (is.null(x)) {
    return(NULL)
  }

  stopifnot(is_field(x))

  if (is.function(x[[name]])) {
    if (!is.null(value)) attr(x[[name]], "result") <- value
  } else {
    x[[name]] <- value
  }

  x
}

#' @rdname new_field
#' @export
is_field <- function(x) inherits(x, "field")

update_sub_fields <- function(sub, val) {
  # Added this because of the join_block
  if (is.null(names(val)) && length(sub)) {
    value(sub[[1]]) <- unlist(val)
  } else {
    for (fld in names(val)[lgl_ply(val, is_truthy)]) {
      value(sub[[fld]]) <- unlist(val[[fld]])
    }
  }

  sub
}
