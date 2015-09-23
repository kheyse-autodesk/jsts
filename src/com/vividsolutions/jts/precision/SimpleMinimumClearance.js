function SimpleMinimumClearance(geom) {
	this.inputGeom = null;
	this.minClearance = null;
	this.minClearancePts = null;
	if (arguments.length === 0) return;
	this.inputGeom = geom;
}
module.exports = SimpleMinimumClearance
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Double = require('java/lang/Double');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
SimpleMinimumClearance.prototype.getLine = function () {
	this.compute();
	return this.inputGeom.getFactory().createLineString(this.minClearancePts);
};
SimpleMinimumClearance.prototype.updateClearance = function (...args) {
	switch (args.length) {
		case 4:
			return ((...args) => {
				let [candidateValue, p, seg0, seg1] = args;
				if (candidateValue < this.minClearance) {
					this.minClearance = candidateValue;
					this.minClearancePts[0] = new Coordinate(p);
					var seg = new LineSegment(seg0, seg1);
					this.minClearancePts[1] = new Coordinate(seg.closestPoint(p));
				}
			})(...args);
		case 3:
			return ((...args) => {
				let [candidateValue, p0, p1] = args;
				if (candidateValue < this.minClearance) {
					this.minClearance = candidateValue;
					this.minClearancePts[0] = new Coordinate(p0);
					this.minClearancePts[1] = new Coordinate(p1);
				}
			})(...args);
	}
};
SimpleMinimumClearance.prototype.compute = function () {
	if (this.minClearancePts !== null) return null;
	this.minClearancePts = [];
	this.minClearance = Double.MAX_VALUE;
	this.inputGeom.apply(new VertexCoordinateFilter());
};
SimpleMinimumClearance.prototype.getDistance = function () {
	this.compute();
	return this.minClearance;
};
SimpleMinimumClearance.getLine = function (g) {
	var rp = new SimpleMinimumClearance(g);
	return rp.getLine();
};
SimpleMinimumClearance.getDistance = function (g) {
	var rp = new SimpleMinimumClearance(g);
	return rp.getDistance();
};

