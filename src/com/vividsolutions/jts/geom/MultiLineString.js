import Lineal from 'com/vividsolutions/jts/geom/Lineal';
import GeometryCollection from 'com/vividsolutions/jts/geom/GeometryCollection';
import Dimension from 'com/vividsolutions/jts/geom/Dimension';
export default class MultiLineString extends GeometryCollection {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [lineStrings, factory] = args;
						super(lineStrings, factory);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Lineal];
	}
	static get serialVersionUID() {
		return 8166665132445433741;
	}
	equalsExact(other, tolerance) {
		return super.equalsExact(other, tolerance);
	}
	getBoundaryDimension() {
		if (this.isClosed()) {
			return Dimension.FALSE;
		}
		return 0;
	}
	isClosed() {
		if (this.isEmpty()) {
			return false;
		}
		for (var i = 0; i < this.geometries.length; i++) {
			if (!this.geometries[i].isClosed()) {
				return false;
			}
		}
		return true;
	}
	getDimension() {
		return 1;
	}
	getBoundary() {
		return null;
	}
	getGeometryType() {
		return "MultiLineString";
	}
}

