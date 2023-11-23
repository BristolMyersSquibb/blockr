check: document
	Rscript -e "devtools::check()"

document: bundle
	Rscript -e "devtools::document()"

bundle: sass
	Rscript -e "packer::bundle_prod()"

bundle_dev: sass
	Rscript -e "packer::bundle_dev()"

install: check
	Rscript -e "devtools::install()"

sass: style
	Rscript dev/sass.R

style:
	Rscript -e "styler::style_pkg()"

dev: bundle_dev 
	Rscript test.R

