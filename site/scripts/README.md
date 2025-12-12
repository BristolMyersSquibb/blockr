# Screenshot Generation

This folder contains scripts for generating screenshots used in the blockr documentation.

## Usage

From the `blockr/` package root directory:

```r
source("dev/screenshots/generate-workflow-screenshot.R")
```

## Output

Screenshots are saved to `docs/images/`.

## Requirements

- shinytest2
- All blockr packages (blockr.core, blockr.dock, blockr.dag, blockr.dplyr, blockr.ggplot, blockr.io)

## What it generates

- `workflow-example.png` - A complete workflow showing Import Data -> Filter -> Select -> ggplot with the sidebar visible
