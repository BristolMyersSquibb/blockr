#' @import blockr.core
#' @import blockr.dock
#' @import blockr.dag
#' @import blockr.dplyr
#' @import blockr.ggplot
#' @import blockr.io
#' @import blockr.ui
#' @import blockr.viz
#' @import blockr.dm
#' @import blockr.extra
#' @import blockr.ai
#' @import blockr.assistant
#' @import blockr.session
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
  c(
    "core", "dock", "dag", "dplyr", "ggplot", "io",
    "ui", "viz", "dm", "extra", "ai", "assistant", "session"
  )
)
