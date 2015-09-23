function SplitSegment(seg) {
	this.seg = null;
	this.segLen = null;
	this.splitPt = null;
	this.minimumLen = 0.0;
	if (arguments.length === 0) return;
	this.seg = seg;
	this.segLen = seg.getLength();
}
module.exports = SplitSegment
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
SplitSegment.prototype.splitAt = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [length, endPt] = args;
				var actualLen = this.getConstrainedLength(length);
				var frac = actualLen / this.segLen;
				if (endPt.equals2D(this.seg.p0)) this.splitPt = this.seg.pointAlong(frac); else this.splitPt = SplitSegment.pointAlongReverse(this.seg, frac);
			})(...args);
		case 1:
			return ((...args) => {
				let [pt] = args;
				var minFrac = this.minimumLen / this.segLen;
				if (pt.distance(this.seg.p0) < this.minimumLen) {
					this.splitPt = this.seg.pointAlong(minFrac);
					return null;
				}
				if (pt.distance(this.seg.p1) < this.minimumLen) {
					this.splitPt = SplitSegment.pointAlongReverse(this.seg, minFrac);
					return null;
				}
				this.splitPt = pt;
			})(...args);
	}
};
SplitSegment.prototype.setMinimumLength = function (minLen) {
	this.minimumLen = minLen;
};
SplitSegment.prototype.getConstrainedLength = function (len) {
	if (len < this.minimumLen) return this.minimumLen;
	return len;
};
SplitSegment.prototype.getSplitPoint = function () {
	return this.splitPt;
};
SplitSegment.pointAlongReverse = function (seg, segmentLengthFraction) {
	var coord = new Coordinate();
	coord.x = seg.p1.x - segmentLengthFraction * (seg.p1.x - seg.p0.x);
	coord.y = seg.p1.y - segmentLengthFraction * (seg.p1.y - seg.p0.y);
	return coord;
};

