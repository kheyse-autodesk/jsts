import GeometryCollection from 'com/vividsolutions/jts/geom/GeometryCollection';
import Dimension from 'com/vividsolutions/jts/geom/Dimension';
import Puntal from 'com/vividsolutions/jts/geom/Puntal';
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
	isValid() {
		return true;
	}
	equalsExact(other, tolerance) {
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
		return this.getFactory().createGeometryCollection(null);
	}
	getGeometryType() {
		return "MultiPoint";
	}
}

