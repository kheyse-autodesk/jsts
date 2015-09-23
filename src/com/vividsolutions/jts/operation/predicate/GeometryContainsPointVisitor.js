function GeometryContainsPointVisitor(rectangle) {
	this.rectSeq = null;
	this.rectEnv = null;
	this.containsPoint = false;
	if (arguments.length === 0) return;
	this.rectSeq = rectangle.getExteriorRing().getCoordinateSequence();
	this.rectEnv = rectangle.getEnvelopeInternal();
}
module.exports = GeometryContainsPointVisitor
var ShortCircuitedGeometryVisitor = require('com/vividsolutions/jts/geom/util/ShortCircuitedGeometryVisitor');
var util = require('util');
util.inherits(GeometryContainsPointVisitor, ShortCircuitedGeometryVisitor)
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var SimplePointInAreaLocator = require('com/vividsolutions/jts/algorithm/locate/SimplePointInAreaLocator');
GeometryContainsPointVisitor.prototype.isDone = function () {
	return this.containsPoint === true;
};
GeometryContainsPointVisitor.prototype.visit = function (geom) {
	if (!(geom instanceof Polygon)) return null;
	var elementEnv = geom.getEnvelopeInternal();
	if (!this.rectEnv.intersects(elementEnv)) return null;
	var rectPt = new Coordinate();
	for (var i = 0; i < 4; i++) {
		this.rectSeq.getCoordinate(i, rectPt);
		if (!elementEnv.contains(rectPt)) continue;
		if (SimplePointInAreaLocator.containsPointInPolygon(rectPt, geom)) {
			this.containsPoint = true;
			return null;
		}
	}
};
GeometryContainsPointVisitor.prototype.containsPoint = function () {
	return this.containsPoint;
};

