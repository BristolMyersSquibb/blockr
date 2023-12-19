.onLoad <- function(libname, pkgname) {

  blockr::register_block(
    constructor = new_head_block,
    name = "head block",
    description = "return first n rows",
    classes = c("head_block", "transform_block"),
    input = "data.frame",
    output = "data.frame",
    package = pkgname
  )

  invisible(NULL)
}

.onUnload <- function(libpath) {
  blockr::unregister_blocks("head_block", "test.registry")
}
