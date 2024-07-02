#' Pipe operator
#'
#' See \code{magrittr::\link[magrittr:pipe]{\%>\%}} for details.
#'
#' @name %>%
#' @rdname pipe
#' @keywords internal
#' @export
#' @importFrom magrittr %>%
#' @usage lhs \%>\% rhs
#' @param lhs A value or the magrittr placeholder.
#' @param rhs A function call using the magrittr semantics.
#' @return The result of calling `rhs(lhs)`.
NULL

rand_names <- function(old_names = character(0L), n = 1L, length = 15L,
                       chars = letters, prefix = "", suffix = "") {
  stopifnot(
    is.null(old_names) || is.character(old_names),
    is_count(n), is_count(length),
    is.character(chars), length(chars) >= 1L,
    is_string(prefix), is_string(suffix),
    nchar(prefix) + nchar(suffix) < length
  )

  length <- length - (nchar(prefix) + nchar(suffix))

  repeat {
    res <- replicate(
      n,
      paste0(
        prefix,
        paste(sample(chars, length, replace = TRUE), collapse = ""),
        suffix
      )
    )

    if (length(res) == length(unique(res)) && !any(res %in% old_names)) {
      break
    }
  }

  res
}

chr_ply <- function(x, fun, ..., length = 1L, use_names = FALSE) {
  vapply(x, fun, character(length), ..., USE.NAMES = use_names)
}

#' @keywords internal
lgl_ply <- function(x, fun, ..., length = 1L, use_names = FALSE) {
  vapply(x, fun, logical(length), ..., USE.NAMES = use_names)
}

int_ply <- function(x, fun, ..., length = 1L, use_names = FALSE) {
  vapply(x, fun, integer(length), ..., USE.NAMES = use_names)
}

dbl_ply <- function(x, fun, ..., length = 1L, use_names = FALSE) {
  vapply(x, fun, double(length), ..., USE.NAMES = use_names)
}

chr_xtr <- function(x, i, ...) chr_ply(x, `[[`, i, ...)

lgl_xtr <- function(x, i, ...) lgl_ply(x, `[[`, i, ...)

int_xtr <- function(x, i, ...) int_ply(x, `[[`, i, ...)

dbl_xtr <- function(x, i, ...) dbl_ply(x, `[[`, i, ...)

lst_xtr <- function(x, i) lapply(x, `[[`, i)

map <- function(f, ..., use_names = FALSE) Map(f, ..., USE.NAMES = use_names)

is_scalar <- function(x) length(x) == 1L

is_string <- function(x) {
  is.character(x) && is_scalar(x)
}

not_null <- Negate(is.null)

is_bool <- function(x) {
  is_scalar(x) && (identical(x, TRUE) || identical(x, FALSE))
}

is_intish <- function(x) {
  is.integer(x) || (is.numeric(x) && all(x == trunc(x)) && !is.na(x))
}

is_count <- function(x, include_zero = TRUE) {
  if (length(x) != 1) {
    return(FALSE)
  }

  if (!is_intish(x)) {
    return(FALSE)
  }

  if (isTRUE(include_zero)) {
    x >= 0 && !is.na(x)
  } else {
    x > 0 && !is.na(x)
  }
}

is_number <- function(x) {
  is.numeric(x) && is_scalar(x) && !is.na(x) && !is.nan(x) && is.finite(x)
}

set_names <- function(object = nm, nm) {
  names(object) <- nm
  object
}

coal <- function(..., fail_null = TRUE) {
  for (i in seq_len(...length())) {
    x <- ...elt(i)
    if (is.null(x)) next else return(x)
  }

  if (isTRUE(fail_null)) {
    stop("No non-NULL value encountered")
  }

  NULL
}

quoted_input_entry <- function(x) {
  bquote(input[[.(val)]], list(val = x))
}

quoted_input_entries <- function(x) {
  if (length(x) == 1L && is.null(names(x))) {
    return(quoted_input_entry(x))
  }

  splice_args(list(..(args)), args = lapply(x, quoted_input_entry))
}

quoted_input_expression <- function(inputs, names) {
  do.call(expression, set_names(inputs, names))
}

splice_args <- function(expr, ...) {
  do.call(
    bquote,
    list(expr = substitute(expr), where = list(...), splice = TRUE)
  )
}

type_trans <- function(x) {
  res <- value(x)

  switch(attr(x, "type"),
    literal = res,
    name = if (length(res) <= 1) {
      as.name(res)
    } else {
      lapply(res, as.name)
    }
  )
}

unlst <- function(x, recursive = FALSE, use_names = FALSE) {
  unlist(x, recursive = recursive, use.names = use_names)
}

# dropNulls
dropNulls <- function(x) {
  x[!vapply(x, is.null, FUN.VALUE = logical(1))]
}

`!startsWith` <- Negate(startsWith)

#' Bootstrap 5 offcanvas
#'
#' Sidebar like element either a top, bottom, right or left.
#'
#' @param id Unique id. Must be triggered by a button
#' whose `data-bs-target` attributes matches this id.
#' @param title Title.
#' @param ... Body content.
#' @param position Either `start` (left), `top`, `bottom`
#' or `end` (right).
#'
#' @return Boolean. TRUE if dependency found.
#'
#' @export
off_canvas <- function(
  id,
  title,
  ...,
  position = c("start", "top", "bottom", "end")
) {
  position <- match.arg(position)
  label <- rand_names()

  tags$div(
    class = sprintf("offcanvas offcanvas-%s", position),
    tabindex = "-1",
    id = id,
    `aria-labelledby` = label,
    tags$div(
      class = "offcanvas-header",
      tags$h5(
        class = "offcanvas-title",
        id = label,
        title
      ),
      tags$button(
        type = "button",
        class = "btn-close",
        `data-bs-dismiss` = "offcanvas",
        `aria-label` = "Close"
      )
    ),
    tags$div(class = "offcanvas-body", ...)
  )
}

#' Create and show a Bootstrap modal
#'
#' TBD.
#'
#' @param ... Modal content.
#'
#' @keywords internal
create_modal <- function(...) {
  showModal(
    modalDialog(
      ...,
      title = h3(icon("xmark"), "ERROR"),
      footer = modalButton("Dismiss"),
      size = "l",
      fade = TRUE
    )
  )
}

#' Sends validation error to user interface
#'
#' Depending on whether some inputs are invalid.
#'
#' @param blk Block.
#' @param is_valid Block valid status.
#' @param session Shiny session object.
#'
#' @return Side effects.
#'
#' @keywords internal
send_error_to_ui <- function(blk, is_valid, session) {
  ns <- session$ns
  session$sendCustomMessage(
    "validate-block",
    list(
      state = is_valid$block,
      id = ns("block")
    )
  )

  # Toggle submit field
  # FIXME: maybe we want to handle this outside the function?
  if ("submit_block" %in% class(blk)) {
    session$sendCustomMessage(
      "toggle-submit",
      list(state = is_valid$block, id = ns("submit"))
    )
  }

  # Cleanup any old message
  removeUI(
    selector = sprintf("[data-value=\"%s\"] .block-invalid-message", ns("block")),
    multiple = TRUE,
    session = session
  )

  removeUI(
    selector = sprintf("[data-value=\"%s\"] .field-invalid-message", ns("block")),
    multiple = TRUE,
    session = session
  )

  # Send validation message
  if (!is_valid$block) {
    insertUI(
      selector = sprintf("[data-value=\"%s\"] .block-validation", ns("block")),
      ui = div(
        class = "text-danger text-center block-invalid-message",
        sprintf("%s error(s) found in this block", length(is_valid$message))
      ),
      where = "beforeEnd",
      session = session
    )

    is_valid$message |>
      length() |>
      seq() |>
      lapply(\(i) {
        msg <- is_valid$message[i]
        field <- is_valid$fields[i]

        insertUI(
          selector = sprintf("#%s", ns(field)),
          ui = div(
            class = "text-danger field-invalid-message",
            msg
          ),
          where = "afterEnd",
          session = session
        )
      })
  }
}

# has_method(character(), "generate_server")
has_method <- function(x, generic) {
  mts0 <- utils::methods(generic = generic)
  mts1 <- gsub(paste0("^", generic, "\\."), "", as.character(mts0))
  mts <- gsub(paste0("*$"), "", mts1)
  any(class(x) %in% mts)
}

#' Create shinylive iframe
#'
#' @param app_code base64 app code. You can create it from https://shinylive.io/r
#' by writing code and click on share and copy the link. The code is located at
#' the end of the url.
#' @param mode How to display the shinylive app. Default to app mode.
#' @param header Whether to display the shinylive header. Default to TRUE.
#'
#' @export
create_app_link <- function(app_code, mode = c("app", "editor"), header = TRUE) {
  mode <- match.arg(mode)

  app_url <- sprintf(
    "https://shinylive.io/r/%s/#code=%s", mode, app_code
  )

  if (!header) {
    app_url <- paste0(app_url, "&h=0")
  }

  tags$iframe(
    # To allow the content to fill the full screen card
    class = "html-fill-item",
    src = app_url,
    height = "700",
    width = "100%",
    style = "border: 1px solid rgba(0,0,0,0.175); border-radius: .375rem;",
    allowfullscreen = "",
    allow = "autoplay",
    `data-external` = "1"
  )
}

registry_sorter <- function(block) {
  cl <- attr(block, "classes")

  if ("data_block" %in% cl)
    return(1)

  if ("parser_block" %in% cl)
    return(2)

  if ("transform_block" %in% cl)
    return(3)

  if ("plot_block" %in% cl)
    return(4)

  return(5)
}

sort_registry <- function(blocks) {
  blocks[order(sapply(blocks, registry_sorter), na.last = FALSE)]
}

add_block_index <- function(blocks) {
  for (i in seq_along(blocks)) {
    attr(blocks[[i]], "index") <- i
  }

  blocks
}

get_block_index <- function(block) {
  attr(block, "index")
}

get_block_title <- function(x) {
  registry <- available_blocks()
  block <- registry[sapply(registry, \(blk) {
    if (all(class(x)[!class(x) %in% "block"] %in% attr(blk, "classes"))) {
      return(TRUE)
    }

    FALSE
  })]

  if (length(block)) {
    name <- attr(block[[1]], "name") |>
      (\(.) gsub("block$", "", .))() |>
      trimws() |>
      tools::toTitleCase()

    pkg <- attr(block[[1]], "package")

    if (!is.na(pkg)) {
      return(
        tagList(
          span(
            attr(block[[1]], "package"),
            class = "badge bg-light"
          ),
          name
        )
      )
    }

    return(name)
  }

  # fallback in case we're working with a block that is not registered
  # e.g.: a block that is defined within the script
  title <- class(x)[1] |>
    (\(.) gsub("_", " ", .))() |>
    (\(.) gsub("block$", "", .))() |>
    trimws() |>
    tools::toTitleCase()
}

# wrap generate_server
# id as first argument, so we can test via shiny::testSever
module_server_test <- function(id, x, in_dat, is_prev_valid, ...) {
  generate_server(x = x, in_dat = in_dat, id = id, is_prev_valid = is_prev_valid)
}
