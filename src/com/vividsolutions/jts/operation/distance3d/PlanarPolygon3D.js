function PlanarPolygon3D(poly) {
	this.plane = null;
	this.poly = null;
	this.facingPlane = -1;
	if (arguments.length === 0) return;
	this.poly = poly;
	this.plane = this.findBestFitPlane(poly);
	this.facingPlane = this.plane.closestAxisPlane();
}
module.exports = PlanarPolygon3D
var Location = require('com/vividsolutions/jts/geom/Location');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var AxisPlaneCoordinateSequence = require('com/vividsolutions/jts/operation/distance3d/AxisPlaneCoordinateSequence');
var Vector3D = require('com/vividsolutions/jts/math/Vector3D');
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
var Plane3D = require('com/vividsolutions/jts/math/Plane3D');
var RayCrossingCounter = require('com/vividsolutions/jts/algorithm/RayCrossingCounter');
PlanarPolygon3D.prototype.intersects = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [pt, ring] = args;
				var seq = ring.getCoordinateSequence();
				var seqProj = PlanarPolygon3D.project(seq, this.facingPlane);
				var ptProj = PlanarPolygon3D.project(pt, this.facingPlane);
				return Location.EXTERIOR !== RayCrossingCounter.locatePointInRing(ptProj, seqProj);
			})(...args);
		case 1:
			return ((...args) => {
				let [intPt] = args;
				if (Location.EXTERIOR === this.locate(intPt, this.poly.getExteriorRing())) return false;
				for (var i = 0; i < this.poly.getNumInteriorRing(); i++) {
					if (Location.INTERIOR === this.locate(intPt, this.poly.getInteriorRingN(i))) return false;
				}
				return true;
			})(...args);
	}
};
PlanarPolygon3D.prototype.averagePoint = function (seq) {
	var a = new Coordinate(0, 0, 0);
	var n = seq.size();
	for (var i = 0; i < n; i++) {
		a.x += seq.getOrdinate(i, CoordinateSequence.X);
		a.y += seq.getOrdinate(i, CoordinateSequence.Y);
		a.z += seq.getOrdinate(i, CoordinateSequence.Z);
	}
	a.x /= n;
	a.y /= n;
	a.z /= n;
	return a;
};
PlanarPolygon3D.prototype.getPolygon = function () {
	return this.poly;
};
PlanarPolygon3D.prototype.getPlane = function () {
	return this.plane;
};
PlanarPolygon3D.prototype.findBestFitPlane = function (poly) {
	var seq = poly.getExteriorRing().getCoordinateSequence();
	var basePt = this.averagePoint(seq);
	var normal = this.averageNormal(seq);
	return new Plane3D(normal, basePt);
};
PlanarPolygon3D.prototype.averageNormal = function (seq) {
	var n = seq.size();
	var sum = new Coordinate(0, 0, 0);
	var p1 = new Coordinate(0, 0, 0);
	var p2 = new Coordinate(0, 0, 0);
	for (var i = 0; i < n - 1; i++) {
		seq.getCoordinate(i, p1);
		seq.getCoordinate(i + 1, p2);
		sum.x += (p1.y - p2.y) * (p1.z + p2.z);
		sum.y += (p1.z - p2.z) * (p1.x + p2.x);
		sum.z += (p1.x - p2.x) * (p1.y + p2.y);
	}
	sum.x /= n;
	sum.y /= n;
	sum.z /= n;
	var norm = Vector3D.create(sum).normalize();
	return norm;
};
PlanarPolygon3D.prototype.locate = function (pt, ring) {
	var seq = ring.getCoordinateSequence();
	var seqProj = PlanarPolygon3D.project(seq, this.facingPlane);
	var ptProj = PlanarPolygon3D.project(pt, this.facingPlane);
	return RayCrossingCounter.locatePointInRing(ptProj, seqProj);
};
PlanarPolygon3D.project = function (...args) {
	switch (args.length) {
		case 2:
			if (args[0] instanceof CoordinateSequence && Number.isInteger(args[1])) {
				return ((...args) => {
					let [seq, facingPlane] = args;
					switch (facingPlane) {
						case Plane3D.XY_PLANE:
							return AxisPlaneCoordinateSequence.projectToXY(seq);
						case Plane3D.XZ_PLANE:
							return AxisPlaneCoordinateSequence.projectToXZ(seq);
						default:
							return AxisPlaneCoordinateSequence.projectToYZ(seq);
					}
				})(...args);
			} else if (args[0] instanceof Coordinate && Number.isInteger(args[1])) {
				return ((...args) => {
					let [p, facingPlane] = args;
					switch (facingPlane) {
						case Plane3D.XY_PLANE:
							return new Coordinate(p.x, p.y);
						case Plane3D.XZ_PLANE:
							return new Coordinate(p.x, p.z);
						default:
							return new Coordinate(p.y, p.z);
					}
				})(...args);
			}
	}
};

