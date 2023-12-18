



multi_module_server <- function(id) {
  moduleServer(id, function(input, output, session) {
    ns <- session$ns


    select_module_server(id)

    r_result <- reactiveVal(value = NULL)
    # observeEvent(input$i_submit, {
    #   r_result(get_exprs("pl_", input, garbage = r_rms_garbage()))
    # })


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
        ui = select_module_ui(ns(next_pl)),
        where = "beforeEnd",
        session = session
      )

      aceAutocomplete(paste0(next_pl, "_val"))
      aceTooltip(paste0(next_pl, "_val"))
    })

    r_result # return 'namedchar'
  })
}



multi_module_ui <- function(id, init = NULL) {
    ns <- NS(id)

  div(
    div(
      id = ns("pls")
      # init
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




# ?selectInput
ui <- bslib::page_fluid(
  multi_module_ui("m1", init = list(choices = c("A", "B"), selected = "A")),
  verbatimTextOutput("o_result")
)
server <- function(input, output) {
  r_result <- multi_module_server("m1")
  output$o_result <- renderPrint({
    r_result()
  })
}
# Run the application
shinyApp(ui = ui, server = server)





