function RectangleIntersectsSegmentVisitor(rectangle) {
	this.rectEnv = null;
	this.rectIntersector = null;
	this.hasIntersection = false;
	this.p0 = new Coordinate();
	this.p1 = new Coordinate();
	if (arguments.length === 0) return;
	this.rectEnv = rectangle.getEnvelopeInternal();
	this.rectIntersector = new RectangleLineIntersector(this.rectEnv);
}
module.exports = RectangleIntersectsSegmentVisitor
var ShortCircuitedGeometryVisitor = require('com/vividsolutions/jts/geom/util/ShortCircuitedGeometryVisitor');
var util = require('util');
util.inherits(RectangleIntersectsSegmentVisitor, ShortCircuitedGeometryVisitor)
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var RectangleLineIntersector = require('com/vividsolutions/jts/algorithm/RectangleLineIntersector');
var LinearComponentExtracter = require('com/vividsolutions/jts/geom/util/LinearComponentExtracter');
RectangleIntersectsSegmentVisitor.prototype.intersects = function () {
	return this.hasIntersection;
};
RectangleIntersectsSegmentVisitor.prototype.isDone = function () {
	return this.hasIntersection === true;
};
RectangleIntersectsSegmentVisitor.prototype.visit = function (geom) {
	var elementEnv = geom.getEnvelopeInternal();
	if (!this.rectEnv.intersects(elementEnv)) return null;
	var lines = LinearComponentExtracter.getLines(geom);
	this.checkIntersectionWithLineStrings(lines);
};
RectangleIntersectsSegmentVisitor.prototype.checkIntersectionWithLineStrings = function (lines) {
	for (var i = lines.iterator(); i.hasNext(); ) {
		var testLine = i.next();
		this.checkIntersectionWithSegments(testLine);
		if (this.hasIntersection) return null;
	}
};
RectangleIntersectsSegmentVisitor.prototype.checkIntersectionWithSegments = function (testLine) {
	var seq1 = testLine.getCoordinateSequence();
	for (var j = 1; j < seq1.size(); j++) {
		seq1.getCoordinate(j - 1, this.p0);
		seq1.getCoordinate(j, this.p1);
		if (this.rectIntersector.intersects(this.p0, this.p1)) {
			this.hasIntersection = true;
			return null;
		}
	}
};

