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
#' @param data Input data coming from previous block.
#' @param y Second data block.
#' @param type Join type.
#' @export
new_join_block <- function(
  data,
  y = data(package = "blockr.data")$result[, "Item"][[2]],
  type = c("inner", "left"),
  ...
) {
  # TO DO: this should be a dependent field.
  # Once y is selected ...
  by_choices <- intersect(
    colnames(data),
    colnames(eval(as.name(y)))
  )

  fields <- list(
    join_func = new_select_field(
      "left_join",
      paste(type, "join", sep = "_")
    ),
    y = new_hidden_field(y[[1]]),
    by = new_select_field(
      by_choices[[1]],
      by_choices,
      multiple = TRUE
    )
  )

  attr(fields$y, "type") <- "name"
  # TO DO: find a way to not call match.fun ...
  expr <- quote(match.fun(.(join_func))(.(y), by = .(by)))

  new_block(
    fields = fields,
    expr = expr,
    ...,
    class = c("join_block", "transform_block")
  )
}

#' @rdname new_block
#' @export
join_block <- function(data, ...) {
  initialize_block(new_join_block(data, ...), data)
}
