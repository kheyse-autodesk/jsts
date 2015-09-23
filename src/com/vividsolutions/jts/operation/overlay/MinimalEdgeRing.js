function MinimalEdgeRing(start, geometryFactory) {
	if (arguments.length === 0) return;
	MinimalEdgeRing.super_.call(this, start, geometryFactory);
}
module.exports = MinimalEdgeRing
var EdgeRing = require('com/vividsolutions/jts/geomgraph/EdgeRing');
var util = require('util');
util.inherits(MinimalEdgeRing, EdgeRing)
MinimalEdgeRing.prototype.setEdgeRing = function (de, er) {
	de.setMinEdgeRing(er);
};
MinimalEdgeRing.prototype.getNext = function (de) {
	return de.getNextMin();
};

