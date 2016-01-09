import SegmentIntersectionDetector from '../../noding/SegmentIntersectionDetector';
import SegmentStringUtil from '../../noding/SegmentStringUtil';
import Polygonal from '../Polygonal';
import PreparedPolygonPredicate from './PreparedPolygonPredicate';
export default class AbstractPreparedPolygonContains extends PreparedPolygonPredicate {
	constructor(...args) {
		super();
		(() => {
			this.requireSomePointInInterior = true;
			this.hasSegmentIntersection = false;
			this.hasProperIntersection = false;
			this.hasNonProperIntersection = false;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [prepPoly] = args;
						super(prepPoly);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	eval(geom) {
		var isAllInTargetArea = this.isAllTestComponentsInTarget(geom);
		if (!isAllInTargetArea) return false;
		if (this.requireSomePointInInterior && geom.getDimension() === 0) {
			var isAnyInTargetInterior = this.isAnyTestComponentInTargetInterior(geom);
			return isAnyInTargetInterior;
		}
		var properIntersectionImpliesNotContained = this.isProperIntersectionImpliesNotContainedSituation(geom);
		this.findAndClassifyIntersections(geom);
		if (properIntersectionImpliesNotContained && this.hasProperIntersection) return false;
		if (this.hasSegmentIntersection && !this.hasNonProperIntersection) return false;
		if (this.hasSegmentIntersection) {
			return this.fullTopologicalPredicate(geom);
		}
		if (geom instanceof Polygonal) {
			var isTargetInTestArea = this.isAnyTargetComponentInAreaTest(geom, this.prepPoly.getRepresentativePoints());
			if (isTargetInTestArea) return false;
		}
		return true;
	}
	findAndClassifyIntersections(geom) {
		var lineSegStr = SegmentStringUtil.extractSegmentStrings(geom);
		var intDetector = new SegmentIntersectionDetector();
		intDetector.setFindAllIntersectionTypes(true);
		this.prepPoly.getIntersectionFinder().intersects(lineSegStr, intDetector);
		this.hasSegmentIntersection = intDetector.hasIntersection();
		this.hasProperIntersection = intDetector.hasProperIntersection();
		this.hasNonProperIntersection = intDetector.hasNonProperIntersection();
	}
	isProperIntersectionImpliesNotContainedSituation(testGeom) {
		if (testGeom instanceof Polygonal) return true;
		if (this.isSingleShell(this.prepPoly.getGeometry())) return true;
		return false;
	}
	isSingleShell(geom) {
		if (geom.getNumGeometries() !== 1) return false;
		var poly = geom.getGeometryN(0);
		var numHoles = poly.getNumInteriorRing();
		if (numHoles === 0) return true;
		return false;
	}
	getClass() {
		return AbstractPreparedPolygonContains;
	}
}

