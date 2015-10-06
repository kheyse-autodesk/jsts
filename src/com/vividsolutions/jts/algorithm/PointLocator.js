import Location from 'com/vividsolutions/jts/geom/Location';
import LineString from 'com/vividsolutions/jts/geom/LineString';
import CGAlgorithms from 'com/vividsolutions/jts/algorithm/CGAlgorithms';
import Geometry from 'com/vividsolutions/jts/geom/Geometry';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import Point from 'com/vividsolutions/jts/geom/Point';
import Polygon from 'com/vividsolutions/jts/geom/Polygon';
import BoundaryNodeRule from 'com/vividsolutions/jts/algorithm/BoundaryNodeRule';
import MultiPolygon from 'com/vividsolutions/jts/geom/MultiPolygon';
import GeometryCollectionIterator from 'com/vividsolutions/jts/geom/GeometryCollectionIterator';
import GeometryCollection from 'com/vividsolutions/jts/geom/GeometryCollection';
import MultiLineString from 'com/vividsolutions/jts/geom/MultiLineString';
export default class PointLocator {
	constructor(...args) {
		(() => {
			this.boundaryRule = BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;
			this.isIn = null;
			this.numBoundaries = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
				case 1:
					return ((...args) => {
						let [boundaryRule] = args;
						if (boundaryRule === null) throw new IllegalArgumentException("Rule must be non-null");
						this.boundaryRule = boundaryRule;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	locateInPolygonRing(p, ring) {
		if (!ring.getEnvelopeInternal().intersects(p)) return Location.EXTERIOR;
		return CGAlgorithms.locatePointInRing(p, ring.getCoordinates());
	}
	intersects(p, geom) {
		return this.locate(p, geom) !== Location.EXTERIOR;
	}
	updateLocationInfo(loc) {
		if (loc === Location.INTERIOR) this.isIn = true;
		if (loc === Location.BOUNDARY) this.numBoundaries++;
	}
	computeLocation(p, geom) {
		if (geom instanceof Point) {
			this.updateLocationInfo(this.locate(p, geom));
		}
		if (geom instanceof LineString) {
			this.updateLocationInfo(this.locate(p, geom));
		} else if (geom instanceof Polygon) {
			this.updateLocationInfo(this.locate(p, geom));
		} else if (geom instanceof MultiLineString) {
			var ml = geom;
			for (var i = 0; i < ml.getNumGeometries(); i++) {
				var l = ml.getGeometryN(i);
				this.updateLocationInfo(this.locate(p, l));
			}
		} else if (geom instanceof MultiPolygon) {
			var mpoly = geom;
			for (var i = 0; i < mpoly.getNumGeometries(); i++) {
				var poly = mpoly.getGeometryN(i);
				this.updateLocationInfo(this.locate(p, poly));
			}
		} else if (geom instanceof GeometryCollection) {
			var geomi = new GeometryCollectionIterator(geom);
			while (geomi.hasNext()) {
				var g2 = geomi.next();
				if (g2 !== geom) this.computeLocation(p, g2);
			}
		}
	}
	locate(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					if (args[0] instanceof Coordinate && args[1] instanceof Polygon) {
						return ((...args) => {
							let [p, poly] = args;
							if (poly.isEmpty()) return Location.EXTERIOR;
							var shell = poly.getExteriorRing();
							var shellLoc = this.locateInPolygonRing(p, shell);
							if (shellLoc === Location.EXTERIOR) return Location.EXTERIOR;
							if (shellLoc === Location.BOUNDARY) return Location.BOUNDARY;
							for (var i = 0; i < poly.getNumInteriorRing(); i++) {
								var hole = poly.getInteriorRingN(i);
								var holeLoc = this.locateInPolygonRing(p, hole);
								if (holeLoc === Location.INTERIOR) return Location.EXTERIOR;
								if (holeLoc === Location.BOUNDARY) return Location.BOUNDARY;
							}
							return Location.INTERIOR;
						})(...args);
					} else if (args[0] instanceof Coordinate && args[1] instanceof LineString) {
						return ((...args) => {
							let [p, l] = args;
							if (!l.getEnvelopeInternal().intersects(p)) return Location.EXTERIOR;
							var pt = l.getCoordinates();
							if (!l.isClosed()) {
								if (p.equals(pt[0]) || p.equals(pt[pt.length - 1])) {
									return Location.BOUNDARY;
								}
							}
							if (CGAlgorithms.isOnLine(p, pt)) return Location.INTERIOR;
							return Location.EXTERIOR;
						})(...args);
					} else if (args[0] instanceof Coordinate && args[1] instanceof Point) {
						return ((...args) => {
							let [p, pt] = args;
							var ptCoord = pt.getCoordinate();
							if (ptCoord.equals2D(p)) return Location.INTERIOR;
							return Location.EXTERIOR;
						})(...args);
					} else if (args[0] instanceof Coordinate && args[1] instanceof Geometry) {
						return ((...args) => {
							let [p, geom] = args;
							if (geom.isEmpty()) return Location.EXTERIOR;
							if (geom instanceof LineString) {
								return this.locate(p, geom);
							} else if (geom instanceof Polygon) {
								return this.locate(p, geom);
							}
							this.isIn = false;
							this.numBoundaries = 0;
							this.computeLocation(p, geom);
							if (this.boundaryRule.isInBoundary(this.numBoundaries)) return Location.BOUNDARY;
							if (this.numBoundaries > 0 || this.isIn) return Location.INTERIOR;
							return Location.EXTERIOR;
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	getClass() {
		return PointLocator;
	}
}

