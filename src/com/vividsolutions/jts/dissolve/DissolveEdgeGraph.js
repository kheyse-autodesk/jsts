function DissolveEdgeGraph() {}
module.exports = DissolveEdgeGraph
var EdgeGraph = require('com/vividsolutions/jts/edgegraph/EdgeGraph');
var util = require('util');
util.inherits(DissolveEdgeGraph, EdgeGraph)
var DissolveHalfEdge = require('com/vividsolutions/jts/dissolve/DissolveHalfEdge');
DissolveEdgeGraph.prototype.createEdge = function (p0) {
	return new DissolveHalfEdge(p0);
};

