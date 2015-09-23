function LocateFailureException(...args) {
	this.seg = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [msg, seg] = args;
				LocateFailureException.super_.call(this, LocateFailureException.msgWithSpatial(msg, seg));
				this.seg = new LineSegment(seg);
			})(...args);
		case 1:
			if (args[0] instanceof String) {
				return ((...args) => {
					let [msg] = args;
					LocateFailureException.super_.call(this, msg);
				})(...args);
			} else if (args[0] instanceof LineSegment) {
				return ((...args) => {
					let [seg] = args;
					LocateFailureException.super_.call(this, "Locate failed to converge (at edge: " + seg + ").  Possible causes include invalid Subdivision topology or very close sites");
					this.seg = new LineSegment(seg);
				})(...args);
			}
	}
}
module.exports = LocateFailureException
var RuntimeException = require('java/lang/RuntimeException');
var util = require('util');
util.inherits(LocateFailureException, RuntimeException)
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
LocateFailureException.prototype.getSegment = function () {
	return this.seg;
};
LocateFailureException.msgWithSpatial = function (msg, seg) {
	if (seg !== null) return msg + " [ " + seg + " ]";
	return msg;
};

