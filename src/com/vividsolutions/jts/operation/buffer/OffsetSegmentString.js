function OffsetSegmentString() {
	this.ptList = null;
	this.precisionModel = null;
	this.minimimVertexDistance = 0.0;
	if (arguments.length === 0) return;
	this.ptList = new ArrayList();
}
module.exports = OffsetSegmentString
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var ArrayList = require('java/util/ArrayList');
OffsetSegmentString.prototype.getCoordinates = function () {
	var coord = this.ptList.toArray(OffsetSegmentString.COORDINATE_ARRAY_TYPE);
	return coord;
};
OffsetSegmentString.prototype.setPrecisionModel = function (precisionModel) {
	this.precisionModel = precisionModel;
};
OffsetSegmentString.prototype.addPt = function (pt) {
	var bufPt = new Coordinate(pt);
	this.precisionModel.makePrecise(bufPt);
	if (this.isRedundant(bufPt)) return null;
	this.ptList.add(bufPt);
};
OffsetSegmentString.prototype.reverse = function () {};
OffsetSegmentString.prototype.addPts = function (pt, isForward) {
	if (isForward) {
		for (var i = 0; i < pt.length; i++) {
			this.addPt(pt[i]);
		}
	} else {
		for (var i = pt.length - 1; i >= 0; i--) {
			this.addPt(pt[i]);
		}
	}
};
OffsetSegmentString.prototype.isRedundant = function (pt) {
	if (this.ptList.size() < 1) return false;
	var lastPt = this.ptList.get(this.ptList.size() - 1);
	var ptDist = pt.distance(lastPt);
	if (ptDist < this.minimimVertexDistance) return true;
	return false;
};
OffsetSegmentString.prototype.toString = function () {
	var fact = new GeometryFactory();
	var line = fact.createLineString(this.getCoordinates());
	return line.toString();
};
OffsetSegmentString.prototype.closeRing = function () {
	if (this.ptList.size() < 1) return null;
	var startPt = new Coordinate(this.ptList.get(0));
	var lastPt = this.ptList.get(this.ptList.size() - 1);
	var last2Pt = null;
	if (this.ptList.size() >= 2) last2Pt = this.ptList.get(this.ptList.size() - 2);
	if (startPt.equals(lastPt)) return null;
	this.ptList.add(startPt);
};
OffsetSegmentString.prototype.setMinimumVertexDistance = function (minimimVertexDistance) {
	this.minimimVertexDistance = minimimVertexDistance;
};
OffsetSegmentString.COORDINATE_ARRAY_TYPE = [];

