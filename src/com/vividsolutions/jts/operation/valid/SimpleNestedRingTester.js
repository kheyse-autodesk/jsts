function SimpleNestedRingTester(graph) {
	this.graph = null;
	this.rings = new ArrayList();
	this.nestedPt = null;
	if (arguments.length === 0) return;
	this.graph = graph;
}
module.exports = SimpleNestedRingTester
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var IsValidOp = require('com/vividsolutions/jts/operation/valid/IsValidOp');
var ArrayList = require('java/util/ArrayList');
var Assert = require('com/vividsolutions/jts/util/Assert');
SimpleNestedRingTester.prototype.getNestedPoint = function () {
	return this.nestedPt;
};
SimpleNestedRingTester.prototype.isNonNested = function () {
	for (var i = 0; i < this.rings.size(); i++) {
		var innerRing = this.rings.get(i);
		var innerRingPts = innerRing.getCoordinates();
		for (var j = 0; j < this.rings.size(); j++) {
			var searchRing = this.rings.get(j);
			var searchRingPts = searchRing.getCoordinates();
			if (innerRing === searchRing) continue;
			if (!innerRing.getEnvelopeInternal().intersects(searchRing.getEnvelopeInternal())) continue;
			var innerRingPt = IsValidOp.findPtNotNode(innerRingPts, searchRing, this.graph);
			Assert.isTrue(innerRingPt !== null, "Unable to find a ring point not a node of the search ring");
			var isInside = CGAlgorithms.isPointInRing(innerRingPt, searchRingPts);
			if (isInside) {
				this.nestedPt = innerRingPt;
				return false;
			}
		}
	}
	return true;
};
SimpleNestedRingTester.prototype.add = function (ring) {
	this.rings.add(ring);
};

