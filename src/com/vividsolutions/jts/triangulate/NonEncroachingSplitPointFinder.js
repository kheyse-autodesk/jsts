function NonEncroachingSplitPointFinder() {
	if (arguments.length === 0) return;
}
module.exports = NonEncroachingSplitPointFinder
var SplitSegment = require('com/vividsolutions/jts/triangulate/SplitSegment');
NonEncroachingSplitPointFinder.prototype.findSplitPoint = function (seg, encroachPt) {
	var lineSeg = seg.getLineSegment();
	var segLen = lineSeg.getLength();
	var midPtLen = segLen / 2;
	var splitSeg = new SplitSegment(lineSeg);
	var projPt = NonEncroachingSplitPointFinder.projectedSplitPoint(seg, encroachPt);
	var nonEncroachDiam = projPt.distance(encroachPt) * 2 * 0.8;
	var maxSplitLen = nonEncroachDiam;
	if (maxSplitLen > midPtLen) {
		maxSplitLen = midPtLen;
	}
	splitSeg.setMinimumLength(maxSplitLen);
	splitSeg.splitAt(projPt);
	return splitSeg.getSplitPoint();
};
NonEncroachingSplitPointFinder.projectedSplitPoint = function (seg, encroachPt) {
	var lineSeg = seg.getLineSegment();
	var projPt = lineSeg.project(encroachPt);
	return projPt;
};

