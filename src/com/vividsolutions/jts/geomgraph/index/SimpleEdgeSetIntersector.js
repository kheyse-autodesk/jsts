function SimpleEdgeSetIntersector() {
	this.nOverlaps = null;
	if (arguments.length === 0) return;
}
module.exports = SimpleEdgeSetIntersector
var EdgeSetIntersector = require('com/vividsolutions/jts/geomgraph/index/EdgeSetIntersector');
var util = require('util');
util.inherits(SimpleEdgeSetIntersector, EdgeSetIntersector)
var SegmentIntersector = require('com/vividsolutions/jts/geomgraph/index/SegmentIntersector');
var List = require('java/util/List');
SimpleEdgeSetIntersector.prototype.computeIntersects = function (e0, e1, si) {
	var pts0 = e0.getCoordinates();
	var pts1 = e1.getCoordinates();
	for (var i0 = 0; i0 < pts0.length - 1; i0++) {
		for (var i1 = 0; i1 < pts1.length - 1; i1++) {
			si.addIntersections(e0, i0, e1, i1);
		}
	}
};
SimpleEdgeSetIntersector.prototype.computeIntersections = function (...args) {
	switch (args.length) {
		case 3:
			if (args[2] instanceof boolean && args[0] instanceof List && args[1] instanceof SegmentIntersector) {
				return ((...args) => {
					let [edges, si, testAllSegments] = args;
					this.nOverlaps = 0;
					for (var i0 = edges.iterator(); i0.hasNext(); ) {
						var edge0 = i0.next();
						for (var i1 = edges.iterator(); i1.hasNext(); ) {
							var edge1 = i1.next();
							if (testAllSegments || edge0 !== edge1) this.computeIntersects(edge0, edge1, si);
						}
					}
				})(...args);
			} else if (args[2] instanceof SegmentIntersector && args[0] instanceof List && args[1] instanceof List) {
				return ((...args) => {
					let [edges0, edges1, si] = args;
					this.nOverlaps = 0;
					for (var i0 = edges0.iterator(); i0.hasNext(); ) {
						var edge0 = i0.next();
						for (var i1 = edges1.iterator(); i1.hasNext(); ) {
							var edge1 = i1.next();
							this.computeIntersects(edge0, edge1, si);
						}
					}
				})(...args);
			}
	}
};

