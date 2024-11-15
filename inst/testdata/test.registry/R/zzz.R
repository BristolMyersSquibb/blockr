.onLoad <- function(libname, pkgname) {

  blockr::register_block(
    constructor = new_dummy_block,
    name = "dummy block",
    description = "Returns input dataset",
    category = "transform",
    package = pkgname
  )

  invisible(NULL)
}

.onUnload <- function(libpath) {
  blockr::unregister_blocks("dummy_block", "test.registry")
}
