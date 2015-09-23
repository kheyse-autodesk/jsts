function EdgeSetNoder(li) {
	this.li = null;
	this.inputEdges = new ArrayList();
	if (arguments.length === 0) return;
	this.li = li;
}
module.exports = EdgeSetNoder
var SimpleMCSweepLineIntersector = require('com/vividsolutions/jts/geomgraph/index/SimpleMCSweepLineIntersector');
var SegmentIntersector = require('com/vividsolutions/jts/geomgraph/index/SegmentIntersector');
var ArrayList = require('java/util/ArrayList');
EdgeSetNoder.prototype.addEdges = function (edges) {
	this.inputEdges.addAll(edges);
};
EdgeSetNoder.prototype.getNodedEdges = function () {
	var esi = new SimpleMCSweepLineIntersector();
	var si = new SegmentIntersector(this.li, true, false);
	esi.computeIntersections(this.inputEdges, si, true);
	var splitEdges = new ArrayList();
	for (var i = this.inputEdges.iterator(); i.hasNext(); ) {
		var e = i.next();
		e.getEdgeIntersectionList().addSplitEdges(splitEdges);
	}
	return splitEdges;
};

