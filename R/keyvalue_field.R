#' Re-implement numeric_field, using server module
#'
#' @rdname keyvalue_field
#' @export
generate_server.keyvalue_field <- function(x) {
  function(id, init = NULL, data = NULL) {
    moduleServer(id, function(input, output, session) {
      ns <- session$ns

      aceAutocomplete("pl_1_val")
      aceTooltip("pl_1_val")

      r_result <- reactiveVal(value = NULL)
      observeEvent(input$i_submit, {
        r_result(get_exprs("pl_", input, garbage = r_rms_garbage()))
      })

      # remove namedchar UI on trash click
      r_rms_previous <- reactiveVal(integer())
      # store removed elements (since I cannot find a way to 'flush' input after
      # removing a UI element)
      r_rms_garbage <- reactiveVal(character())
      observe({
        rms <- get_rms("pl_", input, garbage = character())
        rms_previous <- isolate(r_rms_previous())
        nms_both <- intersect(names(rms), names(rms_previous))
        to_be_rm <- gsub("_rm$", "", nms_both[rms[nms_both] != rms_previous[nms_both]])
        if (length(to_be_rm) > 0) {
          removeUI(paste0("#", ns(to_be_rm)))
          # make sure it is not read again in the future
          r_rms_garbage(c(isolate(r_rms_garbage()), to_be_rm))
        }
        r_rms_previous(rms)
      })

      observeEvent(input$i_add, {
        pl_ints <-
          names(get_rms("pl_", input, garbage = r_rms_garbage())) |>
          gsub("_rm$", "", x = _) |>
          gsub("^pl_", "", x = _) |>
          as.integer()

        if (length(pl_ints) == 0) {
          # if everything is in garbage
          last_pl_int <- max(as.integer(gsub("^pl_", "", x = r_rms_garbage())))
        } else {
          last_pl_int <- max(pl_ints)
        }

        next_pl <- paste0("pl_", last_pl_int + 1L)
        insertUI(
          paste0("#", ns("pls")),
          ui = exprs_ui(ns(next_pl)),
          where = "beforeEnd",
          session = session
        )

        aceAutocomplete(paste0(next_pl, "_val"))
        aceTooltip(paste0(next_pl, "_val"))
      })

      r_result # return 'namedchar'
    })
  }
}

#' @rdname keyvalue_field
#' @export
ui_input.keyvalue_field <- function(x, id, name) {
  ns <- NS(input_ids(x, id))
  init <- exprs_ui(ns("pl_1"))
  div(
    div(
      id = ns("pls"),
      init
    ),
    div(
      style = "width: 100%; display: flex; justify-content: flex-end;",
      div(
        style = "margin: 0px;",
        class = "mb-5",
        actionButton(
          ns("i_add"),
          label = NULL,
          icon = icon("plus"),
          class = "btn btn-success",
          style = "margin-right: 7px"
        ),
        actionButton(
          ns("i_submit"),
          label = "Submit",
          icon = icon("paper-plane"),
          class = "btn btn-primary"
        )
      )
    )
  )
}

#' @rdname keyvalue_field
#' @export
new_keyvalue_field <- function(
    value = numeric(),
    ...) {
  new_field(value, class = "keyvalue_field")
}

#' @rdname keyvalue_field
#' @export
keyvalue_field <- function(...) {
  validate_field(new_keyvalue_field(...))
}

#' @rdname keyvalue_field
#' @export
validate_field.keyvalue_field <- function(x) {
  x
}


