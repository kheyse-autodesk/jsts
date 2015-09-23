function PolygonizeDirectedEdge(from, to, directionPt, edgeDirection) {
	this.edgeRing = null;
	this.next = null;
	this.label = -1;
	if (arguments.length === 0) return;
	PolygonizeDirectedEdge.super_.call(this, from, to, directionPt, edgeDirection);
}
module.exports = PolygonizeDirectedEdge
var DirectedEdge = require('com/vividsolutions/jts/planargraph/DirectedEdge');
var util = require('util');
util.inherits(PolygonizeDirectedEdge, DirectedEdge)
PolygonizeDirectedEdge.prototype.getNext = function () {
	return this.next;
};
PolygonizeDirectedEdge.prototype.isInRing = function () {
	return this.edgeRing !== null;
};
PolygonizeDirectedEdge.prototype.setRing = function (edgeRing) {
	this.edgeRing = edgeRing;
};
PolygonizeDirectedEdge.prototype.setLabel = function (label) {
	this.label = label;
};
PolygonizeDirectedEdge.prototype.getLabel = function () {
	return this.label;
};
PolygonizeDirectedEdge.prototype.setNext = function (next) {
	this.next = next;
};
PolygonizeDirectedEdge.prototype.getRing = function () {
	return this.edgeRing;
};

