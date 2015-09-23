function ConstraintEnforcementException(...args) {
	this.pt = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [msg, pt] = args;
				ConstraintEnforcementException.super_.call(this, ConstraintEnforcementException.msgWithCoord(msg, pt));
				this.pt = new Coordinate(pt);
			})(...args);
		case 1:
			return ((...args) => {
				let [msg] = args;
				ConstraintEnforcementException.super_.call(this, msg);
			})(...args);
	}
}
module.exports = ConstraintEnforcementException
var RuntimeException = require('java/lang/RuntimeException');
var util = require('util');
util.inherits(ConstraintEnforcementException, RuntimeException)
var WKTWriter = require('com/vividsolutions/jts/io/WKTWriter');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
ConstraintEnforcementException.prototype.getCoordinate = function () {
	return this.pt;
};
ConstraintEnforcementException.msgWithCoord = function (msg, pt) {
	if (pt !== null) return msg + " [ " + WKTWriter.toPoint(pt) + " ]";
	return msg;
};
ConstraintEnforcementException.serialVersionUID = 386496846550080140;

