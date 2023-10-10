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

  blocks[[1L]] <- do.call(ctors[[1L]], list())
  temp <- evalute_block(blocks[[1L]])

  for (i in seq_along(ctors)[-1L]) {
    temp <- evalute_block(
      blocks[[i]] <- do.call(ctors[[i]], list(temp)),
      data = temp
    )
  }

  stopifnot(
    is.list(blocks), length(blocks) >= 1L, all(lgl_ply(blocks, is_block))
  )

  structure(blocks, name = name, class = "stack")
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
    stack[[length(stack) + 1]] <- do.call(
      block,
      list(stack[[length(stack)]])
    )
  } else {
    tmp <- do.call(
      block,
      list(stack[[position]])
    )
    stack <- append(stack, tmp, position)
  }
  invisible(stack)
}

#' @param stack An object inheriting form `"stack"`
#' @rdname new_stack
#' @export
serve_stack <- function(stack) {
  ui <- generate_ui(stack)

  server <- function(input, output, session) {
    generate_server(stack)
  }

  shinyApp(ui, server)
}
