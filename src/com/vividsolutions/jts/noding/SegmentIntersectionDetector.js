function SegmentIntersectionDetector(...args) {
	this.li = null;
	this.findProper = false;
	this.findAllTypes = false;
	this.hasIntersection = false;
	this.hasProperIntersection = false;
	this.hasNonProperIntersection = false;
	this.intPt = null;
	this.intSegments = null;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [li] = args;
				this.li = li;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				SegmentIntersectionDetector.call(this, new RobustLineIntersector());
			})(...args);
	}
}
module.exports = SegmentIntersectionDetector
var RobustLineIntersector = require('com/vividsolutions/jts/algorithm/RobustLineIntersector');
SegmentIntersectionDetector.prototype.getIntersectionSegments = function () {
	return this.intSegments;
};
SegmentIntersectionDetector.prototype.setFindAllIntersectionTypes = function (findAllTypes) {
	this.findAllTypes = findAllTypes;
};
SegmentIntersectionDetector.prototype.hasProperIntersection = function () {
	return this.hasProperIntersection;
};
SegmentIntersectionDetector.prototype.getIntersection = function () {
	return this.intPt;
};
SegmentIntersectionDetector.prototype.processIntersections = function (e0, segIndex0, e1, segIndex1) {
	if (e0 === e1 && segIndex0 === segIndex1) return null;
	var p00 = e0.getCoordinates()[segIndex0];
	var p01 = e0.getCoordinates()[segIndex0 + 1];
	var p10 = e1.getCoordinates()[segIndex1];
	var p11 = e1.getCoordinates()[segIndex1 + 1];
	this.li.computeIntersection(p00, p01, p10, p11);
	if (this.li.hasIntersection()) {
		this.hasIntersection = true;
		var isProper = this.li.isProper();
		if (isProper) this.hasProperIntersection = true;
		if (!isProper) this.hasNonProperIntersection = true;
		var saveLocation = true;
		if (this.findProper && !isProper) saveLocation = false;
		if (this.intPt === null || saveLocation) {
			this.intPt = this.li.getIntersection(0);
			this.intSegments = [];
			this.intSegments[0] = p00;
			this.intSegments[1] = p01;
			this.intSegments[2] = p10;
			this.intSegments[3] = p11;
		}
	}
};
SegmentIntersectionDetector.prototype.hasIntersection = function () {
	return this.hasIntersection;
};
SegmentIntersectionDetector.prototype.isDone = function () {
	if (this.findAllTypes) {
		return this.hasProperIntersection && this.hasNonProperIntersection;
	}
	if (this.findProper) {
		return this.hasProperIntersection;
	}
	return this.hasIntersection;
};
SegmentIntersectionDetector.prototype.hasNonProperIntersection = function () {
	return this.hasNonProperIntersection;
};
SegmentIntersectionDetector.prototype.setFindProper = function (findProper) {
	this.findProper = findProper;
};

