function IndexedNestedRingTester(graph) {
	this.graph = null;
	this.rings = new ArrayList();
	this.totalEnv = new Envelope();
	this.index = null;
	this.nestedPt = null;
	if (arguments.length === 0) return;
	this.graph = graph;
}
module.exports = IndexedNestedRingTester
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var STRtree = require('com/vividsolutions/jts/index/strtree/STRtree');
var IsValidOp = require('com/vividsolutions/jts/operation/valid/IsValidOp');
var ArrayList = require('java/util/ArrayList');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
IndexedNestedRingTester.prototype.buildIndex = function () {
	this.index = new STRtree();
	for (var i = 0; i < this.rings.size(); i++) {
		var ring = this.rings.get(i);
		var env = ring.getEnvelopeInternal();
		this.index.insert(env, ring);
	}
};
IndexedNestedRingTester.prototype.getNestedPoint = function () {
	return this.nestedPt;
};
IndexedNestedRingTester.prototype.isNonNested = function () {
	this.buildIndex();
	for (var i = 0; i < this.rings.size(); i++) {
		var innerRing = this.rings.get(i);
		var innerRingPts = innerRing.getCoordinates();
		var results = this.index.query(innerRing.getEnvelopeInternal());
		for (var j = 0; j < results.size(); j++) {
			var searchRing = results.get(j);
			var searchRingPts = searchRing.getCoordinates();
			if (innerRing === searchRing) continue;
			if (!innerRing.getEnvelopeInternal().intersects(searchRing.getEnvelopeInternal())) continue;
			var innerRingPt = IsValidOp.findPtNotNode(innerRingPts, searchRing, this.graph);
			if (innerRingPt === null) continue;
			var isInside = CGAlgorithms.isPointInRing(innerRingPt, searchRingPts);
			if (isInside) {
				this.nestedPt = innerRingPt;
				return false;
			}
		}
	}
	return true;
};
IndexedNestedRingTester.prototype.add = function (ring) {
	this.rings.add(ring);
	this.totalEnv.expandToInclude(ring.getEnvelopeInternal());
};

