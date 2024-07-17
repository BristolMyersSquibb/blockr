is_field_component <- function(x, component) {
  stopifnot(is_field(x), is_string(component))
  component %in% list_field_components(x)
}

list_field_components <- function(x) names(x)

get_field_component <- function(x, component) {
  stopifnot(is_field_component(x, component))
  x[[component]]
}

get_field_component_value <- function(x, component) {

  res <- get_field_component(x, component)

  if (is.function(res)) {
    return(get_functional_field_component_value(res))
  }

  res
}

get_functional_field_component_value <- function(x) {
  attr(x, "result")
}

get_field_component_values <- function(x,
                                       components = list_field_components(x)) {

  lapply(components, function(i) get_field_component_value(x, i))
}

set_field_component_value <- function(x, component, value) {

  x[[component]] <- if (is_functional_field_component(x, component)) {
    set_functional_field_component_value(x[[component]], value)
  } else {
    value
  }

  x
}

set_functional_field_component_value <- function(x, value) {
  attr(x, "result") <- value
  x
}

list_functional_field_components <- function(x) {
  stopifnot(is_field(x))
  list_field_components(x)[lgl_ply(x, is.function)]
}

is_functional_field_component <- function(x, component) {
  is.function(get_field_component(x, component))
}

eval_functional_field_component <- function(x, component, env) {

  stopifnot(is_functional_field_component(x, component))

  fun <- get_field_component(x, component)
  arg <- methods::formalArgs(fun)

  stopifnot(all(arg %in% names(env)))

  arg <- env[arg]

  if (!all(lengths(arg))) {
    log_debug("skipping field eval for ", component)
    return(NULL)
  }

  res <- try(do.call(fun, arg), silent = TRUE)

  if (inherits(res, "try-error")) {
    log_error(res)
    return(NULL)
  }

  res
}

update_functional_field_component <- function(x, component, env) {

  res <- eval_functional_field_component(x, component, env)

  if (length(res)) {
    return(set_field_component_value(x, component, res))
  }

  log_debug("no update for component ", component)

  x
}

update_functional_field_components <- function(x, env) {

  for (cmp in list_functional_field_components(x)) {
    log_trace("updating functional field component ", cmp)
    x <- update_functional_field_component(x, cmp, env)
  }

  x
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
