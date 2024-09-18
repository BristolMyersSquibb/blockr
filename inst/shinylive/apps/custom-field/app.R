webr::install("blockr", repos = c("https://bristolmyerssquibb.github.io/webr-repos", "https://repo.r-wasm.org"))

library(blockr)

new_slider_field <- function(
    value = numeric(),
    min = numeric(),
    max = numeric(),
    step = numeric(),
    ...) {
  blockr::new_field(
    value = value,
    min = min,
    max = max,
    step = step,
    ...,
    class = "slider_field"
  )
}

ui_input.slider_field <- function(x, id, name) {
  shiny::sliderInput(
    blockr::input_ids(x, id),
    name,
    value = blockr::value(x, "value"),
    min = blockr::value(x, "min"),
    max = blockr::value(x, "max"),
    step = blockr::value(x, "step")
  )
}

validate_field.slider_field <- function(x) {
  val <- value(x)
  min <- value(x, "min")
  max <- value(x, "max")
  step <- value(x, "step")

  validate_number(val)

  if (length(min)) {
    validate_number(min, "min")
  }

  if (length(max)) {
    validate_number(max, "max")
  }

  if (length(step)) {
    validate_number(step, "step")
  }

  NextMethod()
}

ui_update.slider_field <- function(x, session, id, name) {
  updateSliderInput(
    session,
    blockr::input_ids(x, id),
    name,
    blockr::value(x),
    blockr::value(x, "min"),
    blockr::value(x, "max"),
    blockr::value(x, "step")
  )
}

registerS3method("ui_input", "slider_field", ui_input.slider_field)
registerS3method("ui_update", "slider_field", ui_update.slider_field)

new_slice_block <- function(from = 0, ...) {

  n_rows <- \(data) nrow(data)

  fields <- list(
    rows = new_slider_field(
      value = from,
      min = 0,
      max = n_rows,
      step = 1,
      title = "Select rows"
    )
  )

  new_block(
    fields = fields,
    expr = quote(dplyr::slice(seq_len(.(rows)))),
    name = "Slider slice block",
    ...,
    class = c("slice_block", "transform_block")
  )
}

serve_stack(
  new_stack(
    new_dataset_block("iris"),
    new_slice_block(5)
  )
)
