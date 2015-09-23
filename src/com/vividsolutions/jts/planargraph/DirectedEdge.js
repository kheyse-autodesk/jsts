function DirectedEdge(from, to, directionPt, edgeDirection) {
	this.parentEdge = null;
	this.from = null;
	this.to = null;
	this.p0 = null;
	this.p1 = null;
	this.sym = null;
	this.edgeDirection = null;
	this.quadrant = null;
	this.angle = null;
	if (arguments.length === 0) return;
	this.from = from;
	this.to = to;
	this.edgeDirection = edgeDirection;
	this.p0 = from.getCoordinate();
	this.p1 = directionPt;
	var dx = this.p1.x - this.p0.x;
	var dy = this.p1.y - this.p0.y;
	this.quadrant = Quadrant.quadrant(dx, dy);
	this.angle = Math.atan2(dy, dx);
}
module.exports = DirectedEdge
var GraphComponent = require('com/vividsolutions/jts/planargraph/GraphComponent');
var util = require('util');
util.inherits(DirectedEdge, GraphComponent)
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var ArrayList = require('java/util/ArrayList');
var Quadrant = require('com/vividsolutions/jts/geomgraph/Quadrant');
DirectedEdge.prototype.isRemoved = function () {
	return this.parentEdge === null;
};
DirectedEdge.prototype.compareDirection = function (e) {
	if (this.quadrant > e.quadrant) return 1;
	if (this.quadrant < e.quadrant) return -1;
	return CGAlgorithms.computeOrientation(e.p0, e.p1, this.p1);
};
DirectedEdge.prototype.getCoordinate = function () {
	return this.from.getCoordinate();
};
DirectedEdge.prototype.print = function (out) {
	var className = this.getClass().getName();
	var lastDotPos = className.lastIndexOf('.');
	var name = className.substring(lastDotPos + 1);
	out.print("  " + name + ": " + this.p0 + " - " + this.p1 + " " + this.quadrant + ":" + this.angle);
};
DirectedEdge.prototype.getDirectionPt = function () {
	return this.p1;
};
DirectedEdge.prototype.getAngle = function () {
	return this.angle;
};
DirectedEdge.prototype.compareTo = function (obj) {
	var de = obj;
	return this.compareDirection(de);
};
DirectedEdge.prototype.getFromNode = function () {
	return this.from;
};
DirectedEdge.prototype.getSym = function () {
	return this.sym;
};
DirectedEdge.prototype.setEdge = function (parentEdge) {
	this.parentEdge = parentEdge;
};
DirectedEdge.prototype.remove = function () {
	this.sym = null;
	this.parentEdge = null;
};
DirectedEdge.prototype.getEdge = function () {
	return this.parentEdge;
};
DirectedEdge.prototype.getQuadrant = function () {
	return this.quadrant;
};
DirectedEdge.prototype.setSym = function (sym) {
	this.sym = sym;
};
DirectedEdge.prototype.getToNode = function () {
	return this.to;
};
DirectedEdge.prototype.getEdgeDirection = function () {
	return this.edgeDirection;
};
DirectedEdge.toEdges = function (dirEdges) {
	var edges = new ArrayList();
	for (var i = dirEdges.iterator(); i.hasNext(); ) {
		edges.add(this.parentEdge);
	}
	return edges;
};

