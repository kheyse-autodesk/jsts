import GeometryCollection from 'com/vividsolutions/jts/geom/GeometryCollection';
import Polygonal from 'com/vividsolutions/jts/geom/Polygonal';
import ArrayList from 'java/util/ArrayList';
export default class MultiPolygon extends GeometryCollection {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [polygons, factory] = args;
						super(polygons, factory);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Polygonal];
	}
	static get serialVersionUID() {
		return -551033529766975875;
	}
	equalsExact(other, tolerance) {
		return super.equalsExact(other, tolerance);
	}
	getBoundaryDimension() {
		return 1;
	}
	getDimension() {
		return 2;
	}
	getBoundary() {
		if (this.isEmpty()) {
			return this.getFactory().createMultiLineString(null);
		}
		var allRings = new ArrayList();
		for (var i = 0; i < this.geometries.length; i++) {
			var polygon = this.geometries[i];
			var rings = polygon.getBoundary();
			for (var j = 0; j < rings.getNumGeometries(); j++) {
				allRings.add(rings.getGeometryN(j));
			}
		}
		var allRingsArray = [];
		return this.getFactory().createMultiLineString(allRings.toArray(allRingsArray));
	}
	getGeometryType() {
		return "MultiPolygon";
	}
}

