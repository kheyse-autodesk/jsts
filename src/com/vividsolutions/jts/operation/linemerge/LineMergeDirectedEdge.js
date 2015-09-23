function LineMergeDirectedEdge(from, to, directionPt, edgeDirection) {
	if (arguments.length === 0) return;
	LineMergeDirectedEdge.super_.call(this, from, to, directionPt, edgeDirection);
}
module.exports = LineMergeDirectedEdge
var DirectedEdge = require('com/vividsolutions/jts/planargraph/DirectedEdge');
var util = require('util');
util.inherits(LineMergeDirectedEdge, DirectedEdge)
var Assert = require('com/vividsolutions/jts/util/Assert');
LineMergeDirectedEdge.prototype.getNext = function () {
	if (this.getToNode().getDegree() !== 2) {
		return null;
	}
	if (this.getToNode().getOutEdges().getEdges().get(0) === this.getSym()) {
		return this.getToNode().getOutEdges().getEdges().get(1);
	}
	Assert.isTrue(this.getToNode().getOutEdges().getEdges().get(1) === this.getSym());
	return this.getToNode().getOutEdges().getEdges().get(0);
};

