#' Create a new block
#' 
#' Create a new block
#' 
#' @param name Block name.
#' @param type Type of block to create.
#' @param file Output file.
#'  If `NULL` then it constructs `R/<name>-block.R`.
#' 
#' @export
create_block <- function(
  name, 
  type = c("transform", "plot"),
  file = NULL
){
  if(missing(name))
    stop("Missing `name`")

  type <- match.arg(type) |>
    (\(.) sprintf("%s_block", .))()

  if(is.null(file))
    file <- file.path(
      "R",
      sprintf("%s-block.R", name)
    )

  file_name <- sprintf("%s.R", type)
  infile <- system.file(
    file.path("templates", file_name),
    package = "blockr"
  )

  content <- readLines(infile) |>
    gsub("NAME", name, x = _)

  writeLines(content, con = file)
  
  cat("File", file, "created!\n")
}
