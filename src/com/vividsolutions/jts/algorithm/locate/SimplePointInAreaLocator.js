import Location from 'com/vividsolutions/jts/geom/Location';
import CGAlgorithms from 'com/vividsolutions/jts/algorithm/CGAlgorithms';
import Polygon from 'com/vividsolutions/jts/geom/Polygon';
import PointOnGeometryLocator from 'com/vividsolutions/jts/algorithm/locate/PointOnGeometryLocator';
import GeometryCollectionIterator from 'com/vividsolutions/jts/geom/GeometryCollectionIterator';
import GeometryCollection from 'com/vividsolutions/jts/geom/GeometryCollection';
export default class SimplePointInAreaLocator {
	constructor(...args) {
		(() => {
			this.geom = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geom] = args;
						this.geom = geom;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [PointOnGeometryLocator];
	}
	static isPointInRing(p, ring) {
		if (!ring.getEnvelopeInternal().intersects(p)) return false;
		return CGAlgorithms.isPointInRing(p, ring.getCoordinates());
	}
	static containsPointInPolygon(p, poly) {
		if (poly.isEmpty()) return false;
		var shell = poly.getExteriorRing();
		if (!SimplePointInAreaLocator.isPointInRing(p, shell)) return false;
		for (var i = 0; i < poly.getNumInteriorRing(); i++) {
			var hole = poly.getInteriorRingN(i);
			if (SimplePointInAreaLocator.isPointInRing(p, hole)) return false;
		}
		return true;
	}
	static containsPoint(p, geom) {
		if (geom instanceof Polygon) {
			return SimplePointInAreaLocator.containsPointInPolygon(p, geom);
		} else if (geom instanceof GeometryCollection) {
			var geomi = new GeometryCollectionIterator(geom);
			while (geomi.hasNext()) {
				var g2 = geomi.next();
				if (g2 !== geom) if (SimplePointInAreaLocator.containsPoint(p, g2)) return true;
			}
		}
		return false;
	}
	static locate(p, geom) {
		if (geom.isEmpty()) return Location.EXTERIOR;
		if (SimplePointInAreaLocator.containsPoint(p, geom)) return Location.INTERIOR;
		return Location.EXTERIOR;
	}
	locate(p) {
		return SimplePointInAreaLocator.locate(p, this.geom);
	}
	getClass() {
		return SimplePointInAreaLocator;
	}
}

