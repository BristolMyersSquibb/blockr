pak::pak("parmsam/r-shinylive@feat/encode-decode-url") #nolint start

create_shinylive_links <- function(path) {

  dirs <- list.dirs(path)[-1]

  vapply(
    dirs,
    shinylive:::url_encode_dir,
    FUN.VALUE = character(1)
  )
}

create_vignettes_links <- function() {
  apps_path <- "inst/shinylive/apps"
  links <- create_shinylive_links(apps_path)
  names(links) <- gsub(sprintf("%s/", apps_path), "", names(links))
  links
}

shinylive_links <- create_vignettes_links()
usethis::use_data(shinylive_links, internal = TRUE, overwrite = TRUE) #nolint end