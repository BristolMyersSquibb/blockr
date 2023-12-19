#' Stacks
#'
#' A set of blocks can be assembled into a stack.
#'
#' @param ... An ordered set of blocks (each argument is required to inherit
#' from `"block"`)
#' @param name Stack name
#'
#' @export
new_stack <- function(..., name = rand_names()) {
  ctors <- c(...)
  names <- names(ctors)

  blocks <- vector("list", length(ctors))

  blocks[[1L]] <- do.call(ctors[[1L]], list(position = 1))
  temp <- evaluate_block(blocks[[1L]])

  for (i in seq_along(ctors)[-1L]) {
    temp <- evaluate_block(
      blocks[[i]] <- do.call(ctors[[i]], list(temp, position = i)),
      data = temp
    )
  }

  stopifnot(
    is.list(blocks), length(blocks) >= 1L, all(lgl_ply(blocks, is_block))
  )

  structure(blocks, name = name, class = "stack")
}

#' @param x An object inheriting form `"stack"`
#' @rdname new_stack
#' @export
is_stack <- function(x) {
  inherits(x, "stack")
}

#' @rdname new_stack
#' @export
generate_code.stack <- function(x) {

  binary_substitute <- function(x, y) {
    substitute(x %>% y, list(x = x, y = y))
  }

  Reduce(binary_substitute, lapply(x, generate_code))
}

#' Add block to a stack
#'
#' This is to be called oustide the stack by
#' other modules.
#'
#' @param stack stack to update. See \link{new_stack}.
#' @param block Block to insert.
#' @param position Where to insert the new block. If NULL,
#' the block will be added in the last position.
#'
#' @return Invisibly returns the stack.
#' @export
add_block <- function(stack, block, position = NULL) {
  stopifnot(length(stack) > 0)
  if (is.null(position)) stopifnot(position >= 1)
  if (length(stack) == 0) {
    block_name <- deparse(substitute(block))
    if (!grepl("data", block_name)) {
      stop("The first block must be a data block.")
    }
  }

  last <- stack[[length(stack)]]
  # For now, we won't be able to insert a block
  # after a plot block. In a later version, we may imagine
  # have multiple block plot per stack so we'll have to revisit
  # this ...
  if (inherits(last, "plot_block")) {
    stop("Can't insert a block below a plot block.")
  }
  if (is.null(position)) {
    # inject new block + pass in data from previous block
    position <- length(stack)
  }

  # get data from the previous block
  if (length(stack) == 1) {
    data <- evaluate_block(stack[[position]])
  } else {
    data <- evaluate_block(stack[[1]])
    for (i in seq_along(stack)[-1L]) {
      data <- evaluate_block(
        do.call(class(stack[[i]])[[1]], list(data)),
        data = data
      )
    }
  }

  tmp <- do.call(block, list(data = data, position = position))
  stack <- append(stack, list(tmp), position)
  invisible(stack)
}

#' Move blocks within a stack
#'
#' This is to be called oustide the stack by
#' other modules.
#'
#' @param stack stack to update. See \link{new_stack}.
#' @param from Initial block position.
#' @param to New block position. The block at the new position
#' will take the old position.
#'
#' @return Invisibly returns the stack.
#' @export
move_block <- function(stack, from, to) {
  stopifnot(length(stack) > 0)

  tmp_from <- stack[[from]]
  tmp_to <- stack[[to]]

  if (inherits(tmp_to, "plot_block") || inherits(tmp_from, "plot_block")) {
    stop("At the moment, we can't move a plot block.")
  }

  # TO DO: we have to check whether the reordering
  # is valid in term of data wrangling.
  stack[[from]] <- tmp_to
  stack[[to]] <- tmp_from
  invisible(stack)
}

#' @param stack An object inheriting form `"stack"`
#' @rdname new_stack
#' @export
serve_stack <- function(stack) {
  ui <- bslib::page_fluid(generate_ui(stack))

  server <- function(input, output, session) {
    generate_server(stack)
  }

  shinyApp(ui, server)
}
