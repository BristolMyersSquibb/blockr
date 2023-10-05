library(shinytest2)

test_that("{shinytest2} recording: simple", {
  app <- AppDriver$new(
    "inst/examples/simple",
    variant = platform_variant(),
    name = "simple",
    height = 859,
    width = 1001
  )

  values <- app$get_values()
  expect_equal(values$input[["stack-add"]], 0)
  expect_equal(values$input[["stack-dataset-remove"]], 0)
  expect_equal(values$input[["stack-filter-remove"]], 0)

  # Init state
  stack <- isolate(app$get_values()$export[["stack-vals"]]$stack)
  expect_length(stack, 2)
  app$expect_values()

  app$click("stack-dataset-remove")
  app$expect_screenshot("remove-dataset", delay = 3)


  #app$set_inputs(`stack-last_changed` = c("stack-dataset-remove", "1", "shiny.action", 
  #    "shiny.actionButtonInput"), allow_no_input_binding_ = TRUE)
  #app$click("stack-dataset-remove")
  #app$set_inputs(`stack-last_changed` = c("stack-filter-values_Sepal.Length", 6.3, 
  #    7.9, "", "shiny.sliderInput"), allow_no_input_binding_ = TRUE)
  #app$set_inputs(`stack-filter-values_Sepal.Length` = c(6.3, 7.9))
  #app$set_inputs(`stack-last_changed` = c("stack-filter-values_Sepal.Length", 6.3, 
  #    7.9, "", "shiny.sliderInput"), allow_no_input_binding_ = TRUE)
  #app$expect_screenshot()
  #app$set_inputs(`stack-last_changed` = c("stack-filter-remove", "1", "shiny.action", 
  #    "shiny.actionButtonInput"), allow_no_input_binding_ = TRUE)
  #app$click("stack-filter-remove")
  #app$expect_screenshot()
  #app$set_inputs(`stack-last_changed` = c("stack-dataset-dataset", "freeny", "", 
  #    "shiny.selectInput"), allow_no_input_binding_ = TRUE)
  #app$set_inputs(`stack-dataset-dataset` = "freeny")
  #app$set_inputs(`stack-last_changed` = c("stack-dataset-dataset", "chickwts", "", 
  #    "shiny.selectInput"), allow_no_input_binding_ = TRUE)
  #app$set_inputs(`stack-dataset-dataset` = "chickwts")
  #app$set_inputs(`stack-last_changed` = c("stack-dataset-remove", "2", "shiny.action", 
  #    "shiny.actionButtonInput"), allow_no_input_binding_ = TRUE)
  #app$click("stack-dataset-remove")
  #app$set_inputs(`stack-last_changed` = c("stack-add", "1", "shiny.action", "shiny.actionButtonInput"), 
  #    allow_no_input_binding_ = TRUE)
  #app$click("stack-add")
  #app$set_inputs(`stack-last_changed` = c("stack-dataset-remove", "0", "shiny.action", 
  #    "shiny.actionButtonInput"), allow_no_input_binding_ = TRUE)
  #app$click("stack-dataset-remove")
  #app$set_inputs(`stack-last_changed` = c("stack-dataset-dataset", "iris", "", "shiny.selectInput"), 
  #    allow_no_input_binding_ = TRUE)
  #app$set_inputs(`stack-dataset-dataset` = "iris")
  #app$expect_screenshot()
})
