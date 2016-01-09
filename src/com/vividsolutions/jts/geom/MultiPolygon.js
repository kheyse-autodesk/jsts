import Geometry from './Geometry';
import GeometryFactory from './GeometryFactory';
import GeometryCollection from './GeometryCollection';
import Polygonal from './Polygonal';
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
				case 3:
					return ((...args) => {
						let [polygons, precisionModel, SRID] = args;
						overloads.call(this, polygons, new GeometryFactory(precisionModel, SRID));
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
	getSortIndex() {
		return Geometry.SORTINDEX_MULTIPOLYGON;
	}
	equalsExact(other, tolerance) {
		if (!this.isEquivalentClass(other)) {
			return false;
		}
		return super.equalsExact(other, tolerance);
	}
	getBoundaryDimension() {
		return 1;
	}
	getDimension() {
		return 2;
	}
	reverse() {
		var n = this.geometries.length;
		var revGeoms = new Array(n);
		for (var i = 0; i < this.geometries.length; i++) {
			revGeoms[i] = this.geometries[i].reverse();
		}
		return this.getFactory().createMultiPolygon(revGeoms);
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
		var allRingsArray = new Array(allRings.size());
		return this.getFactory().createMultiLineString(allRings.toArray(allRingsArray));
	}
	getGeometryType() {
		return "MultiPolygon";
	}
	getClass() {
		return MultiPolygon;
	}
}

