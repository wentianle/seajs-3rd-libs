PROJECT_NAME = backgrid

JS_FILES = src2/preamble.js\
	src2/formatter.js \
	src2/cell.js \
	src2/column.js \
	src2/row.js \
	src2/header.js \
	src2/body.js \
	src2/footer.js \
	src2/grid.js \
	src2/extensions/select-all/backgrid-select-all.js \
	src2/extensions/filter/backgrid-filter.js \
	src2/extensions/paginator/backgrid-paginator.js \
	src2/extensions/text-cell/backgrid-text-cell.js 
	
JS_OUTFILE = $(PROJECT_NAME).js

all: js build

js:
	printf "define(function(require, exports, module){ \n var Backbone = require(\"backbone\"); \n var _ = require(\"underscore\"); \n var $$ = require(\"jquery\");\n \"use strict\";\n" > src/$(JS_OUTFILE);
	cat $(JS_FILES)  >> src/$(JS_OUTFILE); 
	printf "module.exports = Backgrid; \n\n});" >> src/$(JS_OUTFILE);

build:
	@spm build
	@ mkdir -p ~/http/javascript/sea-modules/ucloud/backgrid/0.2.9 
	@cp dist/* ~/http/javascript/sea-modules/ucloud/backgrid/0.2.9
