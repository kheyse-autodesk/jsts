function ParseException(...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof String) {
				return ((...args) => {
					let [message] = args;
					ParseException.super_.call(this, message);
				})(...args);
			} else if (args[0] instanceof Exception) {
				return ((...args) => {
					let [e] = args;
					ParseException.call(this, e.toString());
				})(...args);
			}
	}
}
module.exports = ParseException
var Exception = require('java/lang/Exception');
var util = require('util');
util.inherits(ParseException, Exception)

