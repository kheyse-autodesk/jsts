function IteratedNoder(pm) {
	this.pm = null;
	this.li = null;
	this.nodedSegStrings = null;
	this.maxIter = IteratedNoder.MAX_ITER;
	if (arguments.length === 0) return;
	this.li = new RobustLineIntersector();
	this.pm = pm;
	this.li.setPrecisionModel(pm);
}
module.exports = IteratedNoder
var MCIndexNoder = require('com/vividsolutions/jts/noding/MCIndexNoder');
var TopologyException = require('com/vividsolutions/jts/geom/TopologyException');
var RobustLineIntersector = require('com/vividsolutions/jts/algorithm/RobustLineIntersector');
var IntersectionAdder = require('com/vividsolutions/jts/noding/IntersectionAdder');
IteratedNoder.prototype.setMaximumIterations = function (maxIter) {
	this.maxIter = maxIter;
};
IteratedNoder.prototype.node = function (segStrings, numInteriorIntersections) {
	var si = new IntersectionAdder(this.li);
	var noder = new MCIndexNoder();
	noder.setSegmentIntersector(si);
	noder.computeNodes(segStrings);
	this.nodedSegStrings = noder.getNodedSubstrings();
	numInteriorIntersections[0] = si.numInteriorIntersections;
};
IteratedNoder.prototype.computeNodes = function (segStrings) {
	var numInteriorIntersections = [];
	this.nodedSegStrings = segStrings;
	var nodingIterationCount = 0;
	var lastNodesCreated = -1;
	do {
		this.node(this.nodedSegStrings, numInteriorIntersections);
		nodingIterationCount++;
		var nodesCreated = numInteriorIntersections[0];
		if (lastNodesCreated > 0 && nodesCreated >= lastNodesCreated && nodingIterationCount > this.maxIter) {
			throw new TopologyException("Iterated noding failed to converge after " + nodingIterationCount + " iterations");
		}
		lastNodesCreated = nodesCreated;
	} while (lastNodesCreated > 0);
};
IteratedNoder.prototype.getNodedSubstrings = function () {
	return this.nodedSegStrings;
};
IteratedNoder.MAX_ITER = 5;

