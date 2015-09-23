function BufferCurveMaximumDistanceFinder(inputGeom) {
	this.inputGeom = null;
	this.maxPtDist = new PointPairDistance();
	if (arguments.length === 0) return;
	this.inputGeom = inputGeom;
}
module.exports = BufferCurveMaximumDistanceFinder
var DistanceToPointFinder = require('com/vividsolutions/jts/operation/buffer/validate/DistanceToPointFinder');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var PointPairDistance = require('com/vividsolutions/jts/operation/buffer/validate/PointPairDistance');
BufferCurveMaximumDistanceFinder.prototype.computeMaxMidpointDistance = function (curve) {
	var distFilter = new MaxMidpointDistanceFilter(this.inputGeom);
	curve.apply(distFilter);
	this.maxPtDist.setMaximum(distFilter.getMaxPointDistance());
};
BufferCurveMaximumDistanceFinder.prototype.computeMaxVertexDistance = function (curve) {
	var distFilter = new MaxPointDistanceFilter(this.inputGeom);
	curve.apply(distFilter);
	this.maxPtDist.setMaximum(distFilter.getMaxPointDistance());
};
BufferCurveMaximumDistanceFinder.prototype.findDistance = function (bufferCurve) {
	this.computeMaxVertexDistance(bufferCurve);
	this.computeMaxMidpointDistance(bufferCurve);
	return this.maxPtDist.getDistance();
};
BufferCurveMaximumDistanceFinder.prototype.getDistancePoints = function () {
	return this.maxPtDist;
};
function MaxPointDistanceFilter(geom) {
	this.maxPtDist = new PointPairDistance();
	this.minPtDist = new PointPairDistance();
	this.geom = null;
	if (arguments.length === 0) return;
	this.geom = geom;
}
MaxPointDistanceFilter.prototype.filter = function (pt) {
	this.minPtDist.initialize();
	DistanceToPointFinder.computeDistance(this.geom, pt, this.minPtDist);
	this.maxPtDist.setMaximum(this.minPtDist);
};
MaxPointDistanceFilter.prototype.getMaxPointDistance = function () {
	return this.maxPtDist;
};
BufferCurveMaximumDistanceFinder.MaxPointDistanceFilter = MaxPointDistanceFilter;
function MaxMidpointDistanceFilter(geom) {
	this.maxPtDist = new PointPairDistance();
	this.minPtDist = new PointPairDistance();
	this.geom = null;
	if (arguments.length === 0) return;
	this.geom = geom;
}
MaxMidpointDistanceFilter.prototype.filter = function (seq, index) {
	if (index === 0) return null;
	var p0 = seq.getCoordinate(index - 1);
	var p1 = seq.getCoordinate(index);
	var midPt = new Coordinate((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
	this.minPtDist.initialize();
	DistanceToPointFinder.computeDistance(this.geom, midPt, this.minPtDist);
	this.maxPtDist.setMaximum(this.minPtDist);
};
MaxMidpointDistanceFilter.prototype.isDone = function () {
	return false;
};
MaxMidpointDistanceFilter.prototype.isGeometryChanged = function () {
	return false;
};
MaxMidpointDistanceFilter.prototype.getMaxPointDistance = function () {
	return this.maxPtDist;
};
BufferCurveMaximumDistanceFinder.MaxMidpointDistanceFilter = MaxMidpointDistanceFilter;

