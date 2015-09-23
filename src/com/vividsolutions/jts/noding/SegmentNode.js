function SegmentNode(segString, coord, segmentIndex, segmentOctant) {
	this.segString = null;
	this.coord = null;
	this.segmentIndex = null;
	this.segmentOctant = null;
	this.isInterior = null;
	if (arguments.length === 0) return;
	this.segString = segString;
	this.coord = new Coordinate(coord);
	this.segmentIndex = segmentIndex;
	this.segmentOctant = segmentOctant;
	this.isInterior = !coord.equals2D(segString.getCoordinate(segmentIndex));
}
module.exports = SegmentNode
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var SegmentPointComparator = require('com/vividsolutions/jts/noding/SegmentPointComparator');
SegmentNode.prototype.getCoordinate = function () {
	return this.coord;
};
SegmentNode.prototype.print = function (out) {
	out.print(this.coord);
	out.print(" seg # = " + this.segmentIndex);
};
SegmentNode.prototype.compareTo = function (obj) {
	var other = obj;
	if (this.segmentIndex < other.segmentIndex) return -1;
	if (this.segmentIndex > other.segmentIndex) return 1;
	if (this.coord.equals2D(other.coord)) return 0;
	return SegmentPointComparator.compare(this.segmentOctant, this.coord, other.coord);
};
SegmentNode.prototype.isEndPoint = function (maxSegmentIndex) {
	if (this.segmentIndex === 0 && !this.isInterior) return true;
	if (this.segmentIndex === maxSegmentIndex) return true;
	return false;
};
SegmentNode.prototype.isInterior = function () {
	return this.isInterior;
};

