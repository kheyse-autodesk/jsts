function Node(...args) {
	this.pt = null;
	this.deStar = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [pt, deStar] = args;
				this.pt = pt;
				this.deStar = deStar;
			})(...args);
		case 1:
			return ((...args) => {
				let [pt] = args;
				Node.call(this, pt, new DirectedEdgeStar());
			})(...args);
	}
}
module.exports = Node
var GraphComponent = require('com/vividsolutions/jts/planargraph/GraphComponent');
var util = require('util');
util.inherits(Node, GraphComponent)
var DirectedEdgeStar = require('com/vividsolutions/jts/planargraph/DirectedEdgeStar');
var HashSet = require('java/util/HashSet');
var DirectedEdge = require('com/vividsolutions/jts/planargraph/DirectedEdge');
Node.prototype.isRemoved = function () {
	return this.pt === null;
};
Node.prototype.addOutEdge = function (de) {
	this.deStar.add(de);
};
Node.prototype.getCoordinate = function () {
	return this.pt;
};
Node.prototype.getOutEdges = function () {
	return this.deStar;
};
Node.prototype.remove = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [de] = args;
				this.deStar.remove(de);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				this.pt = null;
			})(...args);
	}
};
Node.prototype.getIndex = function (edge) {
	return this.deStar.getIndex(edge);
};
Node.prototype.getDegree = function () {
	return this.deStar.getDegree();
};
Node.getEdgesBetween = function (node0, node1) {
	var edges0 = DirectedEdge.toEdges(node0.getOutEdges().getEdges());
	var commonEdges = new HashSet(edges0);
	var edges1 = DirectedEdge.toEdges(node1.getOutEdges().getEdges());
	commonEdges.retainAll(edges1);
	return commonEdges;
};

