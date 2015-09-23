function ConsistentAreaTester(geomGraph) {
	this.li = new RobustLineIntersector();
	this.geomGraph = null;
	this.nodeGraph = new RelateNodeGraph();
	this.invalidPoint = null;
	if (arguments.length === 0) return;
	this.geomGraph = geomGraph;
}
module.exports = ConsistentAreaTester
var RelateNodeGraph = require('com/vividsolutions/jts/operation/relate/RelateNodeGraph');
var RobustLineIntersector = require('com/vividsolutions/jts/algorithm/RobustLineIntersector');
ConsistentAreaTester.prototype.isNodeEdgeAreaLabelsConsistent = function () {
	for (var nodeIt = this.nodeGraph.getNodeIterator(); nodeIt.hasNext(); ) {
		var node = nodeIt.next();
		if (!node.getEdges().isAreaLabelsConsistent(this.geomGraph)) {
			this.invalidPoint = node.getCoordinate().clone();
			return false;
		}
	}
	return true;
};
ConsistentAreaTester.prototype.getInvalidPoint = function () {
	return this.invalidPoint;
};
ConsistentAreaTester.prototype.hasDuplicateRings = function () {
	for (var nodeIt = this.nodeGraph.getNodeIterator(); nodeIt.hasNext(); ) {
		var node = nodeIt.next();
		for (var i = node.getEdges().iterator(); i.hasNext(); ) {
			var eeb = i.next();
			if (eeb.getEdgeEnds().size() > 1) {
				this.invalidPoint = eeb.getEdge().getCoordinate(0);
				return true;
			}
		}
	}
	return false;
};
ConsistentAreaTester.prototype.isNodeConsistentArea = function () {
	var intersector = this.geomGraph.computeSelfNodes(this.li, true);
	if (intersector.hasProperIntersection()) {
		this.invalidPoint = intersector.getProperIntersectionPoint();
		return false;
	}
	this.nodeGraph.build(this.geomGraph);
	return this.isNodeEdgeAreaLabelsConsistent();
};

