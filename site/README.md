# blockr Documentation Website

This directory contains sources for the blockr user documentation.

```
site/
├── _quarto.yml          # Quarto configuration
├── index.qmd            # Home page
├── getting-started.qmd  # Installation and getting started
├── styles.css           # Custom CSS
├── custom.scss          # Custom SCSS theme
├── showcase/            # Showcase vignettes (auto-generated)
│   ├── dplyr.qmd       # Data wrangling blocks showcase
│   ├── io.qmd          # File I/O blocks showcase
│   └── figures/        # Images from packages
└── _site/               # Generated site (gitignored)
```

## Building the Site Locally

### Prerequisites

- [Quarto](https://quarto.org/docs/get-started/) installed
- R with required packages: `here`, `fs`, `cli`, `knitr`, `rmarkdown`

### Steps

1. Pull vignettes from blockr.dplyr and blockr.io:
   ```bash
   Rscript scripts/pull-vignettes.R
   ```

2. Preview the site:
   ```bash
   cd docs
   quarto preview
   ```

3. Or render the full site:
   ```bash
   cd docs
   quarto render
   ```

The rendered site will be in `docs/_site/`.

## Automatic Deployment

The site is automatically built and deployed to GitHub Pages when changes are pushed to the `main` branch via the `.github/workflows/quarto-publish.yml` workflow.

## Adding Content

### Add a New Page

1. Create a new `.qmd` file in the `docs/` directory
2. Add it to the sidebar in `_quarto.yml`
3. Push to trigger deployment

### Update Showcase Content

The showcase vignettes are pulled from the source packages:
- `blockr.dplyr` → `showcase/dplyr.qmd`
- `blockr.io` → `showcase/io.qmd`

To add more showcase vignettes:
1. Update `scripts/pull-vignettes.R` to include the new vignette
2. Add the new page to `_quarto.yml`
3. Run `Rscript scripts/pull-vignettes.R`

## Design Philosophy

This documentation site is designed for **users who don't code**. The focus is on:
- Visual examples with screenshots
- Step-by-step tutorials
- Clear, jargon-free language
- Practical use cases

Keep this audience in mind when adding content.
