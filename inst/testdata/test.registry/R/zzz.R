.onLoad <- function(libname, pkgname) {

  blockr::register_block(
    new_head_block, "head block", "return first n rows",
    c("head_block", "transform_block"), "data.frame", "data.frame", pkgname
  )

  invisible(NULL)
}

.onUnload <- function(libpath) {
  blockr::unregister_blocks("head_block", "test.registry")
}
