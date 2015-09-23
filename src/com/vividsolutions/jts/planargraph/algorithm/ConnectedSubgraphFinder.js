function ConnectedSubgraphFinder(graph) {
	this.graph = null;
	if (arguments.length === 0) return;
	this.graph = graph;
}
module.exports = ConnectedSubgraphFinder
var Stack = require('java/util/Stack');
var Subgraph = require('com/vividsolutions/jts/planargraph/Subgraph');
var ArrayList = require('java/util/ArrayList');
var GraphComponent = require('com/vividsolutions/jts/planargraph/GraphComponent');
ConnectedSubgraphFinder.prototype.addReachable = function (startNode, subgraph) {
	var nodeStack = new Stack();
	nodeStack.add(startNode);
	while (!nodeStack.empty()) {
		var node = nodeStack.pop();
		this.addEdges(node, nodeStack, subgraph);
	}
};
ConnectedSubgraphFinder.prototype.findSubgraph = function (node) {
	var subgraph = new Subgraph(this.graph);
	this.addReachable(node, subgraph);
	return subgraph;
};
ConnectedSubgraphFinder.prototype.getConnectedSubgraphs = function () {
	var subgraphs = new ArrayList();
	GraphComponent.setVisited(this.graph.nodeIterator(), false);
	for (var i = this.graph.edgeIterator(); i.hasNext(); ) {
		var e = i.next();
		var node = e.getDirEdge(0).getFromNode();
		if (!node.isVisited()) {
			subgraphs.add(this.findSubgraph(node));
		}
	}
	return subgraphs;
};
ConnectedSubgraphFinder.prototype.addEdges = function (node, nodeStack, subgraph) {
	node.setVisited(true);
	for (var i = node.getOutEdges().iterator(); i.hasNext(); ) {
		var de = i.next();
		subgraph.add(de.getEdge());
		var toNode = de.getToNode();
		if (!toNode.isVisited()) nodeStack.push(toNode);
	}
};

