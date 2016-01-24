#!/bin/sh
babel src/java/ --out-dir node_modules/java --presets es2015
NODE_PATH=src browserify -d -t [ babelify --presets [ es2015 ] ] src/test.js -o test.bundle.js
