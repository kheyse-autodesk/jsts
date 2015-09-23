function MCPointInRing(ring) {
	this.ring = null;
	this.tree = null;
	this.crossings = 0;
	this.interval = new Interval();
	if (arguments.length === 0) return;
	this.ring = ring;
	this.buildIndex();
}
module.exports = MCPointInRing
var Bintree = require('com/vividsolutions/jts/index/bintree/Bintree');
var Interval = require('com/vividsolutions/jts/index/bintree/Interval');
var Double = require('java/lang/Double');
var MonotoneChainBuilder = require('com/vividsolutions/jts/index/chain/MonotoneChainBuilder');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var RobustDeterminant = require('com/vividsolutions/jts/algorithm/RobustDeterminant');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
MCPointInRing.prototype.testLineSegment = function (p, seg) {
	var xInt = null;
	var x1 = null;
	var y1 = null;
	var x2 = null;
	var y2 = null;
	var p1 = seg.p0;
	var p2 = seg.p1;
	x1 = p1.x - p.x;
	y1 = p1.y - p.y;
	x2 = p2.x - p.x;
	y2 = p2.y - p.y;
	if (y1 > 0 && y2 <= 0 || y2 > 0 && y1 <= 0) {
		xInt = RobustDeterminant.signOfDet2x2(x1, y1, x2, y2) / (y2 - y1);
		if (0.0 < xInt) {
			this.crossings++;
		}
	}
};
MCPointInRing.prototype.buildIndex = function () {
	this.tree = new Bintree();
	var pts = CoordinateArrays.removeRepeatedPoints(this.ring.getCoordinates());
	var mcList = MonotoneChainBuilder.getChains(pts);
	for (var i = 0; i < mcList.size(); i++) {
		var mc = mcList.get(i);
		var mcEnv = mc.getEnvelope();
		this.interval.min = mcEnv.getMinY();
		this.interval.max = mcEnv.getMaxY();
		this.tree.insert(this.interval, mc);
	}
};
MCPointInRing.prototype.testMonotoneChain = function (rayEnv, mcSelecter, mc) {
	mc.select(rayEnv, mcSelecter);
};
MCPointInRing.prototype.isInside = function (pt) {
	this.crossings = 0;
	var rayEnv = new Envelope(Double.NEGATIVE_INFINITY, Double.POSITIVE_INFINITY, pt.y, pt.y);
	this.interval.min = pt.y;
	this.interval.max = pt.y;
	var segs = this.tree.query(this.interval);
	var mcSelecter = new MCSelecter(pt);
	for (var i = segs.iterator(); i.hasNext(); ) {
		var mc = i.next();
		this.testMonotoneChain(rayEnv, mcSelecter, mc);
	}
	if (this.crossings % 2 === 1) {
		return true;
	}
	return false;
};

