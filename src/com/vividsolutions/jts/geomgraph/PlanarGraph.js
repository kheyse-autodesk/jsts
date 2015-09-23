function PlanarGraph(...args) {
	this.edges = new ArrayList();
	this.nodes = null;
	this.edgeEndList = new ArrayList();
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [nodeFact] = args;
				this.nodes = new NodeMap(nodeFact);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				this.nodes = new NodeMap(new NodeFactory());
			})(...args);
	}
}
module.exports = PlanarGraph
var Location = require('com/vividsolutions/jts/geom/Location');
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Node = require('com/vividsolutions/jts/geomgraph/Node');
var NodeMap = require('com/vividsolutions/jts/geomgraph/NodeMap');
var DirectedEdge = require('com/vividsolutions/jts/geomgraph/DirectedEdge');
var ArrayList = require('java/util/ArrayList');
var Quadrant = require('com/vividsolutions/jts/geomgraph/Quadrant');
var NodeFactory = require('com/vividsolutions/jts/geomgraph/NodeFactory');
PlanarGraph.prototype.printEdges = function (out) {
	out.println("Edges:");
	for (var i = 0; i < this.edges.size(); i++) {
		out.println("edge " + i + ":");
		var e = this.edges.get(i);
		e.print(out);
		e.eiList.print(out);
	}
};
PlanarGraph.prototype.find = function (coord) {
	return this.nodes.find(coord);
};
PlanarGraph.prototype.addNode = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Node) {
				return ((...args) => {
					let [node] = args;
					return this.nodes.addNode(node);
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [coord] = args;
					return this.nodes.addNode(coord);
				})(...args);
			}
	}
};
PlanarGraph.prototype.getNodeIterator = function () {
	return this.nodes.iterator();
};
PlanarGraph.prototype.linkResultDirectedEdges = function () {
	for (var nodeit = this.nodes.iterator(); nodeit.hasNext(); ) {
		var node = nodeit.next();
		node.getEdges().linkResultDirectedEdges();
	}
};
PlanarGraph.prototype.debugPrintln = function (o) {
	System.out.println(o);
};
PlanarGraph.prototype.isBoundaryNode = function (geomIndex, coord) {
	var node = this.nodes.find(coord);
	if (node === null) return false;
	var label = node.getLabel();
	if (label !== null && label.getLocation(geomIndex) === Location.BOUNDARY) return true;
	return false;
};
PlanarGraph.prototype.linkAllDirectedEdges = function () {
	for (var nodeit = this.nodes.iterator(); nodeit.hasNext(); ) {
		var node = nodeit.next();
		node.getEdges().linkAllDirectedEdges();
	}
};
PlanarGraph.prototype.matchInSameDirection = function (p0, p1, ep0, ep1) {
	if (!p0.equals(ep0)) return false;
	if (CGAlgorithms.computeOrientation(p0, p1, ep1) === CGAlgorithms.COLLINEAR && Quadrant.quadrant(p0, p1) === Quadrant.quadrant(ep0, ep1)) return true;
	return false;
};
PlanarGraph.prototype.getEdgeEnds = function () {
	return this.edgeEndList;
};
PlanarGraph.prototype.debugPrint = function (o) {
	System.out.print(o);
};
PlanarGraph.prototype.getEdgeIterator = function () {
	return this.edges.iterator();
};
PlanarGraph.prototype.findEdgeInSameDirection = function (p0, p1) {
	for (var i = 0; i < this.edges.size(); i++) {
		var e = this.edges.get(i);
		var eCoord = e.getCoordinates();
		if (this.matchInSameDirection(p0, p1, eCoord[0], eCoord[1])) return e;
		if (this.matchInSameDirection(p0, p1, eCoord[eCoord.length - 1], eCoord[eCoord.length - 2])) return e;
	}
	return null;
};
PlanarGraph.prototype.insertEdge = function (e) {
	this.edges.add(e);
};
PlanarGraph.prototype.findEdgeEnd = function (e) {
	for (var i = this.getEdgeEnds().iterator(); i.hasNext(); ) {
		var ee = i.next();
		if (ee.getEdge() === e) return ee;
	}
	return null;
};
PlanarGraph.prototype.addEdges = function (edgesToAdd) {
	for (var it = edgesToAdd.iterator(); it.hasNext(); ) {
		var e = it.next();
		this.edges.add(e);
		var de1 = new DirectedEdge(e, true);
		var de2 = new DirectedEdge(e, false);
		de1.setSym(de2);
		de2.setSym(de1);
		this.add(de1);
		this.add(de2);
	}
};
PlanarGraph.prototype.add = function (e) {
	this.nodes.add(e);
	this.edgeEndList.add(e);
};
PlanarGraph.prototype.getNodes = function () {
	return this.nodes.values();
};
PlanarGraph.prototype.findEdge = function (p0, p1) {
	for (var i = 0; i < this.edges.size(); i++) {
		var e = this.edges.get(i);
		var eCoord = e.getCoordinates();
		if (p0.equals(eCoord[0]) && p1.equals(eCoord[1])) return e;
	}
	return null;
};
PlanarGraph.linkResultDirectedEdges = function (nodes) {
	for (var nodeit = nodes.iterator(); nodeit.hasNext(); ) {
		var node = nodeit.next();
		node.getEdges().linkResultDirectedEdges();
	}
};

