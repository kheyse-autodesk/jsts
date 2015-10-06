import Geometry from 'com/vividsolutions/jts/geom/Geometry';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import Point from 'com/vividsolutions/jts/geom/Point';
import GeometryCollection from 'com/vividsolutions/jts/geom/GeometryCollection';
export default class CentroidPoint {
	constructor(...args) {
		(() => {
			this.ptCount = 0;
			this.centSum = new Coordinate();
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
		cent.x = this.centSum.x / this.ptCount;
		cent.y = this.centSum.y / this.ptCount;
		return cent;
	}
	add(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Coordinate) {
						return ((...args) => {
							let [pt] = args;
							this.ptCount += 1;
							this.centSum.x += pt.x;
							this.centSum.y += pt.y;
						})(...args);
					} else if (args[0] instanceof Geometry) {
						return ((...args) => {
							let [geom] = args;
							if (geom instanceof Point) {
								this.add(geom.getCoordinate());
							} else if (geom instanceof GeometryCollection) {
								var gc = geom;
								for (var i = 0; i < gc.getNumGeometries(); i++) {
									this.add(gc.getGeometryN(i));
								}
							}
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
}

