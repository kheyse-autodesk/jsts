function CentroidArea() {
	this.basePt = null;
	this.triangleCent3 = new Coordinate();
	this.areasum2 = 0;
	this.cg3 = new Coordinate();
	this.centSum = new Coordinate();
	this.totalLength = 0.0;
	if (arguments.length === 0) return;
	this.basePt = null;
}
module.exports = CentroidArea
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
CentroidArea.prototype.setBasePoint = function (basePt) {
	if (this.basePt === null) this.basePt = basePt;
};
CentroidArea.prototype.addLinearSegments = function (pts) {
	for (var i = 0; i < pts.length - 1; i++) {
		var segmentLen = pts[i].distance(pts[i + 1]);
		this.totalLength += segmentLen;
		var midx = (this.x + this.x) / 2;
		this.centSum.x += segmentLen * midx;
		var midy = (this.y + this.y) / 2;
		this.centSum.y += segmentLen * midy;
	}
};
CentroidArea.prototype.addHole = function (pts) {
	var isPositiveArea = CGAlgorithms.isCCW(pts);
	for (var i = 0; i < pts.length - 1; i++) {
		this.addTriangle(this.basePt, pts[i], pts[i + 1], isPositiveArea);
	}
	this.addLinearSegments(pts);
};
CentroidArea.prototype.getCentroid = function () {
	var cent = new Coordinate();
	if (Math.abs(this.areasum2) > 0.0) {
		cent.x = this.cg3.x / 3 / this.areasum2;
		cent.y = this.cg3.y / 3 / this.areasum2;
	} else {
		cent.x = this.centSum.x / this.totalLength;
		cent.y = this.centSum.y / this.totalLength;
	}
	return cent;
};
CentroidArea.prototype.addShell = function (pts) {
	var isPositiveArea = !CGAlgorithms.isCCW(pts);
	for (var i = 0; i < pts.length - 1; i++) {
		this.addTriangle(this.basePt, pts[i], pts[i + 1], isPositiveArea);
	}
	this.addLinearSegments(pts);
};
CentroidArea.prototype.addTriangle = function (p0, p1, p2, isPositiveArea) {
	var sign = isPositiveArea ? 1.0 : -1.0;
	CentroidArea.centroid3(p0, p1, p2, this.triangleCent3);
	var area2 = CentroidArea.area2(p0, p1, p2);
	this.cg3.x += sign * area2 * this.triangleCent3.x;
	this.cg3.y += sign * area2 * this.triangleCent3.y;
	this.areasum2 += sign * area2;
};
CentroidArea.prototype.add = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geom] = args;
					if (geom instanceof Polygon) {
						var poly = geom;
						this.setBasePoint(poly.getExteriorRing().getCoordinateN(0));
						this.add(poly);
					} else if (geom instanceof GeometryCollection) {
						var gc = geom;
						for (var i = 0; i < gc.getNumGeometries(); i++) {
							this.add(gc.getGeometryN(i));
						}
					}
				})(...args);
			} else if (args[0] instanceof Array) {
				return ((...args) => {
					let [ring] = args;
					this.setBasePoint(ring[0]);
					this.addShell(ring);
				})(...args);
			} else if (args[0] instanceof Polygon) {
				return ((...args) => {
					let [poly] = args;
					this.addShell(poly.getExteriorRing().getCoordinates());
					for (var i = 0; i < poly.getNumInteriorRing(); i++) {
						this.addHole(poly.getInteriorRingN(i).getCoordinates());
					}
				})(...args);
			}
	}
};
CentroidArea.area2 = function (p1, p2, p3) {
	return (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y);
};
CentroidArea.centroid3 = function (p1, p2, p3, c) {
	c.x = p1.x + p2.x + p3.x;
	c.y = p1.y + p2.y + p3.y;
	return null;
};

