library(blockr)

# Dummy demo to show how restore workspace works
restore_workspace(
  system.file(
    "examples/restore-workspace/workspace-2024-02-06.json",
    package = "blockr"
  )
)
serve_workspace(clear = FALSE)
