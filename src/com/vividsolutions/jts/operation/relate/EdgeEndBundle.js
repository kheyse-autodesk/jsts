function EdgeEndBundle(...args) {
	this.edgeEnds = new ArrayList();
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [boundaryNodeRule, e] = args;
				EdgeEndBundle.super_.call(this, e.getEdge(), e.getCoordinate(), e.getDirectedCoordinate(), new Label(e.getLabel()));
				this.insert(e);
			})(...args);
		case 1:
			return ((...args) => {
				let [e] = args;
				EdgeEndBundle.call(this, null, e);
			})(...args);
	}
}
module.exports = EdgeEndBundle
var EdgeEnd = require('com/vividsolutions/jts/geomgraph/EdgeEnd');
var util = require('util');
util.inherits(EdgeEndBundle, EdgeEnd)
var Location = require('com/vividsolutions/jts/geom/Location');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var GeometryGraph = require('com/vividsolutions/jts/geomgraph/GeometryGraph');
var Label = require('com/vividsolutions/jts/geomgraph/Label');
var ArrayList = require('java/util/ArrayList');
var Edge = require('com/vividsolutions/jts/geomgraph/Edge');
EdgeEndBundle.prototype.insert = function (e) {
	this.edgeEnds.add(e);
};
EdgeEndBundle.prototype.print = function (out) {
	out.println("EdgeEndBundle--> Label: " + this.label);
	for (var it = this.iterator(); it.hasNext(); ) {
		var ee = it.next();
		ee.print(out);
		out.println();
	}
};
EdgeEndBundle.prototype.iterator = function () {
	return this.edgeEnds.iterator();
};
EdgeEndBundle.prototype.getEdgeEnds = function () {
	return this.edgeEnds;
};
EdgeEndBundle.prototype.computeLabelOn = function (geomIndex, boundaryNodeRule) {
	var boundaryCount = 0;
	var foundInterior = false;
	for (var it = this.iterator(); it.hasNext(); ) {
		var e = it.next();
		var loc = e.getLabel().getLocation(geomIndex);
		if (loc === Location.BOUNDARY) boundaryCount++;
		if (loc === Location.INTERIOR) foundInterior = true;
	}
	var loc = Location.NONE;
	if (foundInterior) loc = Location.INTERIOR;
	if (boundaryCount > 0) {
		loc = GeometryGraph.determineBoundary(boundaryNodeRule, boundaryCount);
	}
	this.label.setLocation(geomIndex, loc);
};
EdgeEndBundle.prototype.computeLabelSide = function (geomIndex, side) {
	for (var it = this.iterator(); it.hasNext(); ) {
		var e = it.next();
		if (e.getLabel().isArea()) {
			var loc = e.getLabel().getLocation(geomIndex, side);
			if (loc === Location.INTERIOR) {
				this.label.setLocation(geomIndex, side, Location.INTERIOR);
				return null;
			} else if (loc === Location.EXTERIOR) this.label.setLocation(geomIndex, side, Location.EXTERIOR);
		}
	}
};
EdgeEndBundle.prototype.getLabel = function () {
	return this.label;
};
EdgeEndBundle.prototype.computeLabelSides = function (geomIndex) {
	this.computeLabelSide(geomIndex, Position.LEFT);
	this.computeLabelSide(geomIndex, Position.RIGHT);
};
EdgeEndBundle.prototype.updateIM = function (im) {
	Edge.updateIM(this.label, im);
};
EdgeEndBundle.prototype.computeLabel = function (boundaryNodeRule) {
	var isArea = false;
	for (var it = this.iterator(); it.hasNext(); ) {
		var e = it.next();
		if (e.getLabel().isArea()) isArea = true;
	}
	if (isArea) this.label = new Label(Location.NONE, Location.NONE, Location.NONE); else this.label = new Label(Location.NONE);
	for (var i = 0; i < 2; i++) {
		this.computeLabelOn(i, boundaryNodeRule);
		if (isArea) this.computeLabelSides(i);
	}
};

