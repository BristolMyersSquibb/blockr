#' UI
#'
#' Generic for UI generation
#'
#' @param x Object for which to generate a [shiny::moduleServer()]
#' @param ... Generic consistency
#'
#' @export
generate_server <- function(x, ...) {
  UseMethod("generate_server")
}



#' Set field values of an object from a named input list
#'
#' This function sets the fields of an object `x` using values from a named input list `input`.
#' It assumes that the field names in `x` and the names in the input list `input` match.
#'
#' @param x An object with named fields that you want to update.
#' @param input A named list containing new values for the fields in `x`.
#'
#' @return An object with updated field values.
#' @export
#'
#' @examples
#' \dontrun{
#'   x <- new_filter_block(dat = iris)
#'   input <- list(column = "Species", value = "versicolor")
#'   set_field_values_from_input(x, input)
#' }
set_field_values_from_input <- function(x, input) {
  fields <- names(x)
  args <- lapply(setNames(fields, fields), \(x) input[[x]])
  args$x <- x
  do.call(set_field_values, args)
}




#' @param in_dat Forwarded to `evalute_block()`
#' @rdname generate_server
#' @export
generate_server.block <- function(x, in_dat = NULL, ...) {

  shiny::moduleServer(
    attr(x, "name"),
    function(input, output, session) {

      module_name <- sprintf("module %s %s", class(x)[[1]], attr(x, "name"))

      blk <- shiny::reactiveVal(x)

      data_upd_completed <- reactiveVal(FALSE)
      # 1. update block by data
      # This will never happen in the first block
      # because no data are passed ...
      if (not_null(in_dat)) {
        shiny::observeEvent(in_dat(), {
          message(sprintf("Update data in %s", module_name))
          inputs_updated(FALSE)
          blk_upd <- update_fields(blk(), data = in_dat(), session = session)
          blk(blk_upd)
          data_upd_completed(TRUE)
        })
      }

      old_hash <- reactiveVal(isolate(hash_input(input)))
      inputs_updated <- reactiveVal(FALSE)

      # 2. update block by input fields
      shiny::observeEvent({
        new_hash <- hash_input(input)
        input_changed <- old_hash() != new_hash
        if (input_changed) {
          old_hash(new_hash)
          message("Allowed to update inputs")
        }
        if (not_null(in_dat)) {
          # So that it runs once after update data
          # or whenever input is changed.
          # This will never run in the data module
          # since no data are passed.
          input_changed || req(data_upd_completed())
        } else {
          req(input_changed)
        }
      }, {
        #if ("filter_block" %in% class(x)) browser()
        message(sprintf("Update inputs in %s", module_name))
        blk_upd <- set_field_values_from_input(blk(), input)
        blk(blk_upd)
        data_upd_completed(FALSE)
        inputs_updated(TRUE)
      })

      if (is.null(in_dat)) {
        out_dat <- shiny::reactive(
          evalute_block(blk())
        )
      } else {
        out_dat <- shiny::reactive({
          evalute_block(blk(), data = in_dat())
        })
      }

      output$data <- shiny::renderPrint(out_dat())
      output$code <- shiny::renderPrint(
        cat(deparse(generate_code(blk())), sep = "\n")
      )

      out_dat
    }
  )
}

#generate_server.data_block <- function(x, ...) {
#  browser()
#}

#' @rdname generate_server
#' @export
generate_server.stack <- function(x, ...) {

  stopifnot(...length() == 0L)

  shiny::moduleServer(
    attr(x, "name"),
    function(input, output, session) {

      res <- vector("list", length(x))

      res[[1L]] <- generate_server(x[[1L]])

      for (i in seq_along(x)[-1L]) {
        res[[i]] <- generate_server(x[[i]], in_dat = res[[i - 1L]])
      }

      res
    }
  )
}
