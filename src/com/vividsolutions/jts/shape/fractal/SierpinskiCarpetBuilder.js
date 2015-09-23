function SierpinskiCarpetBuilder(geomFactory) {
	this.coordList = new CoordinateList();
	if (arguments.length === 0) return;
	SierpinskiCarpetBuilder.super_.call(this, geomFactory);
}
module.exports = SierpinskiCarpetBuilder
var GeometricShapeBuilder = require('com/vividsolutions/jts/shape/GeometricShapeBuilder');
var util = require('util');
util.inherits(SierpinskiCarpetBuilder, GeometricShapeBuilder)
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var ArrayList = require('java/util/ArrayList');
SierpinskiCarpetBuilder.prototype.addHoles = function (n, originX, originY, width, holeList) {
	if (n < 0) return null;
	var n2 = n - 1;
	var widthThird = width / 3.0;
	var widthTwoThirds = width * 2.0 / 3.0;
	var widthNinth = width / 9.0;
	this.addHoles(n2, originX, originY, widthThird, holeList);
	this.addHoles(n2, originX + widthThird, originY, widthThird, holeList);
	this.addHoles(n2, originX + 2 * widthThird, originY, widthThird, holeList);
	this.addHoles(n2, originX, originY + widthThird, widthThird, holeList);
	this.addHoles(n2, originX + 2 * widthThird, originY + widthThird, widthThird, holeList);
	this.addHoles(n2, originX, originY + 2 * widthThird, widthThird, holeList);
	this.addHoles(n2, originX + widthThird, originY + 2 * widthThird, widthThird, holeList);
	this.addHoles(n2, originX + 2 * widthThird, originY + 2 * widthThird, widthThird, holeList);
	holeList.add(this.createSquareHole(originX + widthThird, originY + widthThird, widthThird));
};
SierpinskiCarpetBuilder.prototype.getHoles = function (n, originX, originY, width) {
	var holeList = new ArrayList();
	this.addHoles(n, originX, originY, width, holeList);
	return GeometryFactory.toLinearRingArray(holeList);
};
SierpinskiCarpetBuilder.prototype.createSquareHole = function (x, y, width) {
	var pts = [new Coordinate(x, y), new Coordinate(x + width, y), new Coordinate(x + width, y + width), new Coordinate(x, y + width), new Coordinate(x, y)];
	return this.geomFactory.createLinearRing(pts);
};
SierpinskiCarpetBuilder.prototype.getGeometry = function () {
	var level = SierpinskiCarpetBuilder.recursionLevelForSize(this.numPts);
	var baseLine = this.getSquareBaseLine();
	var origin = baseLine.getCoordinate(0);
	var holes = this.getHoles(level, origin.x, origin.y, this.getDiameter());
	var shell = this.geomFactory.toGeometry(this.getSquareExtent()).getExteriorRing();
	return this.geomFactory.createPolygon(shell, holes);
};
SierpinskiCarpetBuilder.recursionLevelForSize = function (numPts) {
	var pow4 = numPts / 3;
	var exp = Math.log(pow4) / Math.log(4);
	return exp;
};

