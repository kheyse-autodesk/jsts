import LineString from '../geom/LineString';
import Geometry from '../geom/Geometry';
import Coordinate from '../geom/Coordinate';
import Polygon from '../geom/Polygon';
import GeometryCollection from '../geom/GeometryCollection';
export default class CentroidLine {
	constructor(...args) {
		(() => {
			this.centSum = new Coordinate();
			this.totalLength = 0.0;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	getCentroid() {
		var cent = new Coordinate();
		cent.x = this.centSum.x / this.totalLength;
		cent.y = this.centSum.y / this.totalLength;
		return cent;
	}
	add(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Geometry) {
						return ((...args) => {
							let [geom] = args;
							if (geom instanceof LineString) {
								this.add(geom.getCoordinates());
							} else if (geom instanceof Polygon) {
								var poly = geom;
								this.add(poly.getExteriorRing().getCoordinates());
								for (var i = 0; i < poly.getNumInteriorRing(); i++) {
									this.add(poly.getInteriorRingN(i).getCoordinates());
								}
							} else if (geom instanceof GeometryCollection) {
								var gc = geom;
								for (var i = 0; i < gc.getNumGeometries(); i++) {
									this.add(gc.getGeometryN(i));
								}
							}
						})(...args);
					} else if (args[0] instanceof Array) {
						return ((...args) => {
							let [pts] = args;
							for (var i = 0; i < pts.length - 1; i++) {
								var segmentLen = pts[i].distance(pts[i + 1]);
								this.totalLength += segmentLen;
								var midx = (pts[i].x + pts[i + 1].x) / 2;
								this.centSum.x += segmentLen * midx;
								var midy = (pts[i].y + pts[i + 1].y) / 2;
								this.centSum.y += segmentLen * midy;
							}
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	getClass() {
		return CentroidLine;
	}
}
