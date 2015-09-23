function GeometricShapeBuilder(geomFactory) {
	this.extent = new Envelope(0, 1, 0, 1);
	this.numPts = 0;
	this.geomFactory = null;
	if (arguments.length === 0) return;
	this.geomFactory = geomFactory;
}
module.exports = GeometricShapeBuilder
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
GeometricShapeBuilder.prototype.setNumPoints = function (numPts) {
	this.numPts = numPts;
};
GeometricShapeBuilder.prototype.getRadius = function () {
	return this.getDiameter() / 2;
};
GeometricShapeBuilder.prototype.getDiameter = function () {
	return Math.min(this.extent.getHeight(), this.extent.getWidth());
};
GeometricShapeBuilder.prototype.getSquareBaseLine = function () {
	var radius = this.getRadius();
	var centre = this.getCentre();
	var p0 = new Coordinate(centre.x - radius, centre.y - radius);
	var p1 = new Coordinate(centre.x + radius, centre.y - radius);
	return new LineSegment(p0, p1);
};
GeometricShapeBuilder.prototype.setExtent = function (extent) {
	this.extent = extent;
};
GeometricShapeBuilder.prototype.getCentre = function () {
	return this.extent.centre();
};
GeometricShapeBuilder.prototype.getExtent = function () {
	return this.extent;
};
GeometricShapeBuilder.prototype.getSquareExtent = function () {
	var radius = this.getRadius();
	var centre = this.getCentre();
	return new Envelope(centre.x - radius, centre.x + radius, centre.y - radius, centre.y + radius);
};
GeometricShapeBuilder.prototype.createCoord = function (x, y) {
	var pt = new Coordinate(x, y);
	this.geomFactory.getPrecisionModel().makePrecise(pt);
	return pt;
};

