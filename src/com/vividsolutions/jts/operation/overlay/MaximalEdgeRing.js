function MaximalEdgeRing(start, geometryFactory) {
	if (arguments.length === 0) return;
	MaximalEdgeRing.super_.call(this, start, geometryFactory);
}
module.exports = MaximalEdgeRing
var EdgeRing = require('com/vividsolutions/jts/geomgraph/EdgeRing');
var util = require('util');
util.inherits(MaximalEdgeRing, EdgeRing)
var MinimalEdgeRing = require('com/vividsolutions/jts/operation/overlay/MinimalEdgeRing');
var ArrayList = require('java/util/ArrayList');
MaximalEdgeRing.prototype.buildMinimalRings = function () {
	var minEdgeRings = new ArrayList();
	var de = this.startDe;
	do {
		if (de.getMinEdgeRing() === null) {
			var minEr = new MinimalEdgeRing(de, this.geometryFactory);
			minEdgeRings.add(minEr);
		}
		de = de.getNext();
	} while (de !== this.startDe);
	return minEdgeRings;
};
MaximalEdgeRing.prototype.setEdgeRing = function (de, er) {
	de.setEdgeRing(er);
};
MaximalEdgeRing.prototype.linkDirectedEdgesForMinimalEdgeRings = function () {
	var de = this.startDe;
	do {
		var node = de.getNode();
		node.getEdges().linkMinimalDirectedEdges(this);
		de = de.getNext();
	} while (de !== this.startDe);
};
MaximalEdgeRing.prototype.getNext = function (de) {
	return de.getNext();
};

