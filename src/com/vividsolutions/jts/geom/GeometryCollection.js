import Geometry from 'com/vividsolutions/jts/geom/Geometry';
import CoordinateFilter from 'com/vividsolutions/jts/geom/CoordinateFilter';
import GeometryFactory from 'com/vividsolutions/jts/geom/GeometryFactory';
import GeometryComponentFilter from 'com/vividsolutions/jts/geom/GeometryComponentFilter';
import Dimension from 'com/vividsolutions/jts/geom/Dimension';
import GeometryFilter from 'com/vividsolutions/jts/geom/GeometryFilter';
import CoordinateSequenceFilter from 'com/vividsolutions/jts/geom/CoordinateSequenceFilter';
import Envelope from 'com/vividsolutions/jts/geom/Envelope';
export default class GeometryCollection extends Geometry {
	constructor(...args) {
		super();
		(() => {
			this.geometries = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [geometries, factory] = args;
						super(factory);
						if (geometries === null) {
							geometries = [];
						}
						if (GeometryCollection.hasNullElements(geometries)) {
							throw new IllegalArgumentException("geometries must not contain null elements");
						}
						this.geometries = geometries;
					})(...args);
				case 3:
					return ((...args) => {
						let [geometries, precisionModel, SRID] = args;
						overloads.call(this, geometries, new GeometryFactory(precisionModel, SRID));
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get serialVersionUID() {
		return -5694727726395021467;
	}
	computeEnvelopeInternal() {
		var envelope = new Envelope();
		for (var i = 0; i < this.geometries.length; i++) {
			envelope.expandToInclude(this.geometries[i].getEnvelopeInternal());
		}
		return envelope;
	}
	getGeometryN(n) {
		return this.geometries[n];
	}
	getCoordinates() {
		var coordinates = new Array(this.getNumPoints());
		var k = -1;
		for (var i = 0; i < this.geometries.length; i++) {
			var childCoordinates = this.geometries[i].getCoordinates();
			for (var j = 0; j < childCoordinates.length; j++) {
				k++;
				coordinates[k] = childCoordinates[j];
			}
		}
		return coordinates;
	}
	getArea() {
		var area = 0.0;
		for (var i = 0; i < this.geometries.length; i++) {
			area += this.geometries[i].getArea();
		}
		return area;
	}
	equalsExact(other, tolerance) {
		var otherCollection = other;
		if (this.geometries.length !== otherCollection.geometries.length) {
			return false;
		}
		for (var i = 0; i < this.geometries.length; i++) {
			if (!this.geometries[i].equalsExact(otherCollection.geometries[i], tolerance)) {
				return false;
			}
		}
		return true;
	}
	getCoordinate() {
		if (this.isEmpty()) return null;
		return this.geometries[0].getCoordinate();
	}
	getBoundaryDimension() {
		var dimension = Dimension.FALSE;
		for (var i = 0; i < this.geometries.length; i++) {
			dimension = Math.max(dimension, this.geometries[i].getBoundaryDimension());
		}
		return dimension;
	}
	getDimension() {
		var dimension = Dimension.FALSE;
		for (var i = 0; i < this.geometries.length; i++) {
			dimension = Math.max(dimension, this.geometries[i].getDimension());
		}
		return dimension;
	}
	getLength() {
		var sum = 0.0;
		for (var i = 0; i < this.geometries.length; i++) {
			sum += this.geometries[i].getLength();
		}
		return sum;
	}
	getNumPoints() {
		var numPoints = 0;
		for (var i = 0; i < this.geometries.length; i++) {
			numPoints += this.geometries[i].getNumPoints();
		}
		return numPoints;
	}
	getNumGeometries() {
		return this.geometries.length;
	}
	apply(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0].interfaces_ && args[0].interfaces_.indexOf(CoordinateFilter) > -1) {
						return ((...args) => {
							let [filter] = args;
							for (var i = 0; i < this.geometries.length; i++) {
								this.geometries[i].apply(filter);
							}
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(CoordinateSequenceFilter) > -1) {
						return ((...args) => {
							let [filter] = args;
							if (this.geometries.length === 0) return null;
							for (var i = 0; i < this.geometries.length; i++) {
								this.geometries[i].apply(filter);
								if (filter.isDone()) {
									break;
								}
							}
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(GeometryFilter) > -1) {
						return ((...args) => {
							let [filter] = args;
							filter.filter(this);
							for (var i = 0; i < this.geometries.length; i++) {
								this.geometries[i].apply(filter);
							}
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(GeometryComponentFilter) > -1) {
						return ((...args) => {
							let [filter] = args;
							filter.filter(this);
							for (var i = 0; i < this.geometries.length; i++) {
								this.geometries[i].apply(filter);
							}
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	getBoundary() {
		return null;
	}
	clone() {
		var gc = super.clone();
		gc.geometries = new Array(this.geometries.length);
		for (var i = 0; i < this.geometries.length; i++) {
			gc.geometries[i] = this.geometries[i].clone();
		}
		return gc;
	}
	getGeometryType() {
		return "GeometryCollection";
	}
	isEmpty() {
		for (var i = 0; i < this.geometries.length; i++) {
			if (!this.geometries[i].isEmpty()) {
				return false;
			}
		}
		return true;
	}
	getClass() {
		return GeometryCollection;
	}
}

