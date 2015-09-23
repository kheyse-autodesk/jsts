function DouglasPeuckerLineSimplifier(pts) {
	this.pts = null;
	this.usePt = null;
	this.distanceTolerance = null;
	this.seg = new LineSegment();
	if (arguments.length === 0) return;
	this.pts = pts;
}
module.exports = DouglasPeuckerLineSimplifier
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
DouglasPeuckerLineSimplifier.prototype.simplifySection = function (i, j) {
	if (i + 1 === j) {
		return null;
	}
	this.seg.p0 = this.pts[i];
	this.seg.p1 = this.pts[j];
	var maxDistance = -1.0;
	var maxIndex = i;
	for (var k = i + 1; k < j; k++) {
		var distance = this.seg.distance(this.pts[k]);
		if (distance > maxDistance) {
			maxDistance = distance;
			maxIndex = k;
		}
	}
	if (maxDistance <= this.distanceTolerance) {
		for (var k = i + 1; k < j; k++) {
			this.usePt[k] = false;
		}
	} else {
		this.simplifySection(i, maxIndex);
		this.simplifySection(maxIndex, j);
	}
};
DouglasPeuckerLineSimplifier.prototype.setDistanceTolerance = function (distanceTolerance) {
	this.distanceTolerance = distanceTolerance;
};
DouglasPeuckerLineSimplifier.prototype.simplify = function () {
	this.usePt = [];
	for (var i = 0; i < this.pts.length; i++) {
		this.usePt[i] = true;
	}
	this.simplifySection(0, this.pts.length - 1);
	var coordList = new CoordinateList();
	for (var i = 0; i < this.pts.length; i++) {
		if (this.usePt[i]) coordList.add(new Coordinate(this.pts[i]));
	}
	return coordList.toCoordinateArray();
};
DouglasPeuckerLineSimplifier.simplify = function (pts, distanceTolerance) {
	var simp = new DouglasPeuckerLineSimplifier(pts);
	simp.setDistanceTolerance(distanceTolerance);
	return simp.simplify();
};

