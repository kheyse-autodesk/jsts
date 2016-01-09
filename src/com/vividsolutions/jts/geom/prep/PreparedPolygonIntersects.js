import SegmentStringUtil from '../../noding/SegmentStringUtil';
import PreparedPolygonPredicate from './PreparedPolygonPredicate';
export default class PreparedPolygonIntersects extends PreparedPolygonPredicate {
	constructor(...args) {
		super();
		(() => {})();
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
	static intersects(prep, geom) {
		var polyInt = new PreparedPolygonIntersects(prep);
		return polyInt.intersects(geom);
	}
	intersects(geom) {
		var isInPrepGeomArea = this.isAnyTestComponentInTarget(geom);
		if (isInPrepGeomArea) return true;
		if (geom.getDimension() === 0) return false;
		var lineSegStr = SegmentStringUtil.extractSegmentStrings(geom);
		if (lineSegStr.size() > 0) {
			var segsIntersect = this.prepPoly.getIntersectionFinder().intersects(lineSegStr);
			if (segsIntersect) return true;
		}
		if (geom.getDimension() === 2) {
			var isPrepGeomInArea = this.isAnyTargetComponentInAreaTest(geom, this.prepPoly.getRepresentativePoints());
			if (isPrepGeomInArea) return true;
		}
		return false;
	}
	getClass() {
		return PreparedPolygonIntersects;
	}
}

