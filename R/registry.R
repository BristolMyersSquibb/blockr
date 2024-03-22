#' Block registry
#'
#' List available blocks.
#'
#' @export
available_blocks <- function() {
  lapply(set_names(nm = list_blocks()), get_block_descr)
}

block_descr_getter <- function(field) {

  field <- force(field)

  function(x) {

    stopifnot(inherits(x, "block_descr"))

    attr(x, field)
  }
}

block_descrs_getter <- function(descr_getter, ptype = character(1L)) {

  getter <- force(descr_getter)

  function(blocks = available_blocks()) {

    if (inherits(blocks, "block_descr")) {
      blocks <- list(blocks)
    }

    vapply(blocks, descr_getter, ptype)
  }
}

#' @param blocks Block description object(s)
#' @rdname available_blocks
#' @export
block_name <- block_descrs_getter(block_descr_getter("name"))

#' @rdname available_blocks
#' @export
block_descr <- block_descrs_getter(block_descr_getter("description"))

new_block_descr <- function(constructor, name, description, classes, input,
                            output, pkg) {

  stopifnot(
    is.function(constructor), is_string(name), is_string(description),
    is.character(classes), length(classes) >= 1L,
    is_string(input), is_string(output), is_string(pkg)
  )

  structure(
    constructor, name = name, description = description, classes = classes,
    input = input, output = output, package = pkg, class = "block_descr"
  )
}

block_registry <- new.env()

#' @param constructor Block constructor
#' @param name,description Metadata describing the block
#' @param classes Block classes
#' @param input,output Object types the block consumes and produces
#' @param package Package where block is defined
#'
#' @rdname available_blocks
#' @export
register_block <- function(constructor, name, description, classes, input,
                           output, package = NA_character_) {

  descr <- new_block_descr(constructor, name, description, classes, input,
                           output, package)

  id <- classes[1L]

  if (id %in% list_blocks()) {
    warning("block ", id, " already exists and will be overwritten.")
  }

  assign(id, descr, envir = block_registry)
}

#' @param ... Forwarded to `register_block()`
#' @rdname available_blocks
#' @export
register_blocks <- function(constructor, name, description, classes, input,
                            output, package = NA_character_) {

  if (length(constructor) == 1L && !is.list(classes)) {
    classes <- list(classes)
  }

  res <- Map(
    register_block,
    constructor = constructor,
    name = name,
    description = description,
    classes = classes,
    input = input,
    output = output,
    package = package
  )

  invisible(res)
}

list_blocks <- function() {
  ls(envir = block_registry)
}

get_block_descr <- function(id) {
  res <- get(id, envir = block_registry, inherits = FALSE)
  stopifnot(inherits(res, "block_descr"))
  res
}

#' @param ids Character vector of block IDs (first entry in class attribute)
#' @rdname available_blocks
#' @export
unregister_blocks <- function(ids = NULL, package = NULL) {

  if (is.null(ids) && is.null(package)) {

    ids <- list_blocks()

  } else if (not_null(package)) {

    stopifnot(is_string(package))

    pkgs <- eapply(block_registry, `attr`, "package")

    if (not_null(ids)) {
      pkgs <- pkgs[ids]
    }

    ids <- names(pkgs)[lgl_ply(pkgs, identical, package)]
  }

  rm(list = ids, envir = block_registry, inherits = FALSE)
}

register_blockr_blocks <- function(pkg) {

  if (missing(pkg)) {
    pkg <- pkg_name()
  }

  register_blocks(
    constructor = c(
      data_block,
      result_block,
      upload_block,
      filesbrowser_block,
      csv_block,
      rds_block,
      json_block,
      sas_block,
      xpt_block,
      filter_block,
      select_block,
      summarize_block,
      arrange_block,
      group_by_block,
      join_block,
      head_block,
      mutate_block
    ),
    name = c(
      "data",
      "stack",
      "upload",
      "file browser",
      "csv",
      "rds",
      "json",
      "sas",
      "xpt",
      "filter",
      "select",
      "summarize",
      "arrange",
      "group by",
      "join",
      "head",
      "mutate"
    ),
    description = c(
      "Choose a dataset from a package",
      "Shows result of another stack as data source",
      "Upload files from location",
      "Select files on the server file system",
      "Read a csv dataset",
      "Read a rds dataset",
      "Read a json dataset",
      "Read a sas dataset",
      "Read a xpt dataset",
      "filter rows in a table",
      "select columns in a table",
      "summarize data groups",
      "Arrange columns",
      "Group by columns",
      "Join 2 datasets",
      "Select n first rows of dataset",
      "Mutate block"
    ),
    classes = list(
      c("dataset_block", "data_block"),
      c("result_block", "data_block"),
      c("upload_block", "data_block"),
      c("filesbrowser_block", "data_block"),
      c("csv_block", "parser_block", "transform_block"),
      c("rds_block", "parser_block", "transform_block"),
      c("json_block", "parser_block", "transform_block"),
      c("sas_block", "parser_block", "transform_block"),
      c("xpt_block", "parser_block", "transform_block"),
      c("filter_block", "transform_block", "submit_block"),
      c("select_block", "transform_block"),
      c("summarize_block", "transform_block", "submit_block"),
      c("arrange_block", "transform_block"),
      c("group_by_block", "transform_block"),
      c("join_block", "transform_block", "submit_block"),
      c("head_block", "transform_block"),
      c("mutate_block", "transform_block")
    ),
    input = c(
      NA_character_,
      NA_character_,
      NA_character_,
      NA_character_,
      "string",
      "string",
      "string",
      "string",
      "string",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame"
    ),
    output = c(
      "data.frame",
      "data.frame",
      "string",
      "string",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame",
      "data.frame"
    ),
    package = pkg
  )
}

#' @param block Block name or description object
#' @rdname available_blocks
#' @export
construct_block <- function(block, ...) {

  if (is_string(block)) {
    block <- get_block_descr(block)
  }

  stopifnot(inherits(block, "block_descr"))

  block(...)
}

#' Add block UI interface
#'
#' Useful to allow stack to add blocks to it.
#' The selected block can be accessed through `input$selected_block`.
#' Combined to the blocks registry API, this allows to select a block from R
#' like \code{available_blocks()[[input$selected_block]]}.
#'
#' @param x The stack object.
#' @param ns Stack namespace. Default to \link{identity} so
#' that it can be used when the stack is the top level element.
#'
#' @export
add_block_ui <- function(x, ns = identity) {
  if (!getOption("BLOCKR_ADD_BLOCK", TRUE))
    return()

  add_block_ui_id <- ns("add")

  # either we're on dev mode and we show the add block button
  # or we have blocks on the stack already and we hide the button
  # otherwise the stack is empty in which case it is rendered as
  # expanded and we show the button
  hidden_class <- ""
  if (getOption("BLOCKR_DEV", FALSE) || length(x) > 0L)
    hidden_class <- "d-none"

  tagList(
    tags$a(
      icon("plus"),
      class = sprintf("stack-add-block text-decoration-none %s", hidden_class) |> trimws(),
      `data-bs-toggle` = "offcanvas",
      `data-bs-target` = sprintf("#%s", ns("addBlockCanvas")),
      `aria-controls` = ns("addBlockCanvas")
    ),
    off_canvas(
      id = ns("addBlockCanvas"),
      title = "Blocks",
      position = "start",
      p(
        "Click on a block to add it to the stack.",
        class = "text-muted small"
      ),
      div(
        id = ns("blockrRegistry"),
        class = "blockr-registry",
        div(
          class = "input-group mb-2",
          div(class = "input-group-text", icon("search")),
          tags$input(
            id = ns("query"),
            type = "text",
            class = "form-control form-control-sm add-block-search",
            placeholder = "search"
          )
        ),
        div(
          id = ns("scrollable"),
          class = "blockr-registry-list",
          div(
            id = ns("scrollable-child"),
            class = "scrollable-child"
          )
        ),
        tags$p(class = "blockr-description w-100 m-0 p-0")
      )
    )
  )
}

add_block_server <- function(
  session,
  registry = available_blocks
) {
  if (!getOption("BLOCKR_ADD_BLOCK", TRUE))
    return()

  observe({
    registry_path <- session$registerDataObj(
      rand_names(),
      list(
        registry = registry() |> add_block_index() |> sort_registry()
      ),
      get_registry
    )

    hash_path <- session$registerDataObj(
      rand_names(),
      list(
        registry = registry()
      ),
      get_registry_hash
    )

    session$sendCustomMessage(
      "blockr-registry-endpoints",
      list(
        id = session$ns("addBlockCanvas"),
        ns = session$ns(NULL),
        registry = registry_path,
        hash = hash_path,
        delay = 250
      )
    )
  })
}

get_registry_hash <- function(data, req) {
  payload <- list(
    hash = rlang::hash(data$registry)
  )

  shiny::httpResponse(
    200L,
    content_type = "application/json",
    content = jsonlite::toJSON(payload, auto_unbox = TRUE)
  )
}

get_registry <- function(data, req) {
  blocks <- data$registry |>
    lapply(\(x) {
      list(
        name = block_name(x),
        index = get_block_index(x),
        description = block_descr(x),
        classes = attr(x, "classes"),
        icon = block_icon(x) |> as.character()
      )
    })

  blocks <- blocks[sapply(blocks, length) > 0] |>
    unname()

  payload <- list(
    registry = blocks,
    hash = rlang::hash(blocks)
  )

  shiny::httpResponse(
    200L,
    content_type = "application/json",
    content = jsonlite::toJSON(payload, auto_unbox = TRUE, dataframe = "rows", force = TRUE)
  )
}
