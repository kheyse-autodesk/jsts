function DiscreteHausdorffDistance(g0, g1) {
	this.g0 = null;
	this.g1 = null;
	this.ptDist = new PointPairDistance();
	this.densifyFrac = 0.0;
	if (arguments.length === 0) return;
	this.g0 = g0;
	this.g1 = g1;
}
module.exports = DiscreteHausdorffDistance
var DistanceToPoint = require('com/vividsolutions/jts/algorithm/distance/DistanceToPoint');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var PointPairDistance = require('com/vividsolutions/jts/algorithm/distance/PointPairDistance');
DiscreteHausdorffDistance.prototype.getCoordinates = function () {
	return this.ptDist.getCoordinates();
};
DiscreteHausdorffDistance.prototype.setDensifyFraction = function (densifyFrac) {
	if (densifyFrac > 1.0 || densifyFrac <= 0.0) throw new IllegalArgumentException("Fraction is not in range (0.0 - 1.0]");
	this.densifyFrac = densifyFrac;
};
DiscreteHausdorffDistance.prototype.compute = function (g0, g1) {
	this.computeOrientedDistance(g0, g1, this.ptDist);
	this.computeOrientedDistance(g1, g0, this.ptDist);
};
DiscreteHausdorffDistance.prototype.distance = function () {
	this.compute(this.g0, this.g1);
	return this.ptDist.getDistance();
};
DiscreteHausdorffDistance.prototype.computeOrientedDistance = function (discreteGeom, geom, ptDist) {
	var distFilter = new MaxPointDistanceFilter(geom);
	discreteGeom.apply(distFilter);
	ptDist.setMaximum(distFilter.getMaxPointDistance());
	if (this.densifyFrac > 0) {
		var fracFilter = new MaxDensifiedByFractionDistanceFilter(geom, this.densifyFrac);
		discreteGeom.apply(fracFilter);
		ptDist.setMaximum(fracFilter.getMaxPointDistance());
	}
};
DiscreteHausdorffDistance.prototype.orientedDistance = function () {
	this.computeOrientedDistance(this.g0, this.g1, this.ptDist);
	return this.ptDist.getDistance();
};
DiscreteHausdorffDistance.distance = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [g0, g1] = args;
				var dist = new DiscreteHausdorffDistance(g0, g1);
				return dist.distance();
			})(...args);
		case 3:
			return ((...args) => {
				let [g0, g1, densifyFrac] = args;
				var dist = new DiscreteHausdorffDistance(g0, g1);
				dist.setDensifyFraction(densifyFrac);
				return dist.distance();
			})(...args);
	}
};
function MaxPointDistanceFilter(geom) {
	this.maxPtDist = new PointPairDistance();
	this.minPtDist = new PointPairDistance();
	this.euclideanDist = new DistanceToPoint();
	this.geom = null;
	if (arguments.length === 0) return;
	this.geom = geom;
}
MaxPointDistanceFilter.prototype.filter = function (pt) {
	this.minPtDist.initialize();
	DistanceToPoint.computeDistance(this.geom, pt, this.minPtDist);
	this.maxPtDist.setMaximum(this.minPtDist);
};
MaxPointDistanceFilter.prototype.getMaxPointDistance = function () {
	return this.maxPtDist;
};
DiscreteHausdorffDistance.MaxPointDistanceFilter = MaxPointDistanceFilter;
function MaxDensifiedByFractionDistanceFilter(geom, fraction) {
	this.maxPtDist = new PointPairDistance();
	this.minPtDist = new PointPairDistance();
	this.geom = null;
	this.numSubSegs = 0;
	if (arguments.length === 0) return;
	this.geom = geom;
	this.numSubSegs = Math.rint(1.0 / fraction);
}
MaxDensifiedByFractionDistanceFilter.prototype.filter = function (seq, index) {
	if (index === 0) return null;
	var p0 = seq.getCoordinate(index - 1);
	var p1 = seq.getCoordinate(index);
	var delx = (p1.x - p0.x) / this.numSubSegs;
	var dely = (p1.y - p0.y) / this.numSubSegs;
	for (var i = 0; i < this.numSubSegs; i++) {
		var x = p0.x + i * delx;
		var y = p0.y + i * dely;
		var pt = new Coordinate(x, y);
		this.minPtDist.initialize();
		DistanceToPoint.computeDistance(this.geom, pt, this.minPtDist);
		this.maxPtDist.setMaximum(this.minPtDist);
	}
};
MaxDensifiedByFractionDistanceFilter.prototype.isDone = function () {
	return false;
};
MaxDensifiedByFractionDistanceFilter.prototype.isGeometryChanged = function () {
	return false;
};
MaxDensifiedByFractionDistanceFilter.prototype.getMaxPointDistance = function () {
	return this.maxPtDist;
};
DiscreteHausdorffDistance.MaxDensifiedByFractionDistanceFilter = MaxDensifiedByFractionDistanceFilter;

