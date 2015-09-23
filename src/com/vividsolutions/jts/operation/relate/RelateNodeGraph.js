function RelateNodeGraph() {
	this.nodes = new NodeMap(new RelateNodeFactory());
	if (arguments.length === 0) return;
}
module.exports = RelateNodeGraph
var Location = require('com/vividsolutions/jts/geom/Location');
var EdgeEndBuilder = require('com/vividsolutions/jts/operation/relate/EdgeEndBuilder');
var NodeMap = require('com/vividsolutions/jts/geomgraph/NodeMap');
var RelateNodeFactory = require('com/vividsolutions/jts/operation/relate/RelateNodeFactory');
RelateNodeGraph.prototype.insertEdgeEnds = function (ee) {
	for (var i = ee.iterator(); i.hasNext(); ) {
		var e = i.next();
		this.nodes.add(e);
	}
};
RelateNodeGraph.prototype.getNodeIterator = function () {
	return this.nodes.iterator();
};
RelateNodeGraph.prototype.copyNodesAndLabels = function (geomGraph, argIndex) {
	for (var nodeIt = geomGraph.getNodeIterator(); nodeIt.hasNext(); ) {
		var graphNode = nodeIt.next();
		var newNode = this.nodes.addNode(graphNode.getCoordinate());
		newNode.setLabel(argIndex, graphNode.getLabel().getLocation(argIndex));
	}
};
RelateNodeGraph.prototype.build = function (geomGraph) {
	this.computeIntersectionNodes(geomGraph, 0);
	this.copyNodesAndLabels(geomGraph, 0);
	var eeBuilder = new EdgeEndBuilder();
	var eeList = eeBuilder.computeEdgeEnds(geomGraph.getEdgeIterator());
	this.insertEdgeEnds(eeList);
};
RelateNodeGraph.prototype.computeIntersectionNodes = function (geomGraph, argIndex) {
	for (var edgeIt = geomGraph.getEdgeIterator(); edgeIt.hasNext(); ) {
		var e = edgeIt.next();
		var eLoc = e.getLabel().getLocation(argIndex);
		for (var eiIt = e.getEdgeIntersectionList().iterator(); eiIt.hasNext(); ) {
			var ei = eiIt.next();
			var n = this.nodes.addNode(ei.coord);
			if (eLoc === Location.BOUNDARY) n.setLabelBoundary(argIndex); else {
				if (n.getLabel().isNull(argIndex)) n.setLabel(argIndex, Location.INTERIOR);
			}
		}
	}
};

