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

test:
	Rscript -e "devtools::test()"

sass:
	Rscript dev/sass.R

dev: bundle_dev 
	R -s -f inst/examples/lock/app.R

