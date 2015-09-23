function NoninvertibleTransformationException(...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [msg] = args;
				NoninvertibleTransformationException.super_.call(this, msg);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				NoninvertibleTransformationException.super_.call(this);
			})(...args);
	}
}
module.exports = NoninvertibleTransformationException
var Exception = require('java/lang/Exception');
var util = require('util');
util.inherits(NoninvertibleTransformationException, Exception)

