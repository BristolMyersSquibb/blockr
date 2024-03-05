is_error <- function(x) {
  inherits(x, "error")
}

Stack <- R6::R6Class(
  "Stack",
  public = list(
    push = function(x) {
      private$stack[[self$size() + 1]] <- x
      invisible(self)
    },
    pop = function(n = 1) {
      if (self$size() == 0L) {
        return()
      }

      for (i in 1:seq(n)) {
        item <- private$stack[[self$size()]]
        private$stack <- private$stack[-self$size()]
      }

      invisible(item)
    },
    size = function() {
      length(private$stack)
    },
    read = function() {
      private$stack
    },
    clear = function() {
      private$stack <- list()
    }
  ),
  private = list(
    stack = list()
  )
)

ErrorStack <- R6::R6Class(
  "ErrorStack",
  inherit = Stack,
  active = list(
    valid = function(x) {
      if (!missing(x))
        stop("This field is read-only")

      super$read() |>
        sapply(\(err) !err$valid) |>
        as.integer() |>
        sum() == 0
    }
  ),
  public = list(
    push = function(message = "", el = NULL, valid = FALSE) {
      super$push(
        list(
          el = el,
          message = message,
          valid = valid
        )
      )
    },
    handle_errors = function(blk, session = getDefaultReactiveDomain()) {
      errors <- super$read()
      super$clear()

      is_block_valid <- self$valid

      errors |>
        lapply(\(err) {
          # input border is red (danger) if invalid
          session$sendCustomMessage(
            "validate-input",
            list(
              state = err$valid,
              id = session$ns(err$el)
            )
          )
        })

      session$sendCustomMessage(
        "validate-block",
        list(
          state = is_block_valid,
          id = session$ns("block")
        )
      )

      # Toggle submit field
      if ("submit_block" %in% class(blk)) {
        session$sendCustomMessage(
          "toggle-submit",
          list(state = is_block_valid, id = ns("submit"))
        )
      }

      # Cleanup any old message
      removeUI(
        selector = sprintf("[data-value=\"%s\"] .message", session$ns("block")),
        multiple = TRUE,
        session = session
      )

      # Send validation message
      if (!is_block_valid) {
        insertUI(
          selector = sprintf("[data-value=\"%s\"] .block-validation", session$ns("block")),
          ui = lapply(errors, function(err) {
            p(err$message, class = "message text-center text-danger")
          }),
          where = "beforeEnd",
          session = session
        )
      }
    }
  )
)
