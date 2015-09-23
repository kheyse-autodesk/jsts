function Node(coord, edges) {
	this.coord = null;
	this.edges = null;
	if (arguments.length === 0) return;
	this.coord = coord;
	this.edges = edges;
	this.label = new Label(0, Location.NONE);
}
module.exports = Node
var GraphComponent = require('com/vividsolutions/jts/geomgraph/GraphComponent');
var util = require('util');
util.inherits(Node, GraphComponent)
var Location = require('com/vividsolutions/jts/geom/Location');
var Label = require('com/vividsolutions/jts/geomgraph/Label');
Node.prototype.isIncidentEdgeInResult = function () {
	for (var it = this.getEdges().getEdges().iterator(); it.hasNext(); ) {
		var de = it.next();
		if (de.getEdge().isInResult()) return true;
	}
	return false;
};
Node.prototype.isIsolated = function () {
	return this.label.getGeometryCount() === 1;
};
Node.prototype.getCoordinate = function () {
	return this.coord;
};
Node.prototype.print = function (out) {
	out.println("node " + this.coord + " lbl: " + this.label);
};
Node.prototype.computeIM = function (im) {};
Node.prototype.computeMergedLocation = function (label2, eltIndex) {
	var loc = Location.NONE;
	loc = this.label.getLocation(eltIndex);
	if (!label2.isNull(eltIndex)) {
		var nLoc = label2.getLocation(eltIndex);
		if (loc !== Location.BOUNDARY) loc = nLoc;
	}
	return loc;
};
Node.prototype.setLabel = function (argIndex, onLocation) {
	if (this.label === null) {
		this.label = new Label(argIndex, onLocation);
	} else this.label.setLocation(argIndex, onLocation);
};
Node.prototype.getEdges = function () {
	return this.edges;
};
Node.prototype.mergeLabel = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Node) {
				return ((...args) => {
					let [n] = args;
					this.mergeLabel(n.label);
				})(...args);
			} else if (args[0] instanceof Label) {
				return ((...args) => {
					let [label2] = args;
					for (var i = 0; i < 2; i++) {
						var loc = this.computeMergedLocation(label2, i);
						var thisLoc = this.label.getLocation(i);
						if (thisLoc === Location.NONE) this.label.setLocation(i, loc);
					}
				})(...args);
			}
	}
};
Node.prototype.add = function (e) {
	this.edges.insert(e);
	e.setNode(this);
};
Node.prototype.setLabelBoundary = function (argIndex) {
	if (this.label === null) return null;
	var loc = Location.NONE;
	if (this.label !== null) loc = this.label.getLocation(argIndex);
	var newLoc = null;
	switch (loc) {
		case Location.BOUNDARY:
			newLoc = Location.INTERIOR;
			break;
		case Location.INTERIOR:
			newLoc = Location.BOUNDARY;
			break;
		default:
			newLoc = Location.BOUNDARY;
			break;
	}
	this.label.setLocation(argIndex, newLoc);
};

