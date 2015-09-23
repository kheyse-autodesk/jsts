function OffsetPointGenerator(g) {
	this.g = null;
	this.doLeft = true;
	this.doRight = true;
	if (arguments.length === 0) return;
	this.g = g;
}
module.exports = OffsetPointGenerator
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var ArrayList = require('java/util/ArrayList');
var LinearComponentExtracter = require('com/vividsolutions/jts/geom/util/LinearComponentExtracter');
OffsetPointGenerator.prototype.extractPoints = function (line, offsetDistance, offsetPts) {
	var pts = line.getCoordinates();
	for (var i = 0; i < pts.length - 1; i++) {
		this.computeOffsetPoints(pts[i], pts[i + 1], offsetDistance, offsetPts);
	}
};
OffsetPointGenerator.prototype.setSidesToGenerate = function (doLeft, doRight) {
	this.doLeft = doLeft;
	this.doRight = doRight;
};
OffsetPointGenerator.prototype.getPoints = function (offsetDistance) {
	var offsetPts = new ArrayList();
	var lines = LinearComponentExtracter.getLines(this.g);
	for (var i = lines.iterator(); i.hasNext(); ) {
		var line = i.next();
		this.extractPoints(line, offsetDistance, offsetPts);
	}
	return offsetPts;
};
OffsetPointGenerator.prototype.computeOffsetPoints = function (p0, p1, offsetDistance, offsetPts) {
	var dx = p1.x - p0.x;
	var dy = p1.y - p0.y;
	var len = Math.sqrt(dx * dx + dy * dy);
	var ux = offsetDistance * dx / len;
	var uy = offsetDistance * dy / len;
	var midX = (p1.x + p0.x) / 2;
	var midY = (p1.y + p0.y) / 2;
	if (this.doLeft) {
		var offsetLeft = new Coordinate(midX - uy, midY + ux);
		offsetPts.add(offsetLeft);
	}
	if (this.doRight) {
		var offsetRight = new Coordinate(midX + uy, midY - ux);
		offsetPts.add(offsetRight);
	}
};

