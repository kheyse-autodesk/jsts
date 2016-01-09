import PointLocator from '../../algorithm/PointLocator';
import SegmentStringUtil from '../../noding/SegmentStringUtil';
import ComponentCoordinateExtracter from '../util/ComponentCoordinateExtracter';
export default class PreparedLineStringIntersects {
	constructor(...args) {
		(() => {
			this.prepLine = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [prepLine] = args;
						this.prepLine = prepLine;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static intersects(prep, geom) {
		var op = new PreparedLineStringIntersects(prep);
		return op.intersects(geom);
	}
	isAnyTestPointInTarget(testGeom) {
		var locator = new PointLocator();
		var coords = ComponentCoordinateExtracter.getCoordinates(testGeom);
		for (var i = coords.iterator(); i.hasNext(); ) {
			var p = i.next();
			if (locator.intersects(p, this.prepLine.getGeometry())) return true;
		}
		return false;
	}
	intersects(geom) {
		var lineSegStr = SegmentStringUtil.extractSegmentStrings(geom);
		if (lineSegStr.size() > 0) {
			var segsIntersect = this.prepLine.getIntersectionFinder().intersects(lineSegStr);
			if (segsIntersect) return true;
		}
		if (geom.getDimension() === 1) return false;
		if (geom.getDimension() === 2 && this.prepLine.isAnyTargetComponentInTest(geom)) return true;
		if (geom.getDimension() === 0) return this.isAnyTestPointInTarget(geom);
		return false;
	}
	getClass() {
		return PreparedLineStringIntersects;
	}
}

