webr::install("blockr", repos = c("https://bristolmyerssquibb.github.io/webr-repos/", "https://repo.r-wasm.org")) #nolint

library(blockr)

do.call(set_workspace, args = list(title = "My workspace"))

serve_workspace(clear = FALSE)
