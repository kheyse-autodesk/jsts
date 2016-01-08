#!/bin/sh
babel src/java/ --out-dir node_modules/java --presets es2015
browserify -t babelify src/test.js -o test.bundle.js
