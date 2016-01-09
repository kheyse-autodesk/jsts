import PointLocator from '../../algorithm/PointLocator';
import ComponentCoordinateExtracter from '../util/ComponentCoordinateExtracter';
import PreparedGeometry from './PreparedGeometry';
export default class BasicPreparedGeometry {
	constructor(...args) {
		(() => {
			this.baseGeom = null;
			this.representativePts = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geom] = args;
						this.baseGeom = geom;
						this.representativePts = ComponentCoordinateExtracter.getCoordinates(geom);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [PreparedGeometry];
	}
	getRepresentativePoints() {
		return this.representativePts;
	}
	containsProperly(g) {
		if (!this.baseGeom.getEnvelopeInternal().contains(g.getEnvelopeInternal())) return false;
		return this.baseGeom.relate(g, "T**FF*FF*");
	}
	getGeometry() {
		return this.baseGeom;
	}
	envelopesIntersect(g) {
		if (!this.baseGeom.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) return false;
		return true;
	}
	covers(g) {
		return this.baseGeom.covers(g);
	}
	intersects(g) {
		return this.baseGeom.intersects(g);
	}
	touches(g) {
		return this.baseGeom.touches(g);
	}
	within(g) {
		return this.baseGeom.within(g);
	}
	isAnyTargetComponentInTest(testGeom) {
		var locator = new PointLocator();
		for (var i = this.representativePts.iterator(); i.hasNext(); ) {
			var p = i.next();
			if (locator.intersects(p, testGeom)) return true;
		}
		return false;
	}
	coveredBy(g) {
		return this.baseGeom.coveredBy(g);
	}
	overlaps(g) {
		return this.baseGeom.overlaps(g);
	}
	toString() {
		return this.baseGeom.toString();
	}
	disjoint(g) {
		return !this.intersects(g);
	}
	crosses(g) {
		return this.baseGeom.crosses(g);
	}
	contains(g) {
		return this.baseGeom.contains(g);
	}
	envelopeCovers(g) {
		if (!this.baseGeom.getEnvelopeInternal().covers(g.getEnvelopeInternal())) return false;
		return true;
	}
	getClass() {
		return BasicPreparedGeometry;
	}
}

