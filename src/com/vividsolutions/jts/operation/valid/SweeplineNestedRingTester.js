function SweeplineNestedRingTester(graph) {
	this.graph = null;
	this.rings = new ArrayList();
	this.sweepLine = null;
	this.nestedPt = null;
	if (arguments.length === 0) return;
	this.graph = graph;
}
module.exports = SweeplineNestedRingTester
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var SweepLineIndex = require('com/vividsolutions/jts/index/sweepline/SweepLineIndex');
var IsValidOp = require('com/vividsolutions/jts/operation/valid/IsValidOp');
var SweepLineInterval = require('com/vividsolutions/jts/index/sweepline/SweepLineInterval');
var ArrayList = require('java/util/ArrayList');
var Assert = require('com/vividsolutions/jts/util/Assert');
SweeplineNestedRingTester.prototype.buildIndex = function () {
	this.sweepLine = new SweepLineIndex();
	for (var i = 0; i < this.rings.size(); i++) {
		var ring = this.rings.get(i);
		var env = ring.getEnvelopeInternal();
		var sweepInt = new SweepLineInterval(env.getMinX(), env.getMaxX(), ring);
		this.sweepLine.add(sweepInt);
	}
};
SweeplineNestedRingTester.prototype.getNestedPoint = function () {
	return this.nestedPt;
};
SweeplineNestedRingTester.prototype.isNonNested = function () {
	this.buildIndex();
	var action = new OverlapAction();
	this.sweepLine.computeOverlaps(action);
	return action.isNonNested;
};
SweeplineNestedRingTester.prototype.add = function (ring) {
	this.rings.add(ring);
};
SweeplineNestedRingTester.prototype.isInside = function (innerRing, searchRing) {
	var innerRingPts = innerRing.getCoordinates();
	var searchRingPts = searchRing.getCoordinates();
	if (!innerRing.getEnvelopeInternal().intersects(searchRing.getEnvelopeInternal())) return false;
	var innerRingPt = IsValidOp.findPtNotNode(innerRingPts, searchRing, this.graph);
	Assert.isTrue(innerRingPt !== null, "Unable to find a ring point not a node of the search ring");
	var isInside = CGAlgorithms.isPointInRing(innerRingPt, searchRingPts);
	if (isInside) {
		this.nestedPt = innerRingPt;
		return true;
	}
	return false;
};

