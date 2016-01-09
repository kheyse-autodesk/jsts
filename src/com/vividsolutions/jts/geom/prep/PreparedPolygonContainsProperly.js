import SegmentStringUtil from '../../noding/SegmentStringUtil';
import Polygonal from '../Polygonal';
import PreparedPolygonPredicate from './PreparedPolygonPredicate';
export default class PreparedPolygonContainsProperly extends PreparedPolygonPredicate {
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
	static containsProperly(prep, geom) {
		var polyInt = new PreparedPolygonContainsProperly(prep);
		return polyInt.containsProperly(geom);
	}
	containsProperly(geom) {
		var isAllInPrepGeomAreaInterior = this.isAllTestComponentsInTargetInterior(geom);
		if (!isAllInPrepGeomAreaInterior) return false;
		var lineSegStr = SegmentStringUtil.extractSegmentStrings(geom);
		var segsIntersect = this.prepPoly.getIntersectionFinder().intersects(lineSegStr);
		if (segsIntersect) return false;
		if (geom instanceof Polygonal) {
			var isTargetGeomInTestArea = this.isAnyTargetComponentInAreaTest(geom, this.prepPoly.getRepresentativePoints());
			if (isTargetGeomInTestArea) return false;
		}
		return true;
	}
	getClass() {
		return PreparedPolygonContainsProperly;
	}
}

