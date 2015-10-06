import SegmentIntersector from 'com/vividsolutions/jts/noding/SegmentIntersector';
import RobustLineIntersector from 'com/vividsolutions/jts/algorithm/RobustLineIntersector';
export default class SegmentIntersectionDetector {
	constructor(...args) {
		(() => {
			this.li = null;
			this.findProper = false;
			this.findAllTypes = false;
			this.hasIntersection = false;
			this.hasProperIntersection = false;
			this.hasNonProperIntersection = false;
			this.intPt = null;
			this.intSegments = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						overloads.call(this, new RobustLineIntersector());
					})(...args);
				case 1:
					return ((...args) => {
						let [li] = args;
						this.li = li;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [SegmentIntersector];
	}
	getIntersectionSegments() {
		return this.intSegments;
	}
	setFindAllIntersectionTypes(findAllTypes) {
		this.findAllTypes = findAllTypes;
	}
	hasProperIntersection() {
		return this.hasProperIntersection;
	}
	getIntersection() {
		return this.intPt;
	}
	processIntersections(e0, segIndex0, e1, segIndex1) {
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
	}
	hasIntersection() {
		return this.hasIntersection;
	}
	isDone() {
		if (this.findAllTypes) {
			return this.hasProperIntersection && this.hasNonProperIntersection;
		}
		if (this.findProper) {
			return this.hasProperIntersection;
		}
		return this.hasIntersection;
	}
	hasNonProperIntersection() {
		return this.hasNonProperIntersection;
	}
	setFindProper(findProper) {
		this.findProper = findProper;
	}
}

