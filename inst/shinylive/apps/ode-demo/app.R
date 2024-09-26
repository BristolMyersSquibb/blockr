webr::install("blockr", repos = c("https://bristolmyerssquibb.github.io/webr-repos", "https://repo.r-wasm.org"))
webr::install("blockr.ggplot2", repos = c("https://bristolmyerssquibb.github.io/webr-repos", "https://repo.r-wasm.org"))

library(blockr)
library(pracma)
library(blockr.ggplot2)

new_ode_block <- function(...) {

  lorenz <- function(t, y, parms) {
    c(
      X = parms[1] * y[1] + y[2] * y[3],
      Y = parms[2] * (y[2] - y[3]),
      Z = -y[1] * y[2] + parms[3] * y[2] - y[3]
    )
  }

  fields <- list(
    a = new_numeric_field(-8 / 3, -10, 20),
    b = new_numeric_field(-10, -50, 100),
    c = new_numeric_field(28, 1, 100)
  )

  new_block(
    fields = fields,
    expr = substitute(
      as.data.frame(
        ode45(
          fun,
          y0 = c(X = 1, Y = 1, Z = 1),
          t0 = 0,
          tfinal = 100,
          parms = c(.(a), .(b), .(c))
        )
      ),
      list(fun = lorenz)
    ),
    ...,
    class = c("ode_block", "data_block")
  )
}

stack <- new_stack(
  new_ode_block,
  new_ggplot_block(
    func = c("x", "y"),
    default_columns = c("y.1", "y.2")
  ),
  new_geompoint_block
)
serve_stack(stack)
