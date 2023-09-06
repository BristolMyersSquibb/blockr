#' UI
#'
#' Generic for UI generation
#'
#' @param x Object for which to generate UI components
#' @param ... Generic consistency
#'
#' @export
generate_server <- function(x, ...) {
  UseMethod("generate_ui")
}

#' @param id UI IDs
#' @rdname generate_server
#' @export
generate_server.block <- function(x, id, ...) {

  fields <- get_field_names(x)

  shiny::moduleServer(
    id,
    function(input, output, session) {

      blk <- shiny::reactive(
        set_field_values(x, fields, input[fields])
      )

      dat <- shiny::reactive(
        evalute_block(blk(), ...)
      )

      cod <- shiny::reactive(
        generate_code(blk())
      )

      output$data <- shiny::renderPrint(dat())
      output$code <- shiny::renderPrint(cat(cod()))

      dat
    }
  )
}

#' @rdname generate_server
#' @export
generate_server.stack <- function(x, id, ...) {

  stopifnot(...length() == 0L)

  shiny::moduleServer(
    id,
    function(input, output, session) {

      res <- vector("list", length(x))

      res[[1L]] <- generate_server(
        x[[1L]],
        id = names(x)[1L]
      )

      for (i in seq_along(x)[-1L]) {

        res[[i]] <- generate_server(
          x[[i]],
          id = names(x)[i],
          data = res[[i - 1L]]()
        )
      }

      res
    }
  )
}
