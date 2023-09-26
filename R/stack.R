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

#' @param stack An object inheriting form `"stack"`
#' @rdname new_stack
#' @export
serve_stack <- function(stack) {

  ui <- generate_ui(stack)

  server <- function(input, output, session) {
    generate_server(stack)
  }

  shiny::shinyApp(ui, server)
}
