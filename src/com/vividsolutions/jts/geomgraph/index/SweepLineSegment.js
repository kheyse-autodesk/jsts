function SweepLineSegment(edge, ptIndex) {
	this.edge = null;
	this.pts = null;
	this.ptIndex = null;
	if (arguments.length === 0) return;
	this.edge = edge;
	this.ptIndex = ptIndex;
	this.pts = edge.getCoordinates();
}
module.exports = SweepLineSegment
SweepLineSegment.prototype.getMaxX = function () {
	var x1 = this.x;
	var x2 = this.x;
	return x1 > x2 ? x1 : x2;
};
SweepLineSegment.prototype.getMinX = function () {
	var x1 = this.x;
	var x2 = this.x;
	return x1 < x2 ? x1 : x2;
};
SweepLineSegment.prototype.computeIntersections = function (ss, si) {
	si.addIntersections(this.edge, this.ptIndex, ss.edge, ss.ptIndex);
};

