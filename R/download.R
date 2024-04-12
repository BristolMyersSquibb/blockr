#' Block download generic
#'
#' Generic to create the block download button.
#'
#' @inheritParams ui_fields
#' @rdname download_ui
#' @export
download_ui <- function(x, ...) {
  UseMethod("download_ui", x)
}

#' @rdname download_ui
#' @export
download_ui.block <- function(x, ns, inputs_hidden = FALSE, ...) {
  tagList()
}

#' @rdname download_ui
#' @export
download_ui.transform_block <- function(x, ns, inputs_hidden = FALSE, ...) {
  id <- ns("download")

  downloadLink(
    outputId = id,
    class = sprintf("cursor-pointer text-decoration-none block-download %s", inputs_hidden),
    iconDownload()
  )
}

#' @rdname download_ui
#' @export
download_ui.data_block <- download_ui.transform_block

#' @rdname download_ui
#' @export
download_ui.plot_block <- download_ui.transform_block

download <- function(x, ...) {
  UseMethod("download", x)
}

#' @export
download.block <- function(x, ...) {}

#' @export
download.transform_block <- function(x, session, object, ...) {
  session$output$download <- downloadHandler(
    filename = \() download_filename(x, object),
    content = \(file) download_content(x, object, file)
  )
}

#' @export
download.data_block <- download.transform_block

#' @export
download.plot_block <- function(x, session, object, ...) {
  session$output$download <- downloadHandler(
    filename = \() download_filename(x, object),
    content = \(file) download_content(x, object, file)
  )
}

download_content <- function(x, object, file, ...) {
  UseMethod("download_content", x)
}

#' @export
download_content.plot_block <- function(x, object, file, ...) {
  grDevices::png(filename = tempfile())
  object()
  grDevices::dev.off()
}

#' @export
download_content.transform_block <- function(x, object, file, ...) {
  if (!is.data.frame(object())) {
    jsonlite::write_json(object(), file)
  } else {
    utils::write.csv(object(), file, row.names = FALSE)
  }
}

#' @export
download_content.data_block <- download_content.transform_block

download_filename <- function(x, object, ...) {
  UseMethod("download_filename", x)
}

#' @export
download_filename.transform_block <- function(x, object, ...) {
  ext <- ".csv"
  if (!is.data.frame(object()))
    ext <- "json"

  paste0(
    attr(x, "name"),
    "-data",
    ext
  )
}

#' @export
download_filename.data_block <- download_filename.transform_block

#' @export
download_filename.plot_block <- function(x, object, ...) {
  paste0(
    attr(x, "name"),
    ".png"
  )
}

#' @importFrom shiny icon
iconDownload <- function() {
  icon("download")
}
