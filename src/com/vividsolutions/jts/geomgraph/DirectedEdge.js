function DirectedEdge(edge, isForward) {
	this.isForward = null;
	this.isInResult = false;
	this.isVisited = false;
	this.sym = null;
	this.next = null;
	this.nextMin = null;
	this.edgeRing = null;
	this.minEdgeRing = null;
	this.depth = [0, -999, -999];
	if (arguments.length === 0) return;
	DirectedEdge.super_.call(this, edge);
	this.isForward = isForward;
	if (isForward) {
		this.init(edge.getCoordinate(0), edge.getCoordinate(1));
	} else {
		var n = edge.getNumPoints() - 1;
		this.init(edge.getCoordinate(n), edge.getCoordinate(n - 1));
	}
	this.computeDirectedLabel();
}
module.exports = DirectedEdge
var EdgeEnd = require('com/vividsolutions/jts/geomgraph/EdgeEnd');
var util = require('util');
util.inherits(DirectedEdge, EdgeEnd)
var Location = require('com/vividsolutions/jts/geom/Location');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var TopologyException = require('com/vividsolutions/jts/geom/TopologyException');
var Label = require('com/vividsolutions/jts/geomgraph/Label');
DirectedEdge.prototype.getNextMin = function () {
	return this.nextMin;
};
DirectedEdge.prototype.getDepth = function (position) {
	return this.depth[position];
};
DirectedEdge.prototype.setVisited = function (isVisited) {
	this.isVisited = isVisited;
};
DirectedEdge.prototype.computeDirectedLabel = function () {
	this.label = new Label(this.edge.getLabel());
	if (!this.isForward) this.label.flip();
};
DirectedEdge.prototype.getNext = function () {
	return this.next;
};
DirectedEdge.prototype.setDepth = function (position, depthVal) {
	if (this.depth[position] !== -999) {
		if (this.depth[position] !== depthVal) throw new TopologyException("assigned depths do not match", this.getCoordinate());
	}
	this.depth[position] = depthVal;
};
DirectedEdge.prototype.isInteriorAreaEdge = function () {
	var isInteriorAreaEdge = true;
	for (var i = 0; i < 2; i++) {
		if (!(this.label.isArea(i) && this.label.getLocation(i, Position.LEFT) === Location.INTERIOR && this.label.getLocation(i, Position.RIGHT) === Location.INTERIOR)) {
			isInteriorAreaEdge = false;
		}
	}
	return isInteriorAreaEdge;
};
DirectedEdge.prototype.setNextMin = function (nextMin) {
	this.nextMin = nextMin;
};
DirectedEdge.prototype.print = function (out) {
	DirectedEdge.super_.prototype.print.call(this, out);
	out.print(" " + this.depth[Position.LEFT] + "/" + this.depth[Position.RIGHT]);
	out.print(" (" + this.getDepthDelta() + ")");
	if (this.isInResult) out.print(" inResult");
};
DirectedEdge.prototype.setMinEdgeRing = function (minEdgeRing) {
	this.minEdgeRing = minEdgeRing;
};
DirectedEdge.prototype.isLineEdge = function () {
	var isLine = this.label.isLine(0) || this.label.isLine(1);
	var isExteriorIfArea0 = !this.label.isArea(0) || this.label.allPositionsEqual(0, Location.EXTERIOR);
	var isExteriorIfArea1 = !this.label.isArea(1) || this.label.allPositionsEqual(1, Location.EXTERIOR);
	return isLine && isExteriorIfArea0 && isExteriorIfArea1;
};
DirectedEdge.prototype.setEdgeRing = function (edgeRing) {
	this.edgeRing = edgeRing;
};
DirectedEdge.prototype.getMinEdgeRing = function () {
	return this.minEdgeRing;
};
DirectedEdge.prototype.getDepthDelta = function () {
	var depthDelta = this.edge.getDepthDelta();
	if (!this.isForward) depthDelta = -depthDelta;
	return depthDelta;
};
DirectedEdge.prototype.setInResult = function (isInResult) {
	this.isInResult = isInResult;
};
DirectedEdge.prototype.getSym = function () {
	return this.sym;
};
DirectedEdge.prototype.isForward = function () {
	return this.isForward;
};
DirectedEdge.prototype.getEdge = function () {
	return this.edge;
};
DirectedEdge.prototype.printEdge = function (out) {
	this.print(out);
	out.print(" ");
	if (this.isForward) this.edge.print(out); else this.edge.printReverse(out);
};
DirectedEdge.prototype.setSym = function (de) {
	this.sym = de;
};
DirectedEdge.prototype.setVisitedEdge = function (isVisited) {
	this.setVisited(isVisited);
	this.sym.setVisited(isVisited);
};
DirectedEdge.prototype.setEdgeDepths = function (position, depth) {
	var depthDelta = this.getEdge().getDepthDelta();
	if (!this.isForward) depthDelta = -depthDelta;
	var directionFactor = 1;
	if (position === Position.LEFT) directionFactor = -1;
	var oppositePos = Position.opposite(position);
	var delta = depthDelta * directionFactor;
	var oppositeDepth = depth + delta;
	this.setDepth(position, depth);
	this.setDepth(oppositePos, oppositeDepth);
};
DirectedEdge.prototype.getEdgeRing = function () {
	return this.edgeRing;
};
DirectedEdge.prototype.isInResult = function () {
	return this.isInResult;
};
DirectedEdge.prototype.setNext = function (next) {
	this.next = next;
};
DirectedEdge.prototype.isVisited = function () {
	return this.isVisited;
};
DirectedEdge.depthFactor = function (currLocation, nextLocation) {
	if (currLocation === Location.EXTERIOR && nextLocation === Location.INTERIOR) return 1; else if (currLocation === Location.INTERIOR && nextLocation === Location.EXTERIOR) return -1;
	return 0;
};

