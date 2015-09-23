function InteriorIntersectionFinder(li) {
	this.findAllIntersections = false;
	this.isCheckEndSegmentsOnly = false;
	this.li = null;
	this.interiorIntersection = null;
	this.intSegments = null;
	this.intersections = new ArrayList();
	this.intersectionCount = 0;
	this.keepIntersections = true;
	if (arguments.length === 0) return;
	this.li = li;
	this.interiorIntersection = null;
}
module.exports = InteriorIntersectionFinder
var ArrayList = require('java/util/ArrayList');
InteriorIntersectionFinder.prototype.getInteriorIntersection = function () {
	return this.interiorIntersection;
};
InteriorIntersectionFinder.prototype.setCheckEndSegmentsOnly = function (isCheckEndSegmentsOnly) {
	this.isCheckEndSegmentsOnly = isCheckEndSegmentsOnly;
};
InteriorIntersectionFinder.prototype.getIntersectionSegments = function () {
	return this.intSegments;
};
InteriorIntersectionFinder.prototype.count = function () {
	return this.intersectionCount;
};
InteriorIntersectionFinder.prototype.getIntersections = function () {
	return this.intersections;
};
InteriorIntersectionFinder.prototype.setFindAllIntersections = function (findAllIntersections) {
	this.findAllIntersections = findAllIntersections;
};
InteriorIntersectionFinder.prototype.setKeepIntersections = function (keepIntersections) {
	this.keepIntersections = keepIntersections;
};
InteriorIntersectionFinder.prototype.processIntersections = function (e0, segIndex0, e1, segIndex1) {
	if (!this.findAllIntersections && this.hasIntersection()) return null;
	if (e0 === e1 && segIndex0 === segIndex1) return null;
	if (this.isCheckEndSegmentsOnly) {
		var isEndSegPresent = this.isEndSegment(e0, segIndex0) || this.isEndSegment(e1, segIndex1);
		if (!isEndSegPresent) return null;
	}
	var p00 = e0.getCoordinates()[segIndex0];
	var p01 = e0.getCoordinates()[segIndex0 + 1];
	var p10 = e1.getCoordinates()[segIndex1];
	var p11 = e1.getCoordinates()[segIndex1 + 1];
	this.li.computeIntersection(p00, p01, p10, p11);
	if (this.li.hasIntersection()) {
		if (this.li.isInteriorIntersection()) {
			this.intSegments = [];
			this.intSegments[0] = p00;
			this.intSegments[1] = p01;
			this.intSegments[2] = p10;
			this.intSegments[3] = p11;
			this.interiorIntersection = this.li.getIntersection(0);
			if (this.keepIntersections) this.intersections.add(this.interiorIntersection);
			this.intersectionCount++;
		}
	}
};
InteriorIntersectionFinder.prototype.isEndSegment = function (segStr, index) {
	if (index === 0) return true;
	if (index >= segStr.size() - 2) return true;
	return false;
};
InteriorIntersectionFinder.prototype.hasIntersection = function () {
	return this.interiorIntersection !== null;
};
InteriorIntersectionFinder.prototype.isDone = function () {
	if (this.findAllIntersections) return false;
	return this.interiorIntersection !== null;
};
InteriorIntersectionFinder.createAllIntersectionsFinder = function (li) {
	var finder = new InteriorIntersectionFinder(li);
	finder.setFindAllIntersections(true);
	return finder;
};
InteriorIntersectionFinder.createAnyIntersectionFinder = function (li) {
	return new InteriorIntersectionFinder(li);
};
InteriorIntersectionFinder.createIntersectionCounter = function (li) {
	var finder = new InteriorIntersectionFinder(li);
	finder.setFindAllIntersections(true);
	finder.setKeepIntersections(false);
	return finder;
};

