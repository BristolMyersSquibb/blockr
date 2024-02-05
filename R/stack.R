#' Stacks
#'
#' A set of blocks can be assembled into a stack.
#'
#' @param ... An ordered set of blocks (each argument is required to inherit
#' from `"block"`)
#' @param title Stack title
#' @param name Stack name
#'
#' @export
new_stack <- function(..., title = "Stack", name = rand_names()) {

  ctors <- c(...)
  names <- names(ctors)

  stopifnot(is_string(title), is_string(name))

  if (length(ctors)) {

    blocks <- vector("list", length(ctors))

    blocks[[1L]] <- do.call(ctors[[1L]], list(position = 1))
    temp <- evaluate_block(blocks[[1L]])

    for (i in seq_along(ctors)[-1L]) {
      temp <- evaluate_block(
        blocks[[i]] <- do.call(ctors[[i]], list(temp, position = i)),
        data = temp
      )
    }

  } else {

    blocks <- list()
  }

  stopifnot(is.list(blocks), all(lgl_ply(blocks, is_block)))

  structure(blocks, title = title, name = name, class = "stack")
}

set_stack_blocks <- function(stack, blocks) {

  stopifnot(is_stack(stack), is.list(blocks), all(lgl_ply(blocks, is_block)))

  attributes(blocks) <- attributes(stack)

  blocks
}

#' @param x An object inheriting form `"stack"`
#' @rdname new_stack
#' @export
is_stack <- function(x) {
  inherits(x, "stack")
}

#' @rdname new_stack
#' @export
get_stack_name <- function(x) {
  stopifnot(is_stack(x))
  attr(x, "name")
}

#' @rdname new_stack
#' @export
set_stack_name <- function(x, name) {
  stopifnot(is_stack(x), is_string(name))
  attr(x, "name") <- name
  x
}

#' @rdname new_stack
#' @export
set_stack_title <- function(x, title) {
  stopifnot(is_stack(x), is_string(title))
  attr(x, "title") <- title
  x
}

#' @rdname new_stack
#' @export
get_stack_title <- function(x) {
  stopifnot(is_stack(x))
  attr(x, "title")
}

#' @rdname new_stack
#' @export
generate_code.stack <- function(x) {
  if (length(x) == 0) return(quote(identity()))

  # Handles monoblock stacks
  if (length(x) > 1) {
    aggregate_code <- function(x, y) {
      block_combiner(x, y)
    }
    Reduce(aggregate_code, lapply(x, \(b) b))
  } else {
    generate_code(x[[1]])
  }
}

#' Combine 2 block expressions
#'
#' Useful for \link{generate_code}.
#'
#' @rdname block_combiner
#' @param left Left block object in `x %>% y`.
#' @param right Right block object in `x %>% y`.
#'
#' @param ... For generic consistency.
#' @export
block_combiner <- function(left, right, ...) UseMethod("block_combiner", right)

#' @rdname block_combiner
#' @export
block_combiner.transform_block <- function(left, right, ...) {
  substitute(
    left %>% right,
    list(left = generate_code(left), right = generate_code(right))
  )
}

#' @rdname block_combiner
#' @export
block_combiner.plot_block <- block_combiner.transform_block

#' @rdname block_combiner
#' @export
block_combiner.plot_layer_block <- function(left, right, ...) {
  substitute(
    left + right,
    list(left = generate_code(left), right = generate_code(right))
  )
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
  if (length(stack) == 0) {
    # we can't check check inherit because
    # this comes from the registry which is of class
    # block_descr
    if (!"data_block" %in% attr(block, "classes")) {
      stop("The first block must be a data block.")
    }
  }

  if (length(stack) > 0L) {
    last <- stack[[length(stack)]]
    # For now, we won't be able to insert a block
    # after a plot block. In a later version, we may imagine
    # have multiple block plot per stack so we'll have to revisit
    # this ...
    if (inherits(last, "plot_block")) {
      stop("Can't insert a block below a plot block.")
    }
  }

  if (is.null(position) || position > length(stack)) {
    position <- length(stack)
  }

  message("ADD BLOCK (position ", position + 1, ")")

  if (position < 1L) {
    position <- 1L
  }

  # get data from the previous block
  if (length(stack) == 1) {
    data <- evaluate_block(stack[[position]])
  } else if (length(stack) > 1L) {
    data <- evaluate_block(stack[[1]])
    for (i in seq_along(stack)[-1L]) {
      data <- evaluate_block(
        do.call(class(stack[[i]])[[1]], list(data)),
        data = data
      )
    }
  }

  if (!length(stack)) {
    tmp <- do.call(block, list())
  } else {
    tmp <- do.call(block, list(data = data, position = position))
  }

  set_stack_blocks(stack, append(stack, list(tmp), position))
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
#' @param id Stack ID
#'
#' @rdname new_stack
#' @export
serve_stack <- function(stack, id = "my_stack") {

  ui <- bslib::page_fluid(generate_ui(stack, id))

  server <- function(input, output, session) {
    generate_server(stack, id)
  }

  shinyApp(ui, server)
}
