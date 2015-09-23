function PlanarGraph() {
	this.edges = new HashSet();
	this.dirEdges = new HashSet();
	this.nodeMap = new NodeMap();
	if (arguments.length === 0) return;
}
module.exports = PlanarGraph
var HashSet = require('java/util/HashSet');
var Node = require('com/vividsolutions/jts/planargraph/Node');
var NodeMap = require('com/vividsolutions/jts/planargraph/NodeMap');
var DirectedEdge = require('com/vividsolutions/jts/planargraph/DirectedEdge');
var ArrayList = require('java/util/ArrayList');
var Edge = require('com/vividsolutions/jts/planargraph/Edge');
PlanarGraph.prototype.findNodesOfDegree = function (degree) {
	var nodesFound = new ArrayList();
	for (var i = this.nodeIterator(); i.hasNext(); ) {
		var node = i.next();
		if (node.getDegree() === degree) nodesFound.add(node);
	}
	return nodesFound;
};
PlanarGraph.prototype.dirEdgeIterator = function () {
	return this.dirEdges.iterator();
};
PlanarGraph.prototype.edgeIterator = function () {
	return this.edges.iterator();
};
PlanarGraph.prototype.remove = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Edge) {
				return ((...args) => {
					let [edge] = args;
					this.remove(edge.getDirEdge(0));
					this.remove(edge.getDirEdge(1));
					this.edges.remove(edge);
					edge.remove();
				})(...args);
			} else if (args[0] instanceof DirectedEdge) {
				return ((...args) => {
					let [de] = args;
					var sym = de.getSym();
					if (sym !== null) sym.setSym(null);
					de.getFromNode().remove(de);
					de.remove();
					this.dirEdges.remove(de);
				})(...args);
			} else if (args[0] instanceof Node) {
				return ((...args) => {
					let [node] = args;
					var outEdges = node.getOutEdges().getEdges();
					for (var i = outEdges.iterator(); i.hasNext(); ) {
						var de = i.next();
						var sym = de.getSym();
						if (sym !== null) this.remove(sym);
						this.dirEdges.remove(de);
						var edge = de.getEdge();
						if (edge !== null) {
							this.edges.remove(edge);
						}
					}
					this.nodeMap.remove(node.getCoordinate());
					node.remove();
				})(...args);
			}
	}
};
PlanarGraph.prototype.findNode = function (pt) {
	return this.nodeMap.find(pt);
};
PlanarGraph.prototype.getEdges = function () {
	return this.edges;
};
PlanarGraph.prototype.nodeIterator = function () {
	return this.nodeMap.iterator();
};
PlanarGraph.prototype.contains = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Edge) {
				return ((...args) => {
					let [e] = args;
					return this.edges.contains(e);
				})(...args);
			} else if (args[0] instanceof DirectedEdge) {
				return ((...args) => {
					let [de] = args;
					return this.dirEdges.contains(de);
				})(...args);
			}
	}
};
PlanarGraph.prototype.add = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Node) {
				return ((...args) => {
					let [node] = args;
					this.nodeMap.add(node);
				})(...args);
			} else if (args[0] instanceof Edge) {
				return ((...args) => {
					let [edge] = args;
					this.edges.add(edge);
					this.add(edge.getDirEdge(0));
					this.add(edge.getDirEdge(1));
				})(...args);
			} else if (args[0] instanceof DirectedEdge) {
				return ((...args) => {
					let [dirEdge] = args;
					this.dirEdges.add(dirEdge);
				})(...args);
			}
	}
};
PlanarGraph.prototype.getNodes = function () {
	return this.nodeMap.values();
};

