#' Block download generic
#'
#' Generic to create the block download button.
#'
#' @inheritParams ui_fields
#' @rdname block_download_ui
#' @export
block_download_ui <- function(x, ...) {
  UseMethod("block_download_ui", x)
}

#' @rdname block_download_ui
#' @export
block_download_ui.default <- function(x, ns, inputs_hidden, ...) {
  tagList()
}

#' @rdname block_download_ui
#' @export
block_download_ui.transform_block <- function(x, ns, inputs_hidden, ...) {
  id <- ns("download")

  downloadLink(
    outputId = id,
    class = sprintf("cursor-pointer text-decoration-none block-download %s", inputs_hidden),
    iconDownload()
  )
}

#' @rdname block_download_ui
#' @export
block_download_ui.data_block <- block_download_ui.transform_block

block_download <- function(x, ...) {
  UseMethod("block_download", x)
}

#' @export
block_download.default <- function(x, ...) {}

#' @export
block_download.block <- function(x, session, data, ...) {
  session$output$download <- downloadHandler(
    filename = function() {
      ext <- ".csv"
      if (!is.data.frame(data()))
        ext <- "json"

      paste0(
        attr(x, "name"),
        "-block",
        ext
      )
    },
    content = function(file) {
      if (!is.data.frame(data()))
        jsonlite::write_json(data(), file)
      else
        utils::write.csv(data(), file, row.names = FALSE)
    }
  )
}

#' @importFrom shiny icon
iconDownload <- function() {
  icon("download")
}
