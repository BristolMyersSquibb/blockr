#' @keywords internal
"_PACKAGE"

# Suppress R CMD check note
# Namespace in Imports field not imported from: PKG
#   All declared Imports should be used.
ignore_unused_imports <- function() {
  blockr.ggplot::new_ggplot_block
  blockr.dplyr::new_mutate_block
  blockr.io::new_read_block
  blockr.ai::new_llm_transform_block
}

blockr_pkgs <- paste0(
  "blockr.",
  c("core", "dock", "dag", "dplyr", "ggplot", "io", "ai")
)
