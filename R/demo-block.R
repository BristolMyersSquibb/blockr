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
  y = data(package = "blockr.data")$result[, "Item"],
  type = c("inner", "left"),
  ...
) {
  # by depends on selected dataset and the input data.
  by_choices <- function(data, y) {
    choices <- intersect(
      colnames(data),
      colnames(eval(as.name(y)))
    )

    # TO DO: currently, validate_field.list_field don't work
    # if we don't return a list.
    list(
      val = new_select_field(
        choices[[1]],
        choices,
        multiple = TRUE
      )
    )
  }

  # TO LATER
  join_expr <- function(data) {
    # try to build expression within function
    # like in filter_block
  }

  fields <- list(
    join_func = new_select_field(
      "left_join",
      paste(type, "join", sep = "_")
    ),
    y = new_select_field(y[[1]], y),
    by = new_list_field(sub_fields = by_choices)
  )

  attr(fields$y, "type") <- "name"
  # TO DO: expression is ugly: try to get rid of get and
  # unlist.
  expr <- quote(
    get(.(join_func))(y = .(y), by = unlist(.(by), use.names = FALSE))
  )

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
