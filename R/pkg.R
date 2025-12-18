#' @import blockr.core
#' @import blockr.dock
#' @import blockr.dag
#' @import blockr.dplyr
#' @import blockr.ggplot
#'
#' @rawNamespace exportPattern("^new_[a-z_]+_block$")
#' @rawNamespace exportPattern("^new[a-z_]+_stack$")
#' @rawNamespace exportPattern("^new[a-z_]+_link$")
#' @rawNamespace exportPattern("^new[a-z_]+_board$")
#' @rawNamespace exportPattern("^new[a-z_]+_extension$")
#' @rawNamespace exportPattern("^(block|link|stack)s$")
#'
#' @keywords internal
"_PACKAGE"

blockr_pkgs <- paste0(
  "blockr.",
  c("core", "dock", "dag", "dplyr", "ggplot")
)
