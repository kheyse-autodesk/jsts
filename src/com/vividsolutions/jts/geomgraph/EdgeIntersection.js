function EdgeIntersection(coord, segmentIndex, dist) {
	this.coord = null;
	this.segmentIndex = null;
	this.dist = null;
	if (arguments.length === 0) return;
	this.coord = new Coordinate(coord);
	this.segmentIndex = segmentIndex;
	this.dist = dist;
}
module.exports = EdgeIntersection
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
EdgeIntersection.prototype.getSegmentIndex = function () {
	return this.segmentIndex;
};
EdgeIntersection.prototype.getCoordinate = function () {
	return this.coord;
};
EdgeIntersection.prototype.print = function (out) {
	out.print(this.coord);
	out.print(" seg # = " + this.segmentIndex);
	out.println(" dist = " + this.dist);
};
EdgeIntersection.prototype.compareTo = function (obj) {
	var other = obj;
	return this.compare(other.segmentIndex, other.dist);
};
EdgeIntersection.prototype.isEndPoint = function (maxSegmentIndex) {
	if (this.segmentIndex === 0 && this.dist === 0.0) return true;
	if (this.segmentIndex === maxSegmentIndex) return true;
	return false;
};
EdgeIntersection.prototype.toString = function () {
	return this.coord + " seg # = " + this.segmentIndex + " dist = " + this.dist;
};
EdgeIntersection.prototype.getDistance = function () {
	return this.dist;
};
EdgeIntersection.prototype.compare = function (segmentIndex, dist) {
	if (this.segmentIndex < segmentIndex) return -1;
	if (this.segmentIndex > segmentIndex) return 1;
	if (this.dist < dist) return -1;
	if (this.dist > dist) return 1;
	return 0;
};

