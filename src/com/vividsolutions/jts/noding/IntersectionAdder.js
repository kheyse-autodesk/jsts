function IntersectionAdder(li) {
	this.hasIntersection = false;
	this.hasProper = false;
	this.hasProperInterior = false;
	this.hasInterior = false;
	this.properIntersectionPoint = null;
	this.li = null;
	this.isSelfIntersection = null;
	this.numIntersections = 0;
	this.numInteriorIntersections = 0;
	this.numProperIntersections = 0;
	this.numTests = 0;
	if (arguments.length === 0) return;
	this.li = li;
}
module.exports = IntersectionAdder
IntersectionAdder.prototype.isTrivialIntersection = function (e0, segIndex0, e1, segIndex1) {
	if (e0 === e1) {
		if (this.li.getIntersectionNum() === 1) {
			if (IntersectionAdder.isAdjacentSegments(segIndex0, segIndex1)) return true;
			if (e0.isClosed()) {
				var maxSegIndex = e0.size() - 1;
				if (segIndex0 === 0 && segIndex1 === maxSegIndex || segIndex1 === 0 && segIndex0 === maxSegIndex) {
					return true;
				}
			}
		}
	}
	return false;
};
IntersectionAdder.prototype.getProperIntersectionPoint = function () {
	return this.properIntersectionPoint;
};
IntersectionAdder.prototype.hasProperInteriorIntersection = function () {
	return this.hasProperInterior;
};
IntersectionAdder.prototype.getLineIntersector = function () {
	return this.li;
};
IntersectionAdder.prototype.hasProperIntersection = function () {
	return this.hasProper;
};
IntersectionAdder.prototype.processIntersections = function (e0, segIndex0, e1, segIndex1) {
	if (e0 === e1 && segIndex0 === segIndex1) return null;
	this.numTests++;
	var p00 = e0.getCoordinates()[segIndex0];
	var p01 = e0.getCoordinates()[segIndex0 + 1];
	var p10 = e1.getCoordinates()[segIndex1];
	var p11 = e1.getCoordinates()[segIndex1 + 1];
	this.li.computeIntersection(p00, p01, p10, p11);
	if (this.li.hasIntersection()) {
		this.numIntersections++;
		if (this.li.isInteriorIntersection()) {
			this.numInteriorIntersections++;
			this.hasInterior = true;
		}
		if (!this.isTrivialIntersection(e0, segIndex0, e1, segIndex1)) {
			this.hasIntersection = true;
			e0.addIntersections(this.li, segIndex0, 0);
			e1.addIntersections(this.li, segIndex1, 1);
			if (this.li.isProper()) {
				this.numProperIntersections++;
				this.hasProper = true;
				this.hasProperInterior = true;
			}
		}
	}
};
IntersectionAdder.prototype.hasIntersection = function () {
	return this.hasIntersection;
};
IntersectionAdder.prototype.isDone = function () {
	return false;
};
IntersectionAdder.prototype.hasInteriorIntersection = function () {
	return this.hasInterior;
};
IntersectionAdder.isAdjacentSegments = function (i1, i2) {
	return Math.abs(i1 - i2) === 1;
};

