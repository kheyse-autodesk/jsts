function EdgeIntersectionList(edge) {
	this.nodeMap = new TreeMap();
	this.edge = null;
	if (arguments.length === 0) return;
	this.edge = edge;
}
module.exports = EdgeIntersectionList
var EdgeIntersection = require('com/vividsolutions/jts/geomgraph/EdgeIntersection');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Label = require('com/vividsolutions/jts/geomgraph/Label');
var Edge = require('com/vividsolutions/jts/geomgraph/Edge');
var TreeMap = require('java/util/TreeMap');
EdgeIntersectionList.prototype.print = function (out) {
	out.println("Intersections:");
	for (var it = this.iterator(); it.hasNext(); ) {
		var ei = it.next();
		ei.print(out);
	}
};
EdgeIntersectionList.prototype.iterator = function () {
	return this.nodeMap.values().iterator();
};
EdgeIntersectionList.prototype.addSplitEdges = function (edgeList) {
	this.addEndpoints();
	var it = this.iterator();
	var eiPrev = it.next();
	while (it.hasNext()) {
		var ei = it.next();
		var newEdge = this.createSplitEdge(eiPrev, ei);
		edgeList.add(newEdge);
		eiPrev = ei;
	}
};
EdgeIntersectionList.prototype.addEndpoints = function () {
	var maxSegIndex = this.edge.pts.length - 1;
	this.add(this.edge.pts[0], 0, 0.0);
	this.add(this.edge.pts[maxSegIndex], maxSegIndex, 0.0);
};
EdgeIntersectionList.prototype.createSplitEdge = function (ei0, ei1) {
	var npts = ei1.segmentIndex - ei0.segmentIndex + 2;
	var lastSegStartPt = this.edge.pts[ei1.segmentIndex];
	var useIntPt1 = ei1.dist > 0.0 || !ei1.coord.equals2D(lastSegStartPt);
	if (!useIntPt1) {
		npts--;
	}
	var pts = [];
	var ipt = 0;
	pts[ipt++] = new Coordinate(ei0.coord);
	for (var i = ei0.segmentIndex + 1; i <= ei1.segmentIndex; i++) {
		pts[ipt++] = this.edge.pts[i];
	}
	if (useIntPt1) pts[ipt] = ei1.coord;
	return new Edge(pts, new Label(this.edge.label));
};
EdgeIntersectionList.prototype.add = function (intPt, segmentIndex, dist) {
	var eiNew = new EdgeIntersection(intPt, segmentIndex, dist);
	var ei = this.nodeMap.get(eiNew);
	if (ei !== null) {
		return ei;
	}
	this.nodeMap.put(eiNew, eiNew);
	return eiNew;
};
EdgeIntersectionList.prototype.isIntersection = function (pt) {
	for (var it = this.iterator(); it.hasNext(); ) {
		var ei = it.next();
		if (ei.coord.equals(pt)) return true;
	}
	return false;
};

