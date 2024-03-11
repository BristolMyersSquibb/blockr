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
    exclude = exclude,
    always_show = FALSE
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
  validate_field(
    eval_set_field_value(x, env)
  )
}

#' @rdname initialize
#' @export
is_initialized.field <- function(x) {
  all(lengths(values(x)) > 0)
}

#' Validate field generic
#'
#' Checks the value of a field with \link{value} and
#' apply corrections whenever necessary.
#'
#' @inheritParams is_field
#' @rdname validate_field
#' @export
validate_field <- function(x) {
  UseMethod("validate_field", x)
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
value <- function(x, name = "value") {
  stopifnot(is_field(x))

  res <- x[[name]]

  if (is.function(res)) {
    return(attr(res, "result"))
  }

  res
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

observe_lock_field <- function(
  x,
  blk,
  session = shiny::getDefaultReactiveDomain(),
  ...
) {
  x |>
    names() |>
    lapply(\(field) {
      id <- sprintf("%sLock", field)

      observeEvent(session$input[[id]], {
        # we can't change attributes on a reactive
        # the attributes are present but attr(x, "name") <- 1
        # causes an error
        b <- as.list(blk())
        attr(b[[field]], "always_show") <- session$input[[id]]
        blk(b)
      })
    })

  return(blk)
}

get_field_always_show <- function(x) {
  attr(x, "always_show")
}
