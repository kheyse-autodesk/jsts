function VWLineSimplifier(pts, distanceTolerance) {
	this.pts = null;
	this.tolerance = null;
	if (arguments.length === 0) return;
	this.pts = pts;
	this.tolerance = distanceTolerance * distanceTolerance;
}
module.exports = VWLineSimplifier
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Double = require('java/lang/Double');
var Triangle = require('com/vividsolutions/jts/geom/Triangle');
VWLineSimplifier.prototype.simplifyVertex = function (vwLine) {
	var curr = vwLine;
	var minArea = curr.getArea();
	var minVertex = null;
	while (curr !== null) {
		var area = curr.getArea();
		if (area < minArea) {
			minArea = area;
			minVertex = curr;
		}
		curr = curr.next;
	}
	if (minVertex !== null && minArea < this.tolerance) {
		minVertex.remove();
	}
	if (!vwLine.isLive()) return -1;
	return minArea;
};
VWLineSimplifier.prototype.simplify = function () {
	var vwLine = VWVertex.buildLine(this.pts);
	var minArea = this.tolerance;
	do {
		minArea = this.simplifyVertex(vwLine);
	} while (minArea < this.tolerance);
	var simp = vwLine.getCoordinates();
	if (simp.length < 2) {
		return [simp[0], new Coordinate(simp[0])];
	}
	return simp;
};
VWLineSimplifier.simplify = function (pts, distanceTolerance) {
	var simp = new VWLineSimplifier(pts, distanceTolerance);
	return simp.simplify();
};
function VWVertex(pt) {
	this.pt = null;
	this.prev = null;
	this.next = null;
	this.area = VWVertex.MAX_AREA;
	this.isLive = true;
	if (arguments.length === 0) return;
	this.pt = pt;
}
VWVertex.prototype.getCoordinates = function () {
	var coords = new CoordinateList();
	var curr = this;
	do {
		coords.add(curr.pt, false);
		curr = curr.next;
	} while (curr !== null);
	return coords.toCoordinateArray();
};
VWVertex.prototype.getArea = function () {
	return this.area;
};
VWVertex.prototype.updateArea = function () {
	if (this.prev === null || this.next === null) {
		this.area = VWVertex.MAX_AREA;
		return null;
	}
	this.area = Math.abs(Triangle.area(this.prev.pt, this.pt, this.next.pt));
};
VWVertex.prototype.remove = function () {
	var tmpPrev = this.prev;
	var tmpNext = this.next;
	var result = null;
	if (this.prev !== null) {
		this.prev.setNext(tmpNext);
		this.prev.updateArea();
		result = this.prev;
	}
	if (this.next !== null) {
		this.next.setPrev(tmpPrev);
		this.next.updateArea();
		if (result === null) result = this.next;
	}
	this.isLive = false;
	return result;
};
VWVertex.prototype.isLive = function () {
	return this.isLive;
};
VWVertex.prototype.setPrev = function (prev) {
	this.prev = prev;
};
VWVertex.prototype.setNext = function (next) {
	this.next = next;
};
VWVertex.buildLine = function (pts) {
	var first = null;
	var prev = null;
	for (var i = 0; i < pts.length; i++) {
		var v = new VWVertex(pts[i]);
		if (first === null) first = v;
		v.setPrev(prev);
		if (prev !== null) {
			prev.setNext(v);
			prev.updateArea();
		}
		prev = v;
	}
	return first;
};
VWVertex.MAX_AREA = Double.MAX_VALUE;
VWLineSimplifier.VWVertex = VWVertex;

