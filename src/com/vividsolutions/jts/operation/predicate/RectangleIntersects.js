function RectangleIntersects(rectangle) {
	this.rectangle = null;
	this.rectEnv = null;
	if (arguments.length === 0) return;
	this.rectangle = rectangle;
	this.rectEnv = rectangle.getEnvelopeInternal();
}
module.exports = RectangleIntersects
var GeometryContainsPointVisitor = require('com/vividsolutions/jts/operation/predicate/GeometryContainsPointVisitor');
var RectangleIntersectsSegmentVisitor = require('com/vividsolutions/jts/operation/predicate/RectangleIntersectsSegmentVisitor');
var EnvelopeIntersectsVisitor = require('com/vividsolutions/jts/operation/predicate/EnvelopeIntersectsVisitor');
RectangleIntersects.prototype.intersects = function (geom) {
	if (!this.rectEnv.intersects(geom.getEnvelopeInternal())) return false;
	var visitor = new EnvelopeIntersectsVisitor(this.rectEnv);
	visitor.applyTo(geom);
	if (visitor.intersects()) return true;
	var ecpVisitor = new GeometryContainsPointVisitor(this.rectangle);
	ecpVisitor.applyTo(geom);
	if (ecpVisitor.containsPoint()) return true;
	var riVisitor = new RectangleIntersectsSegmentVisitor(this.rectangle);
	riVisitor.applyTo(geom);
	if (riVisitor.intersects()) return true;
	return false;
};
RectangleIntersects.intersects = function (rectangle, b) {
	var rp = new RectangleIntersects(rectangle);
	return rp.intersects(b);
};

