#!/usr/bin/env Rscript

# Pull vignettes from blockr.dplyr and blockr.io packages
# This script copies showcase vignettes and converts them to Quarto format

library(fs)

# Define paths
blockr_root <- here::here()
docs_dir <- file.path(blockr_root, "docs", "showcase")

# Source packages (assuming they're siblings to blockr)
blockr_dplyr_path <- file.path(dirname(blockr_root), "blockr.dplyr")
blockr_ggplot_path <- file.path(dirname(blockr_root), "blockr.ggplot")
blockr_io_path <- file.path(dirname(blockr_root), "blockr.io")

# Vignette files to pull
vignettes <- list(
  dplyr = list(
    source = file.path(blockr_dplyr_path, "vignettes", "blockr-dplyr-showcase.Rmd"),
    target = file.path(docs_dir, "dplyr.qmd"),
    title = "Data Wrangling Blocks"
  ),
  ggplot = list(
    source = file.path(blockr_ggplot_path, "vignettes", "blockr-ggplot-showcase.Rmd"),
    target = file.path(docs_dir, "ggplot.qmd"),
    title = "Data Visualization Blocks"
  ),
  io = list(
    source = file.path(blockr_io_path, "vignettes", "blockr-io-showcase.Rmd"),
    target = file.path(docs_dir, "io.qmd"),
    title = "File I/O Blocks"
  )
)

# Function to convert Rmd vignette to Quarto qmd
convert_rmd_to_qmd <- function(source, target, title) {
  if (!file.exists(source)) {
    cli::cli_alert_warning("Source file not found: {source}")
    return(FALSE)
  }

  cli::cli_alert_info("Converting {basename(source)} to Quarto format")

  # Read the Rmd file
  lines <- readLines(source, warn = FALSE)

  # Find and replace YAML header
  yaml_start <- which(lines == "---")[1]
  yaml_end <- which(lines == "---")[2]

  if (!is.na(yaml_start) && !is.na(yaml_end)) {
    # Create new Quarto-style YAML header
    new_yaml <- c(
      "---",
      paste0("title: \"", title, "\""),
      "format:",
      "  html:",
      "    toc: true",
      "    toc-depth: 3",
      "    code-fold: false",
      "execute:",
      "  echo: false",
      "  warning: false",
      "  message: false",
      "---"
    )

    # Replace old YAML with new
    lines <- c(new_yaml, lines[(yaml_end + 1):length(lines)])
  }

  # Fix image paths - replace ../man/figures/ with GitHub raw URLs
  pkg_name <- names(which(sapply(vignettes, function(x) x$source == source)))
  github_url <- paste0("https://raw.githubusercontent.com/BristolMyersSquibb/blockr.", pkg_name, "/main/man/figures/")
  lines <- gsub("../man/figures/", github_url, lines, fixed = TRUE)

  # Set image width to 50%
  lines <- gsub('out.width="100%"', 'out.width="50%"', lines, fixed = TRUE)

  # Write to target
  writeLines(lines, target)
  cli::cli_alert_success("Created {basename(target)}")

  return(TRUE)
}

# Process each vignette
cli::cli_h1("Pulling vignettes from blockr packages")

success <- TRUE
for (pkg_name in names(vignettes)) {
  vig <- vignettes[[pkg_name]]
  result <- convert_rmd_to_qmd(vig$source, vig$target, vig$title)
  if (!result) success <- FALSE
}

if (success) {
  cli::cli_alert_success("All vignettes pulled successfully!")
} else {
  cli::cli_alert_danger("Some vignettes could not be pulled. Check warnings above.")
}

cli::cli_alert_info("Images are referenced from GitHub - no local copies needed")
cli::cli_alert_info("Run 'quarto preview docs' to preview the website")
