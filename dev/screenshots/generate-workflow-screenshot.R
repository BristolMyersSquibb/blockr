#' Generate workflow screenshot for blockr documentation
#'
#' Creates a screenshot showing a complete workflow with the sidebar visible,
#' demonstrating Import Data -> Filter -> Select -> ggplot pipeline.
#'
#' Usage:
#'   source("dev/screenshots/generate-workflow-screenshot.R")
#'
#' Output:
#'   docs/images/workflow-example.png

# Set environment for shinytest2
Sys.setenv(NOT_CRAN = "true")

# Load required packages
library(shinytest2)
library(blockr.core)
library(blockr.dock)
library(blockr.dag)
library(blockr.dplyr)
library(blockr.ggplot)
library(blockr.io)

# Configuration
SCREENSHOT_WIDTH <- 1400
SCREENSHOT_HEIGHT <- 900  # Taller to show plot
SCREENSHOT_DELAY <- 6  # Increased to allow data to flow through pipeline

# Create output directory
output_dir <- "docs/images"
if (!dir.exists(output_dir)) {
  dir.create(output_dir, recursive = TRUE)
}

output_path <- file.path(output_dir, "workflow-example.png")

cat("Generating workflow screenshot...\n")

# Create temporary app directory
temp_dir <- tempfile("blockr_workflow_")
dir.create(temp_dir)

# Create the workflow app
# Dataset -> Filter -> Select -> ggplot + Export
app_content <- '
library(blockr.core)
library(blockr.dock)
library(blockr.dag)
library(blockr.dplyr)
library(blockr.ggplot)
library(blockr.io)

# Workflow: Dataset -> Filter -> Select -> ggplot, with Export branching from Select
blockr.core::serve(

  blockr.dock::new_dock_board(
    blocks = c(
      data = blockr.core::new_dataset_block("mtcars", package = "datasets"),
      filter = blockr.dplyr::new_filter_block(
        conditions = list(
          list(column = "cyl", values = c(4, 6), mode = "include")
        )
      ),
      select = blockr.dplyr::new_select_block(
        columns = c("mpg", "hp", "wt", "cyl")
      ),
      export = blockr.io::new_write_block(),
      plot = blockr.ggplot::new_ggplot_block(
        type = "point",
        x = "wt",
        y = "mpg",
        color = "cyl"
      )
    ),
    links = list(
      from = c("data", "filter", "select", "select"),
      to = c("filter", "select", "export", "plot"),
      input = c("data", "data", "...", "data")
    ),
    extensions = blockr.dag::new_dag_extension()
  )
)
'

writeLines(app_content, file.path(temp_dir, "app.R"))

# Launch and screenshot
tryCatch({
  app <- shinytest2::AppDriver$new(
    app_dir = temp_dir,
    name = "workflow_screenshot"
  )

  app$set_window_size(width = SCREENSHOT_WIDTH, height = SCREENSHOT_HEIGHT)
  Sys.sleep(SCREENSHOT_DELAY)

  # Try to fit view and zoom out a bit to show all blocks
  # The graph uses G6 library with HTMLWidgets
  tryCatch({
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
      }
    ")
    Sys.sleep(0.5)
  }, error = function(e) {
    cat("Could not adjust zoom:", e$message, "\n")
  })

  # Click on the Ggplot tab to show that block in the right panel
  tryCatch({
    app$run_js("
      // Find and click the Ggplot tab
      var tabs = document.querySelectorAll('.dv-default-tab');
      for (var i = 0; i < tabs.length; i++) {
        var tabText = tabs[i].textContent || tabs[i].innerText;
        if (tabText.includes('Ggplot')) {
          tabs[i].click();
          break;
        }
      }
    ")
    Sys.sleep(1)  # Wait longer for tab switch
  }, error = function(e) {
    cat("Could not click Ggplot tab:", e$message, "\n")
  })

  # Remove existing file if present
  if (file.exists(output_path)) {
    file.remove(output_path)
  }

  app$get_screenshot(output_path)
  app$stop()

  if (file.exists(output_path)) {
    cat(sprintf("[SUCCESS] Screenshot saved to: %s\n", output_path))
  } else {
    cat("[ERROR] Screenshot file was not created\n")
  }
}, error = function(e) {
  cat(sprintf("[ERROR] %s\n", e$message))
})

# Cleanup
unlink(temp_dir, recursive = TRUE)
