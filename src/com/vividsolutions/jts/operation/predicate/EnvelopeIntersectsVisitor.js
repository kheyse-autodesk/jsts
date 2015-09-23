function EnvelopeIntersectsVisitor(rectEnv) {
	this.rectEnv = null;
	this.intersects = false;
	if (arguments.length === 0) return;
	this.rectEnv = rectEnv;
}
module.exports = EnvelopeIntersectsVisitor
var ShortCircuitedGeometryVisitor = require('com/vividsolutions/jts/geom/util/ShortCircuitedGeometryVisitor');
var util = require('util');
util.inherits(EnvelopeIntersectsVisitor, ShortCircuitedGeometryVisitor)
EnvelopeIntersectsVisitor.prototype.isDone = function () {
	return this.intersects === true;
};
EnvelopeIntersectsVisitor.prototype.visit = function (element) {
	var elementEnv = element.getEnvelopeInternal();
	if (!this.rectEnv.intersects(elementEnv)) {
		return null;
	}
	if (this.rectEnv.contains(elementEnv)) {
		this.intersects = true;
		return null;
	}
	if (elementEnv.getMinX() >= this.rectEnv.getMinX() && elementEnv.getMaxX() <= this.rectEnv.getMaxX()) {
		this.intersects = true;
		return null;
	}
	if (elementEnv.getMinY() >= this.rectEnv.getMinY() && elementEnv.getMaxY() <= this.rectEnv.getMaxY()) {
		this.intersects = true;
		return null;
	}
};
EnvelopeIntersectsVisitor.prototype.intersects = function () {
	return this.intersects;
};

