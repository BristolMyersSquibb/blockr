#' @param data Tabular data in which to select some columns.
#' @param columns Column(s) to select.
#' @param value Intial value for muate block
#' @rdname new_block
#' @export
new_mutate_block <- function(data, value = NULL, ...) {
  fields <- list(
    value = new_namedchar_field(value = value)
  )

  new_block(
    fields = fields,
    expr = mutate_expr(value = value),
    ...,
    class = c("mutate_block", "transform_block")
  )
}


# Build mutate expression based on a named character vector
#
# mutate_expr(value = c(a = "2.1", b = "4.5"))
# mutate_expr(value = c(a = '""'))
# mutate_expr(value = character(0))
# mutate_expr(value = NULL)
mutate_expr <- function(value = c(a = "2.1", b = "4.5")) {
  if (is.null(value)) {
    return(quote(dplyr::mutate()))
  }
  stopifnot(inherits(value, "character"))

  parse_one <- function(text) {
    expr <- try(parse(text = text))
    if (inherits(expr, "try-error")) {
      expr <- expression()
    }
    expr
  }

  exprs <- do.call(c, lapply(value, parse_one))

  bquote(
    dplyr::mutate(..(exprs)),
    list(exprs = exprs),
    splice = TRUE
  )
}

generate_server.mutate_block <- function(x, in_dat, id, ...) {
  moduleServer(
    id,
    function(input, output, session) {
      ns <- session$ns

      # not the same as the init value
      r_value <- ace_module_server(id)

      # only update on init! Init value is in x
      output$value <- renderUI(ace_module_ui(ns(id), exprs_init = value(x$value, "value")))

      r_blk <- reactiveVal(x)

      # rather than input, I want the fields to be updated on r_value()
      o <- observeEvent(
        r_value(), # triggered by module output change
        {
          # 1. Update Block, set field
          blk_updated <- update_fields(
            r_blk(), session,
            in_dat(),
            value = r_value()
          )

          attr(blk_updated, "expr") <- mutate_expr(r_value())
          r_blk(blk_updated)

          # 2. Sync UI  (dont think this belongs with update block...)
          # FIXME where to get 'value' id from
          # output$value <- renderUI(ace_module_ui(ns("mmmm1"), exprs_init = value))
        },
        ignoreInit = FALSE
      )

      out_dat <- reactive(
        # 3. Update Data
        evaluate_block(r_blk(), data = in_dat())
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
        remove_shiny_inputs(input)
        o$destroy()
        session$userData$is_cleaned(TRUE)
      })

      out_dat
    }
  )
}


update_fields.mutate_block <- function(x, session, data, ...) {
  args <- list(...)

  stopifnot(setequal(names(args), names(x)))

  for (field in names(x)) {
    env <- c(
      list(data = data),
      args[-which(names(args) == field)]
    )

    x[[field]] <- update_field(x[[field]], args[[field]], env)

    # 2. Sync UI  (dont think this belongs with update block...)
    # FIXME think about role of UI sync...
    # ui_update(x[[field]], session, field, field)
  }

  x
}


#' @rdname new_block
#' @export
mutate_block <- function(data, ...) {
  initialize_block(new_mutate_block(data, ...), data)
}
