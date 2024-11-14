webr::install("blockr", repos = c("https://bristolmyerssquibb.github.io/webr-repos", "https://repo.r-wasm.org"))
webr::install("blockr.pharmaverseadam", repos = c("https://bristolmyerssquibb.github.io/webr-repos", "https://repo.r-wasm.org"))

library(blockr)
library(dplyr)
library(tidyr)
library(forestplot)
library(blockr.pharmaverseadam)

# Function to create adverse event forest plot
create_ae_forest_plot <- function(data, usubjid_col, arm_col, aedecod_col, n_events) {
  data <- data |> filter(.data[[arm_col]] != "Placebo")
  # Convert column names to strings
  usubjid_col <- as.character(substitute(usubjid_col))
  arm_col <- as.character(substitute(arm_col))
  aedecod_col <- as.character(substitute(aedecod_col))

  # Calculate the total number of subjects in each arm
  n_subjects <- data |>
    select(all_of(c(usubjid_col, arm_col))) |>
    distinct() |>
    group_by(across(all_of(arm_col))) |>
    summarise(n = n(), .groups = "drop")

  # Calculate AE frequencies and proportions
  ae_summary <- data |>
    group_by(across(all_of(c(arm_col, aedecod_col)))) |>
    summarise(n_events = n_distinct(.data[[usubjid_col]]), .groups = "drop") |>
    left_join(n_subjects, by = arm_col) |>
    mutate(proportion = n_events / n)

  # Select top N most frequent AEs across all arms
  top_aes <- ae_summary |>
    group_by(across(all_of(aedecod_col))) |>
    summarise(total_events = sum(n_events), .groups = "drop") |>
    top_n(n_events, total_events) |>
    pull(all_of(aedecod_col))

  # Get unique treatment arms
  arms <- unique(data[[arm_col]])
  if (length(arms) != 2) {
    stop("This plot requires exactly two treatment arms.")
  }
  active_arm <- arms[1]
  control_arm <- arms[2]

  # Filter for top AEs and calculate relative risk
  ae_rr <- ae_summary |>
    filter(.data[[aedecod_col]] %in% top_aes) |>
    pivot_wider(
      id_cols = all_of(aedecod_col),
      names_from = all_of(arm_col),
      values_from = c(n_events, n, proportion)
    ) |>
    mutate(
      RR = .data[[paste0("proportion_", active_arm)]] / .data[[paste0("proportion_", control_arm)]],
      lower_ci = exp(log(RR) - 1.96 * sqrt(
        1 / .data[[paste0("n_events_", active_arm)]] +
          1 / .data[[paste0("n_events_", control_arm)]] -
          1 / .data[[paste0("n_", active_arm)]] -
          1 / .data[[paste0("n_", control_arm)]]
      )),
      upper_ci = exp(log(RR) + 1.96 * sqrt(
        1 / .data[[paste0("n_events_", active_arm)]] +
          1 / .data[[paste0("n_events_", control_arm)]] -
          1 / .data[[paste0("n_", active_arm)]] -
          1 / .data[[paste0("n_", control_arm)]]
      ))
    )

  # Prepare data for forest plot
  forest_data <- ae_rr |>
    mutate(
      label = paste0(
        .data[[aedecod_col]], " (",
        .data[[paste0("n_events_", active_arm)]], "/", .data[[paste0("n_", active_arm)]], " vs ",
        .data[[paste0("n_events_", control_arm)]], "/", .data[[paste0("n_", control_arm)]], ")"
      )
    )

  # Create forest plot
  forestplot(
    labeltext = cbind(
      forest_data$label,
      sprintf("%.2f (%.2f-%.2f)", forest_data$RR, forest_data$lower_ci, forest_data$upper_ci)
    ),
    mean = forest_data$RR,
    lower = forest_data$lower_ci,
    upper = forest_data$upper_ci,
    align = c("l", "r"),
    graphwidth = unit(60, "mm"),
    cex = 0.9,
    lineheight = unit(8, "mm"),
    boxsize = 0.35,
    col = fpColors(box = "royalblue", line = "darkblue", summary = "royalblue"),
    txt_gp = fpTxtGp(label = gpar(cex = 0.9), ticks = gpar(cex = 0.9), xlab = gpar(cex = 0.9)),
    xlab = paste("Relative Risk (", active_arm, " / ", control_arm, ")"),
    zero = 1,
    lwd.zero = 2,
    lwd.ci = 2,
    xticks = c(0.5, 1, 2, 4),
    grid = TRUE,
    title = paste("Relative Risk of Adverse Events (", active_arm, " vs ", control_arm, ")")
  )
}

new_forest_plot_block <- function(...) {
  new_block(
    fields = list(
      usubjid_col = new_select_field(
        "USUBJID",
        function(data) colnames(data),
        multiple = FALSE,
        title = "Subject ID Column"
      ),
      arm_col = new_select_field(
        "ACTARM",
        function(data) colnames(data),
        multiple = FALSE,
        title = "Treatment Arm Column"
      ),
      aedecod_col = new_select_field(
        "AEDECOD",
        function(data) colnames(data),
        multiple = FALSE,
        title = "AE Term Column"
      ),
      n_events = new_numeric_field(
        10,
        min = 5, max = 20, step = 1,
        title = "Number of Top AEs to Display"
      )
    ),
    expr = substitute({
      my_fun(data, .(usubjid_col), .(arm_col), .(aedecod_col), .(n_events))
    }, list(my_fun = create_ae_forest_plot)),
    class = c("adverse_event_plot_block", "plot_block"),
    ...
  )
}

block_input_check.plot_block <- function(x, data, ...) {

  if (inherits(data, "data.frame")) {
    return(invisible(NULL))
  }

  input_failure("Expecting data.frame input.")
}

block_output_ptype.plot_block <- function(x, ...) ggplot()

# Register the custom block
register_block(
  new_forest_plot_block,
  name = "Adverse Event Forest Plot",
  description = "Create a forest plot of adverse events comparing two treatment arms"
)

# Create the stack
clinical_trial_stack <- new_stack(
  new_adam_block(selected = "adae"),
  # filter_in_block(),
  new_forest_plot_block()
)

serve_stack(clinical_trial_stack)
