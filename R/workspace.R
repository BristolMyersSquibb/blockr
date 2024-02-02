#' Workspace
#'
#' Stacks all live in a singleton workspace.
#'
#' @param ... A set of of stacks
#' @param title The workspace title
#' @param settings An (optional) list of settings (a string ist parsed as JSON)
#' @param force Force overwrite existing stacks (otherwise may throw warning)
#'
#' @export
set_workspace <- function(..., title = "", settings = NULL, force = FALSE) {

  set_workspace_title(title)
  set_workspace_settings(settings)
  set_workspace_stacks(list(...), force)

  invisible(workspace_env)
}

workspace_env <- structure(
  new.env(parent = emptyenv()),
  title = "",
  settings = list(),
  class = "workspace"
)

set_workspace_stacks <- function(stacks, force = FALSE) {

  if (is_stack(stacks)) {
    stacks <- list(stacks)
  }

  nms <- names(stacks)

  stopifnot(
    is.list(stacks), all(lgl_ply(stacks, is_stack)),
    !is.null(nms), !anyNA(nms), all(nzchar(nms)), !anyDuplicated(nms)
  )

  clear_workspace_stacks(force)

  list2env(stacks, envir = workspace_env)

  invisible(stacks)
}

#' @param name Stack name
#' @param stack A single stack
#' @rdname set_workspace
#' @export
add_workpace_stack <- function(name, stack, force = FALSE) {

  stopifnot(is_string(name), nzchar(name), is_stack(stack), is_bool(force))

  if (!isTRUE(force) && name %in% list_workspace_stacks()) {
    warnings("existing stack ", name, " will be overriden")
  }

  assign(name, stack, envir = workspace_env)

  invisible(stack)
}

#' @rdname set_workspace
#' @export
rm_workspace_stack <- function(name, force = FALSE) {

  stopifnot(is_string(name), is_bool(force))

  if (!isTRUE(force) && !name %in% list_workspace_stacks()) {
    warnings("no stack ", name, " exists")
    invisible(FALSE)
  }

  rm(list = name, envir = workspace_env, inherits = FALSE)

  invisible(TRUE)
}

#' @rdname set_workspace
#' @export
set_workspace_title <- function(title) {

  stopifnot(is_string(title))

  attr(workspace_env, "title") <- title

  invisible(title)
}

#' @rdname set_workspace
#' @export
set_workspace_settings <- function(settings) {

  if (is.null(settings)) {
    settings <- list()
  } else if (is_string(settings)) {
    settings <- jsonlite::fromJSON(settings)
  }

  stopifnot(is.list(settings))

  attr(workspace_env, "settings") <- settings

  invisible(settings)
}

#' @rdname set_workspace
#' @export
list_workspace_stacks <- function() {
  ls(envir = workspace_env, all.names = TRUE)
}

clear_workspace_stacks <- function(force = TRUE) {

  stopifnot(is_bool(force))

  objs <- list_workspace_stacks()

  if (length(objs)) {

    if (!isTRUE(force)) {
      warning("Resetting existing workspace")
    }

    rm(list = objs, envir = workspace_env, inherits = FALSE)
  }

  invisible(list())
}

clear_workspace_title <- function() {
  set_workspace_title("")
}

clear_workspace_settings <- function() {
  set_workspace_settings(list())
}

#' @rdname set_workspace
#' @export
get_workspace <- function() {
  res <- workspace_env
  stopifnot(inherits(res, "workspace"))
  res
}

#' @rdname set_workspace
#' @export
get_workspace_stack <- function(name) {
  res <- get(name, envir = workspace_env, inherits = FALSE)
  stopifnot(is_stack(res))
  res
}

#' @param names Stack names
#' @rdname set_workspace
#' @export
get_workspace_stacks <- function(names = list_workspace_stacks()) {
  res <- mget(names, envir = workspace_env, inherits = FALSE)
  stopifnot(is.list(res), all(lgl_ply(res, is_stack)))
  res
}

#' @rdname set_workspace
#' @export
get_workspace_title <- function() {
  res <- attr(workspace_env, "title")
  stopifnot(is_string(res))
  res
}

#' @rdname set_workspace
#' @export
get_workspace_settings <- function() {
  res <- attr(workspace_env, "settings")
  stopifnot(is.list(res))
  res
}
