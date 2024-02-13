.onLoad <- function(libname, pkgname) {

  blockr::register_block(
    constructor = new_dummy_block,
    name = "dummy block",
    description = "Returns input dataset",
    classes = c("dummy_block", "transform_block"),
    input = "data.frame",
    output = "data.frame",
    package = pkgname
  )

  invisible(NULL)
}

.onUnload <- function(libpath) {
  blockr::unregister_blocks("dummy_block", "test.registry")
}
