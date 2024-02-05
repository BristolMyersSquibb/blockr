library(blockr)

stacks <- lapply(1:3, \(x) new_stack(data_block))
names(stacks) <- paste("stack", 1:3, sep = "-")

do.call(set_workspace, args = c(stacks, list(title = "My workspace")))

serve_workspace(clear = FALSE)
