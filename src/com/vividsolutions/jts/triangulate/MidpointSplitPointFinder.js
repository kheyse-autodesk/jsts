function MidpointSplitPointFinder() {}
module.exports = MidpointSplitPointFinder
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
MidpointSplitPointFinder.prototype.findSplitPoint = function (seg, encroachPt) {
	var p0 = seg.getStart();
	var p1 = seg.getEnd();
	return new Coordinate((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
};

