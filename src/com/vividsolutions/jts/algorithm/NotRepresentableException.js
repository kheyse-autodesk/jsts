function NotRepresentableException() {
	if (arguments.length === 0) return;
	NotRepresentableException.super_.call(this, "Projective point not representable on the Cartesian plane.");
}
module.exports = NotRepresentableException
var Exception = require('java/lang/Exception');
var util = require('util');
util.inherits(NotRepresentableException, Exception)

