import Collection from 'java/util/Collection';
import LineIntersector from 'com/vividsolutions/jts/algorithm/LineIntersector';
export default class SegmentIntersector {
	constructor(...args) {
		(() => {
			this.intersection = false;
			this.proper = false;
			this.properInterior = false;
			this.properIntersectionPoint = null;
			this.li = null;
			this.includeProper = null;
			this.recordIsolated = null;
			this.selfIntersection = null;
			this.numIntersections = 0;
			this.numTests = 0;
			this.bdyNodes = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 3:
					return ((...args) => {
						let [li, includeProper, recordIsolated] = args;
						this.li = li;
						this.includeProper = includeProper;
						this.recordIsolated = recordIsolated;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static isAdjacentSegments(i1, i2) {
		return Math.abs(i1 - i2) === 1;
	}
	isTrivialIntersection(e0, segIndex0, e1, segIndex1) {
		if (e0 === e1) {
			if (this.li.getIntersectionNum() === 1) {
				if (SegmentIntersector.isAdjacentSegments(segIndex0, segIndex1)) return true;
				if (e0.isClosed()) {
					var maxSegIndex = e0.getNumPoints() - 1;
					if (segIndex0 === 0 && segIndex1 === maxSegIndex || segIndex1 === 0 && segIndex0 === maxSegIndex) {
						return true;
					}
				}
			}
		}
		return false;
	}
	getProperIntersectionPoint() {
		return this.properIntersectionPoint;
	}
	hasProperInteriorIntersection() {
		return this.properInterior;
	}
	hasProperIntersection() {
		return this.proper;
	}
	hasIntersection() {
		return this.intersection;
	}
	isBoundaryPoint(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					if (args[0] instanceof LineIntersector && args[1].interfaces_ && args[1].interfaces_.indexOf(Collection) > -1) {
						return ((...args) => {
							let [li, bdyNodes] = args;
							for (var i = bdyNodes.iterator(); i.hasNext(); ) {
								var node = i.next();
								var pt = node.getCoordinate();
								if (li.isIntersection(pt)) return true;
							}
							return false;
						})(...args);
					} else if (args[0] instanceof LineIntersector && args[1] instanceof Array) {
						return ((...args) => {
							let [li, bdyNodes] = args;
							if (bdyNodes === null) return false;
							if (this.isBoundaryPoint(li, bdyNodes[0])) return true;
							if (this.isBoundaryPoint(li, bdyNodes[1])) return true;
							return false;
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	setBoundaryNodes(bdyNodes0, bdyNodes1) {
		this.bdyNodes = [];
		this.bdyNodes[0] = bdyNodes0;
		this.bdyNodes[1] = bdyNodes1;
	}
	addIntersections(e0, segIndex0, e1, segIndex1) {
		if (e0 === e1 && segIndex0 === segIndex1) return null;
		this.numTests++;
		var p00 = e0.getCoordinates()[segIndex0];
		var p01 = e0.getCoordinates()[segIndex0 + 1];
		var p10 = e1.getCoordinates()[segIndex1];
		var p11 = e1.getCoordinates()[segIndex1 + 1];
		this.li.computeIntersection(p00, p01, p10, p11);
		if (this.li.hasIntersection()) {
			if (this.recordIsolated) {
				e0.setIsolated(false);
				e1.setIsolated(false);
			}
			this.numIntersections++;
			if (!this.isTrivialIntersection(e0, segIndex0, e1, segIndex1)) {
				this.intersection = true;
				if (this.includeProper || !this.li.isProper()) {
					e0.addIntersections(this.li, segIndex0, 0);
					e1.addIntersections(this.li, segIndex1, 1);
				}
				if (this.li.isProper()) {
					this.properIntersectionPoint = this.li.getIntersection(0).clone();
					this.proper = true;
					if (!this.isBoundaryPoint(this.li, this.bdyNodes)) this.properInterior = true;
				}
			}
		}
	}
}

