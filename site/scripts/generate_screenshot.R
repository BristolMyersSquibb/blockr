#!/usr/bin/env Rscript

Sys.setenv(NOT_CRAN = "true")

output_path <- file.path("man", "figures", "workflow-example.png")

if (!dir.exists(dirname(output_path))) {
  dir.create(dirname(output_path), recursive = TRUE)
}

if (file.exists(output_path)) {
  unlink(output_path)
}

suppressWarnings(
  app <- shinytest2::AppDriver$new(
    system.file("examples", "board", "app.R", package = "blockr"),
    name = "board",
    seed = 42,
    width = 1400,
    height = 900
  )
)

app$wait_for_idle()

app$run_js("
  // Find the G6 graph widget and call fitView, then zoom out 20%
  var g6Element = document.querySelector('.g6');
  if (g6Element) {
    var widget = HTMLWidgets.find('#' + g6Element.id);
    if (widget) {
      var graph = widget.getWidget();
      if (graph && graph.fitView) {
        graph.fitView();
        // Zoom out by 20% after fit
        var currentZoom = graph.getZoom();
        graph.zoomTo(currentZoom * 0.8);
      }
    }
  }"
)

app$get_screenshot(output_path)
app$stop()
