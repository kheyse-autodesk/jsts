function QuadtreeNestedRingTester(graph) {
	this.graph = null;
	this.rings = new ArrayList();
	this.totalEnv = new Envelope();
	this.quadtree = null;
	this.nestedPt = null;
	if (arguments.length === 0) return;
	this.graph = graph;
}
module.exports = QuadtreeNestedRingTester
var Quadtree = require('com/vividsolutions/jts/index/quadtree/Quadtree');
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var IsValidOp = require('com/vividsolutions/jts/operation/valid/IsValidOp');
var ArrayList = require('java/util/ArrayList');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
var Assert = require('com/vividsolutions/jts/util/Assert');
QuadtreeNestedRingTester.prototype.getNestedPoint = function () {
	return this.nestedPt;
};
QuadtreeNestedRingTester.prototype.isNonNested = function () {
	this.buildQuadtree();
	for (var i = 0; i < this.rings.size(); i++) {
		var innerRing = this.rings.get(i);
		var innerRingPts = innerRing.getCoordinates();
		var results = this.quadtree.query(innerRing.getEnvelopeInternal());
		for (var j = 0; j < results.size(); j++) {
			var searchRing = results.get(j);
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
QuadtreeNestedRingTester.prototype.add = function (ring) {
	this.rings.add(ring);
	this.totalEnv.expandToInclude(ring.getEnvelopeInternal());
};
QuadtreeNestedRingTester.prototype.buildQuadtree = function () {
	this.quadtree = new Quadtree();
	for (var i = 0; i < this.rings.size(); i++) {
		var ring = this.rings.get(i);
		var env = ring.getEnvelopeInternal();
		this.quadtree.insert(env, ring);
	}
};

