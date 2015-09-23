function Edge(...args) {
	this.dirEdge = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [de0, de1] = args;
				this.setDirectedEdges(de0, de1);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
			})(...args);
	}
}
module.exports = Edge
var GraphComponent = require('com/vividsolutions/jts/planargraph/GraphComponent');
var util = require('util');
util.inherits(Edge, GraphComponent)
var Node = require('com/vividsolutions/jts/planargraph/Node');
Edge.prototype.isRemoved = function () {
	return this.dirEdge === null;
};
Edge.prototype.setDirectedEdges = function (de0, de1) {
	this.dirEdge = [de0, de1];
	de0.setEdge(this);
	de1.setEdge(this);
	de0.setSym(de1);
	de1.setSym(de0);
	de0.getFromNode().addOutEdge(de0);
	de1.getFromNode().addOutEdge(de1);
};
Edge.prototype.getDirEdge = function (...args) {
	switch (args.length) {
		case 1:
			if (Number.isInteger(args[0])) {
				return ((...args) => {
					let [i] = args;
					return this.dirEdge[i];
				})(...args);
			} else if (args[0] instanceof Node) {
				return ((...args) => {
					let [fromNode] = args;
					if (this.dirEdge[0].getFromNode() === fromNode) return this.dirEdge[0];
					if (this.dirEdge[1].getFromNode() === fromNode) return this.dirEdge[1];
					return null;
				})(...args);
			}
	}
};
Edge.prototype.remove = function () {
	this.dirEdge = null;
};
Edge.prototype.getOppositeNode = function (node) {
	if (this.dirEdge[0].getFromNode() === node) return this.dirEdge[0].getToNode();
	if (this.dirEdge[1].getFromNode() === node) return this.dirEdge[1].getToNode();
	return null;
};

