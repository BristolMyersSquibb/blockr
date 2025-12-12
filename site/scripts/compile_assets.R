#!/usr/bin/env Rscript

gh_raw_file_url <-function(pkg, file) {
  paste0(
    "https://raw.githubusercontent.com/BristolMyersSquibb/",
    pkg,
    "/main/",
    file
  )
}

convert_vignette <- function(file, target, title, pkg = NULL) {

  if (is.null(pkg)) {

    source <- file.path("vignettes", file)

  } else {

    source <- tempfile()
    on.exit(unlink(source))

    url <- gh_raw_file_url(pkg, paste0("vignettes/", file))

    stopifnot(download.file(url, source) == 0L)
  }

  stopifnot(file.exists(source))

  cli::cli_alert_info("Converting {file} to Quarto format")

  lines <- readLines(source, warn = FALSE)

  yaml_end <- which(lines == "---")

  stopifnot(length(yaml_end) >= 2L)

  yaml_end <- yaml_end[2L]

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

  lines <- c(new_yaml, lines[seq.int(yaml_end + 1L, length(lines))])

  lines <- gsub(
    "../man/figures/",
    gh_raw_file_url(if (is.null(pkg)) "blockr" else pkg, "man/figures/"),
    lines,
    fixed = TRUE
  )

  lines <- gsub('out.width="100%"', 'out.width="50%"', lines, fixed = TRUE)

  if (!dir.exists(dirname(target))) {
    dir.create(dirname(target))
  }

  writeLines(lines, target)

  cli::cli_alert_success("Created {basename(target)}")
}

dest <- "site/_assets"

if (dir.exists(dest)) {
  unlink(dest, recursive = TRUE)
}

dir.create(dest)

file.copy(list.files(file.path("site", "assets"), full.names = TRUE), dest)

vignettes <- list(
  list(
    file = "intro.qmd",
    target = file.path(dest, "index.qmd"),
    title = "Welcome to blockr"
  ),
  list(
    file = "blockr.qmd",
    target = file.path(dest, "working-with-blockr.qmd"),
    title = "Welcome to blockr"
  ),
  list(
    file = "install.qmd",
    target = file.path(dest, "installation.qmd"),
    title = "Welcome to blockr"
  ),
  list(
    file = "blockr-dplyr-showcase.Rmd",
    target = file.path(dest, "showcase", "dplyr.qmd"),
    title = "Data wrangling blocks",
    pkg = "blockr.dplyr"
  ),
  list(
    file = "blockr-ggplot-showcase.Rmd",
    target = file.path(dest, "showcase", "ggplot.qmd"),
    title = "Data visualization blocks",
    pkg = "blockr.ggplot"
  ),
  list(
    file = "blockr-io-showcase.Rmd",
    target = file.path(dest, "showcase", "io.qmd"),
    title = "File I/O blocks",
    pkg = "blockr.io"
  )
)

for (vignette in vignettes) {
  do.call(convert_vignette, vignette)
}
