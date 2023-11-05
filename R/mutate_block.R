#' @param data Tabular data in which to select some columns.
#' @param columns Column(s) to select.
#' @rdname new_block
#' @export
new_mutate_block <- function(data, value = c(a = "bla", b = "blabla"), ...) {
  # all_cols <- function(data) colnames(data)

  mutate_expr <- function(data, value) {

    parse_one <- function(text) {
      expr <- try(parse(text = text))
      if (inherits(expr, "try-error")) {
        expr <- expression()
      }
      expr
    }

    value = c(a = "bla", b = "blabla")

    exprs <- setNames(parse_one("2 * Time"), "a")

    ans <- bquote(
      dplyr::mutate(..(exprs)),
      list(exprs = exprs),
      splice = TRUE
    )

    ans
  }

  fields <- list(
    # value = new_string_field(value = value),
    value = new_pairlists_field(value = value),
    expression = new_hidden_field(mutate_expr)
  )

  new_block(
    fields = fields,
    expr = quote(.(expression)),
    ...,
    class = c("mutate_block", "transform_block")
  )
}



generate_server.mutate_block <- function(x, in_dat, id, ...) {
  obs_expr <- function(x) {
    splice_args(
      list(in_dat(), ..(args)),
      args = lapply(unlst(input_ids(x)), quoted_input_entry)
    )
  }

  set_expr <- function(x) {
    splice_args(
      blk(update_fields(blk(), session, in_dat(), ..(args))),
      args = rapply(input_ids(x), quoted_input_entries, how = "replace")
    )
  }

  moduleServer(
    id,
    function(input, output, session) {

      ns <- session$ns

      r_value <- ace_module_server("value")

      blk <- reactiveVal(x)

      # rather than input, I want the fields to be updated on r_value()
      o <- observeEvent(
        # eval(obs_expr(blk())),
        # secure(eval(set_expr(blk()))),
        r_value(),
        {

          parse_one <- function(text) {
            expr <- try(parse(text = text))
            if (inherits(expr, "try-error")) {
              expr <- expression()
            }
            expr
          }

          # Get error in `vec_size()`: `x` must be a vector, not an expression vector.
          # exprs <- setNames(lapply(r_value(), \(x) parse(text = x)), names(r_value()))


          exprs <- setNames(parse_one(text = r_value()[1]), names(r_value())[1])

          expr <- bquote(
            dplyr::mutate(..(exprs)),
            list(exprs = exprs),
            splice = TRUE
          )

          blk(
            update_fields(
              blk(), session, in_dat(), value = r_value(),
              expression = expr
            )
          )
        },
        ignoreInit = TRUE
      )

      out_dat <- reactive(

        evaluate_block(blk(), data = in_dat())
      )

      output$res <- server_output(x, out_dat, output)
      output$code <- server_code(x, blk, output)

      output$debug <- renderPrint({
        r_value()
      })

      output$nrow <- renderText({
        prettyNum(nrow(out_dat()), big.mark = ",")
      })

      output$ncol <- renderText({
        prettyNum(ncol(out_dat()), big.mark = ",")
      })

      # Cleanup module inputs (UI and server side)
      # and observer
      observeEvent(input$remove, {
        message(sprintf("CLEANING UP BLOCK %s", id))
        remove_shiny_inputs(id = id, input)
        o$destroy()
        session$userData$is_cleaned(TRUE)
      })

      out_dat
    }
  )
}





#' @rdname new_block
#' @export
mutate_block <- function(data, ...) {
  initialize_block(new_mutate_block(data, ...), data)
}
