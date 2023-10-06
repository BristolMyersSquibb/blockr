library(blockr)
library(ggplot2)
library(dplyr)

data_paths <- list(
  demo = "https://github.com/cdisc-org/sdtm-adam-pilot-project/raw/master/updated-pilot-submission-package/900172/m5/datasets/cdiscpilot01/tabulations/sdtm/dm.xpt",
  expo  = "https://github.com/cdisc-org/sdtm-adam-pilot-project/raw/master/updated-pilot-submission-package/900172/m5/datasets/cdiscpilot01/tabulations/sdtm/ex.xpt",
  lab = "https://github.com/cdisc-org/sdtm-adam-pilot-project/raw/master/updated-pilot-submission-package/900172/m5/datasets/cdiscpilot01/tabulations/sdtm/lb.xpt",
  ae = "https://github.com/cdisc-org/sdtm-adam-pilot-project/raw/master/updated-pilot-submission-package/900172/m5/datasets/cdiscpilot01/tabulations/sdtm/ae.xpt"
)

data <- lapply(data_paths, haven::read_xpt)

# Plot AGE distribution
ggplot(data$demo, aes(x = AGE)) +
  geom_histogram(binwidth = 5, fill = "blue", alpha = 0.7) +
  labs(title = "Distribution of Age", x = "Age (Years)", y = "Count") +
  theme_minimal() +
  scale_fill_brewer(palette = "Blues")

#Data manipulation layers
# Step 1: Merge the lb and dm datasets based on "STUDYID" and "USUBJID" columns
merged_data <- data$lab |>
  # Perform inner join on STUDYID and USUBJID
  inner_join(data$demo, by = c("STUDYID", "USUBJID"))

# Step 2: Filter for Hemoglobin test results and preprocess
hemoglobin_data <- merged_data |>
  filter(LBTEST == "Hemoglobin") |>  # Keep only the rows where LBTEST is "Hemoglobin"
  filter(!startsWith(VISIT, "UNSCHEDULED")) |>  # Remove rows with unscheduled visits
  arrange(VISITNUM) |> # Sort data by VISITNUM (visit number)
  mutate(VISIT = factor(VISIT, levels = unique(VISIT), ordered = TRUE))  # Convert VISIT to ordered factor


# Step 3: Compute summary statistics (Mean and SE) grouped by VISIT and ACTARM
summary_data <- hemoglobin_data %>%
  group_by(VISIT, ACTARM) %>%  # Group data by VISIT and ACTARM
  summarise(
    Mean = mean(LBSTRESN, na.rm = TRUE),  # Calculate the mean of LBSTRESN, ignoring NA values
    SE = sd(LBSTRESN, na.rm = TRUE) / sqrt(n()),  # Calculate the standard error
    .groups = "drop"  # Drop the grouping
  )

# Plot layer
# Step 4: Generate the ggplot
ggplot(summary_data, aes(x = VISIT, y = Mean)) +  # Base ggplot mapping VISIT to x-axis and Mean to y-axis
  geom_point(aes(color = ACTARM, shape = ACTARM), size = 3) +  # Add points colored and shaped by ACTARM
  geom_errorbar(aes(ymin = Mean - SE, ymax = Mean + SE, color = ACTARM), width = 0.2) +  # Add error bars
  geom_line(aes(group = ACTARM, color = ACTARM)) +  # Add lines connecting points within each ACTARM group
  labs(
    title = "Mean and SD of Hemoglobin by Visit",  # Add plot title
    x = "Visit Label",  # Label for the x-axis
    y = "Hemoglobin (g/dL)"  # Label for the y-axis
  ) +
  theme_minimal() +  # Apply minimal theme
  theme(
    axis.text.x = element_text(angle = 45, hjust = 1),  # Rotate x-axis text
    legend.title = element_text(face = "bold"),  # Make legend title bold
    legend.position = "bottom"  # Position legend at the bottom
  ) +
  scale_color_brewer(name = "Treatment Group", palette = "Set1") +  # Set color scheme for ACTARM
  scale_shape_manual(name = "Treatment Group", values = c(16, 17, 18, 19, 20))  # Manually set shape values