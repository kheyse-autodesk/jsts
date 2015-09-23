function AssertionFailedException(...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [message] = args;
				AssertionFailedException.super_.call(this, message);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				AssertionFailedException.super_.call(this);
			})(...args);
	}
}
module.exports = AssertionFailedException
var RuntimeException = require('java/lang/RuntimeException');
var util = require('util');
util.inherits(AssertionFailedException, RuntimeException)

