function CentralEndpointIntersector(p00, p01, p10, p11) {
	this.pts = null;
	this.intPt = null;
	this.minDist = Double.MAX_VALUE;
	if (arguments.length === 0) return;
	this.pts = [p00, p01, p10, p11];
	this.compute();
}
module.exports = CentralEndpointIntersector
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Double = require('java/lang/Double');
CentralEndpointIntersector.prototype.Ocompute = function () {
	var centroid = CentralEndpointIntersector.average(this.pts);
	this.intPt = new Coordinate(this.findNearestPoint(centroid, this.pts));
};
CentralEndpointIntersector.prototype.findNearestPoint = function (p, pts) {
	var minDist = Double.MAX_VALUE;
	var result = null;
	for (var i = 0; i < pts.length; i++) {
		var dist = p.distance(pts[i]);
		if (i === 0 || dist < minDist) {
			minDist = dist;
			result = pts[i];
		}
	}
	return result;
};
CentralEndpointIntersector.prototype.tryDist = function (p, p0, p1) {
	var dist = CGAlgorithms.distancePointLine(p, p0, p1);
	if (dist < this.minDist) {
		this.minDist = dist;
		this.intPt = p;
	}
};
CentralEndpointIntersector.prototype.compute = function () {
	this.tryDist(this.pts[0], this.pts[2], this.pts[3]);
	this.tryDist(this.pts[1], this.pts[2], this.pts[3]);
	this.tryDist(this.pts[2], this.pts[0], this.pts[1]);
	this.tryDist(this.pts[3], this.pts[0], this.pts[1]);
};
CentralEndpointIntersector.prototype.getIntersection = function () {
	return this.intPt;
};
CentralEndpointIntersector.average = function (pts) {
	var avg = new Coordinate();
	var n = pts.length;
	for (var i = 0; i < pts.length; i++) {
		avg.x += this.x;
		avg.y += this.y;
	}
	if (n > 0) {
		avg.x /= n;
		avg.y /= n;
	}
	return avg;
};
CentralEndpointIntersector.getIntersection = function (p00, p01, p10, p11) {
	var intor = new CentralEndpointIntersector(p00, p01, p10, p11);
	return intor.getIntersection();
};

