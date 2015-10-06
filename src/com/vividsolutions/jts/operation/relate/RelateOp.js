import Geometry from 'com/vividsolutions/jts/geom/Geometry';
import RelateComputer from 'com/vividsolutions/jts/operation/relate/RelateComputer';
import BoundaryNodeRule from 'com/vividsolutions/jts/algorithm/BoundaryNodeRule';
import GeometryGraphOperation from 'com/vividsolutions/jts/operation/GeometryGraphOperation';
import RectangleContains from 'com/vividsolutions/jts/operation/predicate/RectangleContains';
import RectangleIntersects from 'com/vividsolutions/jts/operation/predicate/RectangleIntersects';
export default class RelateOp extends GeometryGraphOperation {
	constructor(...args) {
		super();
		(() => {
			this.relate = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [g0, g1] = args;
						super(g0, g1);
						this.relate = new RelateComputer(this.arg);
					})(...args);
				case 3:
					return ((...args) => {
						let [g0, g1, boundaryNodeRule] = args;
						super(g0, g1, boundaryNodeRule);
						this.relate = new RelateComputer(this.arg);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static covers(g1, g2) {
		if (!g1.getEnvelopeInternal().covers(g2.getEnvelopeInternal())) return false;
		if (g1.isRectangle()) {
			return true;
		}
		return RelateOp.relate(g1, g2).isCovers();
	}
	static intersects(g1, g2) {
		if (!g1.getEnvelopeInternal().intersects(g2.getEnvelopeInternal())) return false;
		if (g1.isRectangle()) {
			return RectangleIntersects.intersects(g1, g2);
		}
		if (g2.isRectangle()) {
			return RectangleIntersects.intersects(g2, g1);
		}
		return RelateOp.relate(g1, g2).isIntersects();
	}
	static touches(g1, g2) {
		if (!g1.getEnvelopeInternal().intersects(g2.getEnvelopeInternal())) return false;
		return RelateOp.relate(g1, g2).isTouches(g1.getDimension(), g2.getDimension());
	}
	static within(g1, g2) {
		return RelateOp.contains(g1, g2);
	}
	static equalsTopo(g1, g2) {
		if (!g1.getEnvelopeInternal().equals(g2.getEnvelopeInternal())) return false;
		return RelateOp.relate(g1, g2).isEquals(g1.getDimension(), g2.getDimension());
	}
	static coveredBy(g1, g2) {
		return RelateOp.covers(g1, g2);
	}
	static relate(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [a, b] = args;
						var relOp = new RelateOp(a, b);
						var im = relOp.getIntersectionMatrix();
						return im;
					})(...args);
				case 3:
					if (typeof args[2] === "string" && args[0] instanceof Geometry && args[1] instanceof Geometry) {
						return ((...args) => {
							let [g1, g2, intersectionPattern] = args;
							return RelateOp.relate(g1, g2).matches(intersectionPattern);
						})(...args);
					} else if (args[2].interfaces_ && args[2].interfaces_.indexOf(BoundaryNodeRule) > -1 && args[0] instanceof Geometry && args[1] instanceof Geometry) {
						return ((...args) => {
							let [a, b, boundaryNodeRule] = args;
							var relOp = new RelateOp(a, b, boundaryNodeRule);
							var im = relOp.getIntersectionMatrix();
							return im;
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	static overlaps(g1, g2) {
		if (!g1.getEnvelopeInternal().intersects(g2.getEnvelopeInternal())) return false;
		return RelateOp.relate(g1, g2).isOverlaps(g1.getDimension(), g2.getDimension());
	}
	static disjoint(g1, g2) {
		return !RelateOp.intersects(g1, g2);
	}
	static crosses(g1, g2) {
		if (!g1.getEnvelopeInternal().intersects(g2.getEnvelopeInternal())) return false;
		return RelateOp.relate(g1, g2).isCrosses(g1.getDimension(), g2.getDimension());
	}
	static contains(g1, g2) {
		if (!g1.getEnvelopeInternal().contains(g2.getEnvelopeInternal())) return false;
		if (g1.isRectangle()) {
			return RectangleContains.contains(g1, g2);
		}
		return RelateOp.relate(g1, g2).isContains();
	}
	getIntersectionMatrix() {
		return this.relate.computeIM();
	}
}

