import Geometry from './Geometry';
import GeometryCollection from './GeometryCollection';
import Dimension from './Dimension';
import Puntal from './Puntal';
export default class MultiPoint extends GeometryCollection {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [points, factory] = args;
						super(points, factory);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Puntal];
	}
	static get serialVersionUID() {
		return -8048474874175355449;
	}
	getSortIndex() {
		return Geometry.SORTINDEX_MULTIPOINT;
	}
	isValid() {
		return true;
	}
	equalsExact(other, tolerance) {
		if (!this.isEquivalentClass(other)) {
			return false;
		}
		return super.equalsExact(other, tolerance);
	}
	getCoordinate(n) {
		return this.geometries[n].getCoordinate();
	}
	getBoundaryDimension() {
		return Dimension.FALSE;
	}
	getDimension() {
		return 0;
	}
	getBoundary() {
		return this.getFactory().createGeometryCollection();
	}
	getGeometryType() {
		return "MultiPoint";
	}
	copy() {
		var points = new Array(this.geometries.length);
		for (var i = 0; i < points.length; i++) {
			points[i] = this.geometries[i].copy();
		}
		return new MultiPoint(points, this.factory);
	}
	getClass() {
		return MultiPoint;
	}
}

