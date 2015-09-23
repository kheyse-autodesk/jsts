function LineMergeGraph() {}
module.exports = LineMergeGraph
var PlanarGraph = require('com/vividsolutions/jts/planargraph/PlanarGraph');
var util = require('util');
util.inherits(LineMergeGraph, PlanarGraph)
var LineMergeDirectedEdge = require('com/vividsolutions/jts/operation/linemerge/LineMergeDirectedEdge');
var Node = require('com/vividsolutions/jts/planargraph/Node');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var LineMergeEdge = require('com/vividsolutions/jts/operation/linemerge/LineMergeEdge');
LineMergeGraph.prototype.addEdge = function (lineString) {
	if (lineString.isEmpty()) {
		return null;
	}
	var coordinates = CoordinateArrays.removeRepeatedPoints(lineString.getCoordinates());
	if (coordinates.length <= 1) return null;
	var startCoordinate = coordinates[0];
	var endCoordinate = coordinates[coordinates.length - 1];
	var startNode = this.getNode(startCoordinate);
	var endNode = this.getNode(endCoordinate);
	var directedEdge0 = new LineMergeDirectedEdge(startNode, endNode, coordinates[1], true);
	var directedEdge1 = new LineMergeDirectedEdge(endNode, startNode, coordinates[coordinates.length - 2], false);
	var edge = new LineMergeEdge(lineString);
	edge.setDirectedEdges(directedEdge0, directedEdge1);
	this.add(edge);
};
LineMergeGraph.prototype.getNode = function (coordinate) {
	var node = this.findNode(coordinate);
	if (node === null) {
		node = new Node(coordinate);
		this.add(node);
	}
	return node;
};

