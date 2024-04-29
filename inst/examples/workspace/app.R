# library(blockr)
devtools::load_all()

do.call(set_workspace, args = list(title = "My workspace"))

serve_workspace(clear = FALSE)
