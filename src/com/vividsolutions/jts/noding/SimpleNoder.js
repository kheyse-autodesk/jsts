function SimpleNoder() {
	this.nodedSegStrings = null;
	if (arguments.length === 0) return;
}
module.exports = SimpleNoder
var SinglePassNoder = require('com/vividsolutions/jts/noding/SinglePassNoder');
var util = require('util');
util.inherits(SimpleNoder, SinglePassNoder)
var NodedSegmentString = require('com/vividsolutions/jts/noding/NodedSegmentString');
SimpleNoder.prototype.computeNodes = function (inputSegStrings) {
	this.nodedSegStrings = inputSegStrings;
	for (var i0 = inputSegStrings.iterator(); i0.hasNext(); ) {
		var edge0 = i0.next();
		for (var i1 = inputSegStrings.iterator(); i1.hasNext(); ) {
			var edge1 = i1.next();
			this.computeIntersects(edge0, edge1);
		}
	}
};
SimpleNoder.prototype.computeIntersects = function (e0, e1) {
	var pts0 = e0.getCoordinates();
	var pts1 = e1.getCoordinates();
	for (var i0 = 0; i0 < pts0.length - 1; i0++) {
		for (var i1 = 0; i1 < pts1.length - 1; i1++) {
			this.segInt.processIntersections(e0, i0, e1, i1);
		}
	}
};
SimpleNoder.prototype.getNodedSubstrings = function () {
	return NodedSegmentString.getNodedSubstrings(this.nodedSegStrings);
};

