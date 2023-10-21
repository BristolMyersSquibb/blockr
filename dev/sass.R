output <- sass::sass(
  sass::sass_file(
    'scss/main.scss'
  ),
  cache = NULL,
  options = sass::sass_options(
    output_style='compressed'
  ),
  output = 'inst/assets/style.min.css'
)

cat("CSS built\n")
