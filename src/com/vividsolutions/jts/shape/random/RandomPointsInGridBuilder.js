function RandomPointsInGridBuilder(...args) {
	this.isConstrainedToCircle = false;
	this.gutterFraction = 0;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [geomFact] = args;
				RandomPointsInGridBuilder.super_.call(this, geomFact);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				RandomPointsInGridBuilder.super_.call(this, new GeometryFactory());
			})(...args);
	}
}
module.exports = RandomPointsInGridBuilder
var GeometricShapeBuilder = require('com/vividsolutions/jts/shape/GeometricShapeBuilder');
var util = require('util');
util.inherits(RandomPointsInGridBuilder, GeometricShapeBuilder)
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var MathUtil = require('com/vividsolutions/jts/math/MathUtil');
RandomPointsInGridBuilder.prototype.randomPointInCell = function (orgX, orgY, xLen, yLen) {
	if (this.isConstrainedToCircle) {
		return RandomPointsInGridBuilder.randomPointInCircle(orgX, orgY, xLen, yLen);
	}
	return this.randomPointInGridCell(orgX, orgY, xLen, yLen);
};
RandomPointsInGridBuilder.prototype.getGeometry = function () {
	var nCells = Math.sqrt(this.numPts);
	if (nCells * nCells < this.numPts) nCells += 1;
	var gridDX = this.getExtent().getWidth() / nCells;
	var gridDY = this.getExtent().getHeight() / nCells;
	var gutterFrac = MathUtil.clamp(this.gutterFraction, 0.0, 1.0);
	var gutterOffsetX = gridDX * gutterFrac / 2;
	var gutterOffsetY = gridDY * gutterFrac / 2;
	var cellFrac = 1.0 - gutterFrac;
	var cellDX = cellFrac * gridDX;
	var cellDY = cellFrac * gridDY;
	var pts = [];
	var index = 0;
	for (var i = 0; i < nCells; i++) {
		for (var j = 0; j < nCells; j++) {
			var orgX = this.getExtent().getMinX() + i * gridDX + gutterOffsetX;
			var orgY = this.getExtent().getMinY() + j * gridDY + gutterOffsetY;
			pts[index++] = this.randomPointInCell(orgX, orgY, cellDX, cellDY);
		}
	}
	return this.geomFactory.createMultiPoint(pts);
};
RandomPointsInGridBuilder.prototype.setConstrainedToCircle = function (isConstrainedToCircle) {
	this.isConstrainedToCircle = isConstrainedToCircle;
};
RandomPointsInGridBuilder.prototype.setGutterFraction = function (gutterFraction) {
	this.gutterFraction = gutterFraction;
};
RandomPointsInGridBuilder.prototype.randomPointInGridCell = function (orgX, orgY, xLen, yLen) {
	var x = orgX + xLen * Math.random();
	var y = orgY + yLen * Math.random();
	return this.createCoord(x, y);
};
RandomPointsInGridBuilder.randomPointInCircle = function (orgX, orgY, width, height) {
	var centreX = orgX + width / 2;
	var centreY = orgY + height / 2;
	var rndAng = 2 * Math.PI * Math.random();
	var rndRadius = Math.random();
	var rndRadius2 = Math.sqrt(rndRadius);
	var rndX = width / 2 * rndRadius2 * Math.cos(rndAng);
	var rndY = height / 2 * rndRadius2 * Math.sin(rndAng);
	var x0 = centreX + rndX;
	var y0 = centreY + rndY;
	return new Coordinate(x0, y0);
};

