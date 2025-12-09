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
# Step 3: Dataset -> Filter -> Select -> ggplot
app_content <- '
library(blockr.core)
library(blockr.dock)
library(blockr.dag)
library(blockr.dplyr)
library(blockr.ggplot)

# Workflow: Dataset -> Filter -> Select -> ggplot
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
      plot = blockr.ggplot::new_ggplot_block(
        type = "point",
        x = "wt",
        y = "mpg",
        color = "cyl"
      )
    ),
    links = list(
      from = c("data", "filter", "select"),
      to = c("filter", "select", "plot"),
      input = c("data", "data", "data")
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
