#' Workspace
#'
#' Stacks all live in a singleton workspace.
#'
#' @param ... A set of of stacks
#' @param title The workspace title
#' @param settings An (optional) list of settings (a string ist parsed as JSON)
#' @param force Force overwrite existing stacks (otherwise may throw warning)
#' @param workspace The workspace environment
#'
#' @export
set_workspace <- function(..., title = "", settings = NULL, force = FALSE,
                          workspace = get_workspace()) {

  set_workspace_title(title, workspace)
  set_workspace_settings(settings, workspace)
  set_workspace_stacks(list(...), force, workspace)

  invisible(workspace)
}

#' @rdname set_workspace
#' @export
restore_workspace <- function(x, force = FALSE, workspace = get_workspace()) {

  if (is_string(x)) {
    x <- from_json(x)
  }

  do.call(set_workspace, c(x, list(force = force, workspace = workspace)))
}

workspace_env <- structure(
  new.env(parent = emptyenv()),
  title = "",
  settings = list(),
  class = "workspace"
)

#' @rdname set_workspace
#' @export
get_workspace <- function() {

  stopifnot(is_workspace(workspace_env))

  workspace_env
}

#' @param x (Workspace) object
#' @rdname set_workspace
#' @export
is_workspace <- function(x) {
  inherits(x, "workspace")
}

set_workspace_stacks <- function(stacks, force = FALSE,
                                 workspace = get_workspace()) {

  if (is_stack(stacks)) {
    stacks <- list(stacks)
  }

  stopifnot(
    is.list(stacks), all(lgl_ply(stacks, is_stack)), is_bool(force),
    is_workspace(workspace)
  )

  if (length(stacks)) {

    nms <- names(stacks)

    stopifnot(
      is.list(stacks), all(lgl_ply(stacks, is_stack)),
      !is.null(nms), !anyNA(nms), all(nzchar(nms)), !anyDuplicated(nms)
    )

    clear_workspace_stacks(force, workspace)

    list2env(stacks, envir = workspace)

  } else {

    clear_workspace_stacks(workspace = workspace)
  }

  invisible(stacks)
}

#' @param name Stack name
#' @param stack A single stack
#' @rdname set_workspace
#' @export
add_workspace_stack <- function(name, stack, force = FALSE,
                                workspace = get_workspace()) {

  stopifnot(is_string(name), nzchar(name), is_stack(stack), is_bool(force),
            is_workspace(workspace))

  if (!isTRUE(force) && name %in% list_workspace_stacks(workspace)) {
    warning("existing stack ", name, " will be overriden")
  }

  assign(name, stack, envir = workspace)

  invisible(stack)
}

#' @rdname set_workspace
#' @export
set_workspace_stack <- function(name, stack, force = FALSE,
                                workspace = get_workspace()) {

  stopifnot(is_string(name), nzchar(name), is_stack(stack), is_bool(force),
            is_workspace(workspace))

  if (!isTRUE(force) && !name %in% list_workspace_stacks(workspace)) {
    warning("no stack ", name, " exists")
  }

  assign(name, stack, envir = workspace)

  invisible(stack)
}

#' @rdname set_workspace
#' @export
rm_workspace_stacks <- function(name, force = FALSE,
                                workspace = get_workspace()) {

  stopifnot(is.character(name), length(name) > 0L, is_bool(force),
            is_workspace(workspace))

  exst <- name %in% list_workspace_stacks(workspace)

  if (!isTRUE(force) && !all(exst)) {
    warning("stack(s) ", name[!exst], " does/do not exist")
    invisible(FALSE)
  }

  rm(list = name, envir = workspace, inherits = FALSE)

  invisible(TRUE)
}

#' @rdname set_workspace
#' @export
rm_workspace_stack <- rm_workspace_stacks

#' @rdname set_workspace
#' @export
set_workspace_title <- function(title, workspace = get_workspace()) {

  stopifnot(is_string(title), is_workspace(workspace))

  attr(workspace, "title") <- title

  invisible(title)
}

#' @rdname set_workspace
#' @export
set_workspace_settings <- function(settings, workspace = get_workspace()) {

  if (is.null(settings)) {
    settings <- list()
  } else if (is_string(settings)) {
    settings <- jsonlite::fromJSON(settings)
  }

  stopifnot(is.list(settings), is_workspace(workspace))

  attr(workspace, "settings") <- settings

  invisible(settings)
}

#' @rdname set_workspace
#' @export
list_workspace_stacks <- function(workspace = get_workspace()) {

  stopifnot(is_workspace(workspace))

  ls(envir = workspace, all.names = TRUE)
}

clear_workspace_stacks <- function(force = TRUE, workspace = get_workspace()) {

  stopifnot(is_bool(force), is_workspace(workspace))

  objs <- list_workspace_stacks(workspace)

  if (length(objs)) {

    if (!isTRUE(force)) {
      warning("Resetting existing workspace")
    }

    rm(list = objs, envir = workspace, inherits = FALSE)
  }

  invisible(list())
}

clear_workspace_title <- function(workspace = get_workspace()) {

  stopifnot(is_workspace(workspace))

  set_workspace_title("", workspace)
}

clear_workspace_settings <- function(workspace = get_workspace()) {

  stopifnot(is_workspace(workspace))

  set_workspace_settings(list(), workspace)
}

clear_workspace <- function(workspace = get_workspace()) {

  stopifnot(is_workspace(workspace))

  clear_workspace_stacks(workspace = workspace)
  clear_workspace_title(workspace)
  clear_workspace_settings(workspace)

  invisible(NULL)
}

#' @rdname set_workspace
#' @export
get_workspace_stack <- function(name, workspace = get_workspace()) {

  stopifnot(is_string(name), is_workspace(workspace))

  res <- get(name, envir = workspace, inherits = FALSE)

  stopifnot(is_stack(res))

  res
}

#' @param names Stack names
#' @rdname set_workspace
#' @export
get_workspace_stacks <- function(names = NULL, workspace = get_workspace()) {

  if (is.null(names)) {
    names <- list_workspace_stacks(workspace)
  } else {
    stopifnot(is.character(names), is_workspace(workspace))
  }

  res <- mget(names, envir = workspace, inherits = FALSE)

  stopifnot(is.list(res), all(lgl_ply(res, is_stack)))

  res
}

#' @rdname set_workspace
#' @export
get_workspace_title <- function(workspace = get_workspace()) {

  stopifnot(is_workspace(workspace))

  res <- attr(workspace, "title")

  stopifnot(is_string(res))

  res
}

#' @rdname set_workspace
#' @export
get_workspace_settings <- function(workspace = get_workspace()) {

  stopifnot(is_workspace(workspace))

  res <- attr(workspace, "settings")

  stopifnot(is.list(res))

  res
}

#' @param ... Passed to `set_workspace()`
#' @param clear Clear current worspace
#' @param id Workspace ID
#'
#' @rdname set_workspace
#' @export
serve_workspace <- function(..., clear = NULL, id = "myworkspace",
                            workspace = get_workspace()) {

  stopifnot(is_string(id), is_workspace(workspace))

  if (...length()) {
    set_workspace(..., workspace = workspace)
  } else if (is.null(clear)) {
    clear <- TRUE
  }

  if (isTRUE(clear)) {

    if (...length()) {
      warning("Clearing newly set up workspace")
    }

    clear_workspace(workspace)
  }

  ws <- get_workspace()

  ui <- bslib::page_fluid(
    generate_ui(ws, id = id)
  )

  server <- function(input, output, session) {
    generate_server(ws, id = id)
  }

  shinyApp(ui, server)
}
