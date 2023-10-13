check: document
	Rscript -e "devtools::check()"

document: bundle
	Rscript -e "devtools::document()"

bundle:
	Rscript -e "packer::bundle_prod()"

bundle_dev:
	Rscript -e "packer::bundle_dev()"

install: check
	Rscript -e "devtools::install()"

sass:
	Rscript dev/sass.R

run: bundle_dev sass
	Rscript test.R

