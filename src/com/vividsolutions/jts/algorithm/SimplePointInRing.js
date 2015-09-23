function SimplePointInRing(ring) {
	this.pts = null;
	if (arguments.length === 0) return;
	this.pts = ring.getCoordinates();
}
module.exports = SimplePointInRing
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
SimplePointInRing.prototype.isInside = function (pt) {
	return CGAlgorithms.isPointInRing(pt, this.pts);
};

