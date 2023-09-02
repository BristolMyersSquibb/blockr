#' Stacks
#'
#' A set of blocks can be assembled into a stack.
#'
#' @param ... An ordered set of blocks (each argument is required to inherit
#' from `"block"`)
#'
#' @export
new_stack <- function(...) {

  blocks <- list(...)

  stopifnot(
    is.list(blocks), length(blocks) >= 1L, all(lgl_ply(blocks, is_block))
  )

	structure(blocks, class = "stack")
}

#' @param stack An object inheriting form `"stack"`
#' @rdname new_stack
#' @export
stack_server_generator <- function(stack) {
  function(input, output, session) {
    NULL
  }
}

#' @rdname new_stack
#' @export
serve_stack <- function(stack) {
  shiny::shinyApp(
    ui = generate_ui(stack),
    server = stack_server_generator(stack)
  )
}
