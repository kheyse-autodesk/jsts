function IntervalRTreeNode() {}
module.exports = IntervalRTreeNode
var WKTWriter = require('com/vividsolutions/jts/io/WKTWriter');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
IntervalRTreeNode.prototype.getMin = function () {
	return this.min;
};
IntervalRTreeNode.prototype.intersects = function (queryMin, queryMax) {
	if (this.min > queryMax || this.max < queryMin) return false;
	return true;
};
IntervalRTreeNode.prototype.getMax = function () {
	return this.max;
};
IntervalRTreeNode.prototype.toString = function () {
	return WKTWriter.toLineString(new Coordinate(this.min, 0), new Coordinate(this.max, 0));
};
function NodeComparator() {}
NodeComparator.prototype.compare = function (o1, o2) {
	var n1 = o1;
	var n2 = o2;
	var mid1 = (n1.min + n1.max) / 2;
	var mid2 = (n2.min + n2.max) / 2;
	if (mid1 < mid2) return -1;
	if (mid1 > mid2) return 1;
	return 0;
};
IntervalRTreeNode.NodeComparator = NodeComparator;

