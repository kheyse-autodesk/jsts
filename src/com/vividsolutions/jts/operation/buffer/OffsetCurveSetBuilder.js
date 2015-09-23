function OffsetCurveSetBuilder(inputGeom, distance, curveBuilder) {
	this.inputGeom = null;
	this.distance = null;
	this.curveBuilder = null;
	this.curveList = new ArrayList();
	if (arguments.length === 0) return;
	this.inputGeom = inputGeom;
	this.distance = distance;
	this.curveBuilder = curveBuilder;
}
module.exports = OffsetCurveSetBuilder
var Location = require('com/vividsolutions/jts/geom/Location');
var LineString = require('com/vividsolutions/jts/geom/LineString');
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var Point = require('com/vividsolutions/jts/geom/Point');
var NodedSegmentString = require('com/vividsolutions/jts/noding/NodedSegmentString');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var MultiPoint = require('com/vividsolutions/jts/geom/MultiPoint');
var LinearRing = require('com/vividsolutions/jts/geom/LinearRing');
var MultiPolygon = require('com/vividsolutions/jts/geom/MultiPolygon');
var Label = require('com/vividsolutions/jts/geomgraph/Label');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var ArrayList = require('java/util/ArrayList');
var MultiLineString = require('com/vividsolutions/jts/geom/MultiLineString');
var Triangle = require('com/vividsolutions/jts/geom/Triangle');
OffsetCurveSetBuilder.prototype.addPoint = function (p) {
	if (this.distance <= 0.0) return null;
	var coord = p.getCoordinates();
	var curve = this.curveBuilder.getLineCurve(coord, this.distance);
	this.addCurve(curve, Location.EXTERIOR, Location.INTERIOR);
};
OffsetCurveSetBuilder.prototype.addPolygon = function (p) {
	var offsetDistance = this.distance;
	var offsetSide = Position.LEFT;
	if (this.distance < 0.0) {
		offsetDistance = -this.distance;
		offsetSide = Position.RIGHT;
	}
	var shell = p.getExteriorRing();
	var shellCoord = CoordinateArrays.removeRepeatedPoints(shell.getCoordinates());
	if (this.distance < 0.0 && this.isErodedCompletely(shell, this.distance)) return null;
	if (this.distance <= 0.0 && shellCoord.length < 3) return null;
	this.addPolygonRing(shellCoord, offsetDistance, offsetSide, Location.EXTERIOR, Location.INTERIOR);
	for (var i = 0; i < p.getNumInteriorRing(); i++) {
		var hole = p.getInteriorRingN(i);
		var holeCoord = CoordinateArrays.removeRepeatedPoints(hole.getCoordinates());
		if (this.distance > 0.0 && this.isErodedCompletely(hole, -this.distance)) continue;
		this.addPolygonRing(holeCoord, offsetDistance, Position.opposite(offsetSide), Location.INTERIOR, Location.EXTERIOR);
	}
};
OffsetCurveSetBuilder.prototype.isTriangleErodedCompletely = function (triangleCoord, bufferDistance) {
	var tri = new Triangle(triangleCoord[0], triangleCoord[1], triangleCoord[2]);
	var inCentre = tri.inCentre();
	var distToCentre = CGAlgorithms.distancePointLine(inCentre, tri.p0, tri.p1);
	return distToCentre < Math.abs(bufferDistance);
};
OffsetCurveSetBuilder.prototype.addLineString = function (line) {
	if (this.distance <= 0.0 && !this.curveBuilder.getBufferParameters().isSingleSided()) return null;
	var coord = CoordinateArrays.removeRepeatedPoints(line.getCoordinates());
	var curve = this.curveBuilder.getLineCurve(coord, this.distance);
	this.addCurve(curve, Location.EXTERIOR, Location.INTERIOR);
};
OffsetCurveSetBuilder.prototype.addCurve = function (coord, leftLoc, rightLoc) {
	if (coord === null || coord.length < 2) return null;
	var e = new NodedSegmentString(coord, new Label(0, Location.BOUNDARY, leftLoc, rightLoc));
	this.curveList.add(e);
};
OffsetCurveSetBuilder.prototype.getCurves = function () {
	this.add(this.inputGeom);
	return this.curveList;
};
OffsetCurveSetBuilder.prototype.addPolygonRing = function (coord, offsetDistance, side, cwLeftLoc, cwRightLoc) {
	if (offsetDistance === 0.0 && coord.length < LinearRing.MINIMUM_VALID_SIZE) return null;
	var leftLoc = cwLeftLoc;
	var rightLoc = cwRightLoc;
	if (coord.length >= LinearRing.MINIMUM_VALID_SIZE && CGAlgorithms.isCCW(coord)) {
		leftLoc = cwRightLoc;
		rightLoc = cwLeftLoc;
		side = Position.opposite(side);
	}
	var curve = this.curveBuilder.getRingCurve(coord, side, offsetDistance);
	this.addCurve(curve, leftLoc, rightLoc);
};
OffsetCurveSetBuilder.prototype.add = function (g) {
	if (g.isEmpty()) return null;
	if (g instanceof Polygon) this.addPolygon(g); else if (g instanceof LineString) this.addLineString(g); else if (g instanceof Point) this.addPoint(g); else if (g instanceof MultiPoint) this.addCollection(g); else if (g instanceof MultiLineString) this.addCollection(g); else if (g instanceof MultiPolygon) this.addCollection(g); else if (g instanceof GeometryCollection) this.addCollection(g); else throw new UnsupportedOperationException(g.getClass().getName());
};
OffsetCurveSetBuilder.prototype.isErodedCompletely = function (ring, bufferDistance) {
	var ringCoord = ring.getCoordinates();
	var minDiam = 0.0;
	if (ringCoord.length < 4) return bufferDistance < 0;
	if (ringCoord.length === 4) return this.isTriangleErodedCompletely(ringCoord, bufferDistance);
	var env = ring.getEnvelopeInternal();
	var envMinDimension = Math.min(env.getHeight(), env.getWidth());
	if (bufferDistance < 0.0 && 2 * Math.abs(bufferDistance) > envMinDimension) return true;
	return false;
};
OffsetCurveSetBuilder.prototype.addCollection = function (gc) {
	for (var i = 0; i < gc.getNumGeometries(); i++) {
		var g = gc.getGeometryN(i);
		this.add(g);
	}
};

