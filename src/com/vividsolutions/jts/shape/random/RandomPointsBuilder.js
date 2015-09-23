function RandomPointsBuilder(...args) {
	this.maskPoly = null;
	this.extentLocator = null;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [geomFact] = args;
				RandomPointsBuilder.super_.call(this, geomFact);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				RandomPointsBuilder.super_.call(this, new GeometryFactory());
			})(...args);
	}
}
module.exports = RandomPointsBuilder
var GeometricShapeBuilder = require('com/vividsolutions/jts/shape/GeometricShapeBuilder');
var util = require('util');
util.inherits(RandomPointsBuilder, GeometricShapeBuilder)
var Location = require('com/vividsolutions/jts/geom/Location');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Polygonal = require('com/vividsolutions/jts/geom/Polygonal');
var IndexedPointInAreaLocator = require('com/vividsolutions/jts/algorithm/locate/IndexedPointInAreaLocator');
RandomPointsBuilder.prototype.getGeometry = function () {
	var pts = [];
	var i = 0;
	while (i < this.numPts) {
		var p = this.createRandomCoord(this.getExtent());
		if (this.extentLocator !== null && !this.isInExtent(p)) continue;
		pts[i++] = p;
	}
	return this.geomFactory.createMultiPoint(pts);
};
RandomPointsBuilder.prototype.createRandomCoord = function (env) {
	var x = env.getMinX() + env.getWidth() * Math.random();
	var y = env.getMinY() + env.getHeight() * Math.random();
	return this.createCoord(x, y);
};
RandomPointsBuilder.prototype.isInExtent = function (p) {
	if (this.extentLocator !== null) return this.extentLocator.locate(p) !== Location.EXTERIOR;
	return this.getExtent().contains(p);
};
RandomPointsBuilder.prototype.setExtent = function (mask) {
	if (!(mask instanceof Polygonal)) throw new IllegalArgumentException("Only polygonal extents are supported");
	this.maskPoly = mask;
	this.setExtent(mask.getEnvelopeInternal());
	this.extentLocator = new IndexedPointInAreaLocator(mask);
};
RandomPointsBuilder.prototype.createCoord = function (x, y) {
	var pt = new Coordinate(x, y);
	this.geomFactory.getPrecisionModel().makePrecise(pt);
	return pt;
};

