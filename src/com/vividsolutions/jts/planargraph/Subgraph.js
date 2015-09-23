function Subgraph(parentGraph) {
	this.parentGraph = null;
	this.edges = new HashSet();
	this.dirEdges = new ArrayList();
	this.nodeMap = new NodeMap();
	if (arguments.length === 0) return;
	this.parentGraph = parentGraph;
}
module.exports = Subgraph
var HashSet = require('java/util/HashSet');
var NodeMap = require('com/vividsolutions/jts/planargraph/NodeMap');
var ArrayList = require('java/util/ArrayList');
Subgraph.prototype.dirEdgeIterator = function () {
	return this.dirEdges.iterator();
};
Subgraph.prototype.edgeIterator = function () {
	return this.edges.iterator();
};
Subgraph.prototype.getParent = function () {
	return this.parentGraph;
};
Subgraph.prototype.nodeIterator = function () {
	return this.nodeMap.iterator();
};
Subgraph.prototype.contains = function (e) {
	return this.edges.contains(e);
};
Subgraph.prototype.add = function (e) {
	if (this.edges.contains(e)) return null;
	this.edges.add(e);
	this.dirEdges.add(e.getDirEdge(0));
	this.dirEdges.add(e.getDirEdge(1));
	this.nodeMap.add(e.getDirEdge(0).getFromNode());
	this.nodeMap.add(e.getDirEdge(1).getFromNode());
};

