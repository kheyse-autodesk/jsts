function BasicSegmentString(pts, data) {
	this.pts = null;
	this.data = null;
	if (arguments.length === 0) return;
	this.pts = pts;
	this.data = data;
}
module.exports = BasicSegmentString
var WKTWriter = require('com/vividsolutions/jts/io/WKTWriter');
var CoordinateArraySequence = require('com/vividsolutions/jts/geom/impl/CoordinateArraySequence');
var Octant = require('com/vividsolutions/jts/noding/Octant');
BasicSegmentString.prototype.getCoordinates = function () {
	return this.pts;
};
BasicSegmentString.prototype.size = function () {
	return this.pts.length;
};
BasicSegmentString.prototype.getCoordinate = function (i) {
	return this.pts[i];
};
BasicSegmentString.prototype.isClosed = function () {
	return this.pts[0].equals(this.pts[this.pts.length - 1]);
};
BasicSegmentString.prototype.getSegmentOctant = function (index) {
	if (index === this.pts.length - 1) return -1;
	return Octant.octant(this.getCoordinate(index), this.getCoordinate(index + 1));
};
BasicSegmentString.prototype.setData = function (data) {
	this.data = data;
};
BasicSegmentString.prototype.getData = function () {
	return this.data;
};
BasicSegmentString.prototype.toString = function () {
	return WKTWriter.toLineString(new CoordinateArraySequence(this.pts));
};

