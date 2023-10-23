#' @rdname new_block
#' @export
new_cheat_block <- function(data, ...) {
  new_block(
    fields = list(
      dummy = new_string_field("dummy")
    ),
    expr = quote({
      dplyr::filter(data, LBTEST == "Hemoglobin") %>%
        dplyr::filter(!startsWith(VISIT, "UNSCHEDULED")) %>%
        dplyr::arrange(VISITNUM) %>%
        dplyr::mutate(VISIT = factor(
          VISIT,
          levels = unique(VISIT),
          ordered = TRUE
        )) %>%
        dplyr::group_by(VISIT, ACTARM) %>%
        dplyr::summarise(
          Mean = mean(LBSTRESN, na.rm = TRUE),
          SE = sd(LBSTRESN, na.rm = TRUE) / sqrt(dplyr::n()),
          .groups = "drop"
        ) %>%
        dplyr::rowwise() %>%
        dplyr::mutate(ymin = Mean - SE, ymax = Mean + SE)
    }),
    ...,
    class = c("cheat_block", "transform_block")
  )
}

#' @rdname new_block
#' @export
cheat_block <- function(data, ...) {
  initialize_block(new_cheat_block(data, ...), data)
}

#' @rdname new_block
#' @param expr Pass mutate expression.
#' This will be hardcoded but we can't do better
#' at the moment. Not used yet...
#' @export
new_mutate_block <- function(data, expr = NULL, ...) {

  mutate_expr <- function(data) {

    if (!("VISIT" %in% colnames(data))) {
      return(NULL)
    }

    bquote(
      dplyr::mutate(
        VISIT = factor(
          .(column),
          levels = unique(.(column)),
          ordered = TRUE
        )
      ),
      list(column = as.name("VISIT"))
    )
  }

  fields <- list(
    expression = new_hidden_field(mutate_expr)
  )

  new_block(
    fields = fields,
    expr = quote(.(expression)),
    ...,
    class = c("mutate_block", "transform_block")
  )
}

#' @rdname new_block
#' @export
mutate_block <- function(data, ...) {
  initialize_block(new_mutate_block(data, ...), data)
}
