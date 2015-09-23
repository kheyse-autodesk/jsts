function SubgraphDepthLocater(subgraphs) {
	this.subgraphs = null;
	this.seg = new LineSegment();
	this.cga = new CGAlgorithms();
	if (arguments.length === 0) return;
	this.subgraphs = subgraphs;
}
module.exports = SubgraphDepthLocater
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Collections = require('java/util/Collections');
var DirectedEdge = require('com/vividsolutions/jts/geomgraph/DirectedEdge');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
var ArrayList = require('java/util/ArrayList');
var List = require('java/util/List');
SubgraphDepthLocater.prototype.findStabbedSegments = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [stabbingRayLeftPt] = args;
				var stabbedSegments = new ArrayList();
				for (var i = this.subgraphs.iterator(); i.hasNext(); ) {
					var bsg = i.next();
					var env = bsg.getEnvelope();
					if (stabbingRayLeftPt.y < env.getMinY() || stabbingRayLeftPt.y > env.getMaxY()) continue;
					this.findStabbedSegments(stabbingRayLeftPt, bsg.getDirectedEdges(), stabbedSegments);
				}
				return stabbedSegments;
			})(...args);
		case 3:
			if (args[2] instanceof List && args[0] instanceof Coordinate && args[1] instanceof List) {
				return ((...args) => {
					let [stabbingRayLeftPt, dirEdges, stabbedSegments] = args;
					for (var i = dirEdges.iterator(); i.hasNext(); ) {
						var de = i.next();
						if (!de.isForward()) continue;
						this.findStabbedSegments(stabbingRayLeftPt, de, stabbedSegments);
					}
				})(...args);
			} else if (args[2] instanceof List && args[0] instanceof Coordinate && args[1] instanceof DirectedEdge) {
				return ((...args) => {
					let [stabbingRayLeftPt, dirEdge, stabbedSegments] = args;
					var pts = dirEdge.getEdge().getCoordinates();
					for (var i = 0; i < pts.length - 1; i++) {
						this.seg.p0 = pts[i];
						this.seg.p1 = pts[i + 1];
						if (this.seg.p0.y > this.seg.p1.y) this.seg.reverse();
						var maxx = Math.max(this.seg.p0.x, this.seg.p1.x);
						if (maxx < stabbingRayLeftPt.x) continue;
						if (this.seg.isHorizontal()) continue;
						if (stabbingRayLeftPt.y < this.seg.p0.y || stabbingRayLeftPt.y > this.seg.p1.y) continue;
						if (CGAlgorithms.computeOrientation(this.seg.p0, this.seg.p1, stabbingRayLeftPt) === CGAlgorithms.RIGHT) continue;
						var depth = dirEdge.getDepth(Position.LEFT);
						if (!this.seg.p0.equals(pts[i])) depth = dirEdge.getDepth(Position.RIGHT);
						var ds = new DepthSegment(this.seg, depth);
						stabbedSegments.add(ds);
					}
				})(...args);
			}
	}
};
SubgraphDepthLocater.prototype.getDepth = function (p) {
	var stabbedSegments = this.findStabbedSegments(p);
	if (stabbedSegments.size() === 0) return 0;
	var ds = Collections.min(stabbedSegments);
	return ds.leftDepth;
};
function DepthSegment(seg, depth) {
	this.upwardSeg = null;
	this.leftDepth = null;
	if (arguments.length === 0) return;
	this.upwardSeg = new LineSegment(seg);
	this.leftDepth = depth;
}
DepthSegment.prototype.compareTo = function (obj) {
	var other = obj;
	if (this.upwardSeg.minX() >= other.upwardSeg.maxX()) return 1;
	if (this.upwardSeg.maxX() <= other.upwardSeg.minX()) return -1;
	var orientIndex = this.upwardSeg.orientationIndex(other.upwardSeg);
	if (orientIndex !== 0) return orientIndex;
	orientIndex = -1 * other.upwardSeg.orientationIndex(this.upwardSeg);
	if (orientIndex !== 0) return orientIndex;
	return this.upwardSeg.compareTo(other.upwardSeg);
};
DepthSegment.prototype.compareX = function (seg0, seg1) {
	var compare0 = seg0.p0.compareTo(seg1.p0);
	if (compare0 !== 0) return compare0;
	return seg0.p1.compareTo(seg1.p1);
};
DepthSegment.prototype.toString = function () {
	return this.upwardSeg.toString();
};
SubgraphDepthLocater.DepthSegment = DepthSegment;

