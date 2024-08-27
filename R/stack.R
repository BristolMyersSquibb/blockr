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

  ctors <- list(...)
  names <- names(ctors)

  stopifnot(is_string(title), is_string(name))

  if (length(ctors)) {

    blocks <- vector("list", length(ctors))

    if (length(names)) {
      stopifnot(length(unique(names)) == length(blocks))
    } else {
      names <- rand_names(n = length(blocks))
    }

    blocks[[1L]] <- do_init_block(ctors[[1L]], 1L, names[1L])
    temp <- evaluate_block(blocks[[1L]])

    for (i in seq_along(ctors)[-1L]) {

      blocks[[i]] <- do_init_block(ctors[[i]], i, names[i], temp)
      temp <- evaluate_block(blocks[[i]], data = temp)
    }

  } else {

    blocks <- list()
    temp <- list()
  }

  stopifnot(is.list(blocks), all(lgl_ply(blocks, is_block)))

  structure(blocks, title = title, name = name, result = temp, class = "stack")
}

do_init_block <- function(x, pos, nme, dat = NULL) {

  if (is.function(x)) {
    x <- do.call(x, list())
  }

  stopifnot(inherits(x, "block"))

  # TODO: stop doing this and track info on stack level
  attr(x, "position") <- pos
  attr(x, "name") <- nme

  if (is.null(dat)) {
    initialize_block(x)
  } else {
    initialize_block(x, dat)
  }
}

eval_stack <- function(x) {

  stopifnot(is_stack(x))

  if (!length(x)) {
    return(x)
  }

  temp <- evaluate_block(x[[1L]])

  for (i in seq_along(x)[-1L]) {
    temp <- evaluate_block(x[[i]], data = temp)
  }

  set_stack_result(x, temp)
}

set_stack_blocks <- function(stack, blocks, result) {
  stopifnot(is_stack(stack), is.list(blocks), all(lgl_ply(blocks, is_block)))

  attributes(blocks) <- attributes(stack)

  set_stack_result(blocks, result)
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

get_stack_result <- function(stack) {
  stopifnot(is_stack(stack))
  attr(stack, "result")
}

set_stack_result <- function(stack, value) {
  stopifnot(is_stack(stack))
  attr(stack, "result") <- value
  stack
}

clear_stack_result <- function(stack) {
  set_stack_result(stack, NULL)
}

#' @param x An object inheriting form `"stack"`
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
  if (length(x) == 0) {
    return(quote(identity()))
  }

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

  if (is.null(position) || position > length(stack)) {
    position <- length(stack)
  }

  if (position < 1L) {
    position <- 1L
  }

  log_debug("ADD BLOCK (position ", position + 1, ")")

  stopifnot(is_count(position))

  if (position == length(stack)) {
    data <- get_stack_result(stack)
  } else {
    data <- NULL
  }

  if (is.null(data) && length(stack) > 0L) {

    data <- evaluate_block(stack[[1L]])

    if (position > 1L) {
      for (i in seq.int(2L, position)) {
        data <- evaluate_block(stack[[i]], data = data)
      }
    }
  }

  if (!length(stack)) {

    tmp <- initialize_block(
      do.call(block, list())
    )

  } else {

    tmp <- initialize_block(
      do.call(block, list(position = position)),
      data
    )
  }

  set_stack_blocks(stack, append(stack, list(tmp), position), data)
}

#' Find stack compatible blocks
#'
#' Given a stack, we use the registry to find
#' what are the blocks compatible with the last stack block.
#' If the stack is empy, we return data blocks.
#'
#' @param stack Stack object.
#'
#' @return a dataframe.
#'
#' @export
get_compatible_blocks <- function(stack) {
  registry <- get_registry()
  # Only data blocks can be used for a 0 length stack
  if (length(stack) == 0) return(registry[registry$category == "data", ])
  # Otherwise we compare the output of the last block
  # and propose any of the block that have compatible input
  last_blk <- available_blocks()[[class(stack[[length(stack)]])[1]]]
  last_blk_output <- attr(last_blk, "output")

  registry[
    registry$category != "data" &
    registry$input == last_blk_output, ]
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
