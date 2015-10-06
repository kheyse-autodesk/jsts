import CoordinateSequenceFactory from 'com/vividsolutions/jts/geom/CoordinateSequenceFactory';
import LineString from 'com/vividsolutions/jts/geom/LineString';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import Point from 'com/vividsolutions/jts/geom/Point';
import Polygon from 'com/vividsolutions/jts/geom/Polygon';
import MultiPoint from 'com/vividsolutions/jts/geom/MultiPoint';
import GeometryEditor from 'com/vividsolutions/jts/geom/util/GeometryEditor';
import LinearRing from 'com/vividsolutions/jts/geom/LinearRing';
import CoordinateArraySequenceFactory from 'com/vividsolutions/jts/geom/impl/CoordinateArraySequenceFactory';
import MultiPolygon from 'com/vividsolutions/jts/geom/MultiPolygon';
import CoordinateSequences from 'com/vividsolutions/jts/geom/CoordinateSequences';
import CoordinateSequence from 'com/vividsolutions/jts/geom/CoordinateSequence';
import GeometryCollection from 'com/vividsolutions/jts/geom/GeometryCollection';
import PrecisionModel from 'com/vividsolutions/jts/geom/PrecisionModel';
import Serializable from 'java/io/Serializable';
import Assert from 'com/vividsolutions/jts/util/Assert';
import MultiLineString from 'com/vividsolutions/jts/geom/MultiLineString';
export default class GeometryFactory {
	constructor(...args) {
		(() => {
			this.precisionModel = null;
			this.coordinateSequenceFactory = null;
			this.SRID = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						overloads.call(this, new PrecisionModel(), 0);
					})(...args);
				case 1:
					if (args[0] instanceof PrecisionModel) {
						return ((...args) => {
							let [precisionModel] = args;
							overloads.call(this, precisionModel, 0, GeometryFactory.getDefaultCoordinateSequenceFactory());
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(CoordinateSequenceFactory) > -1) {
						return ((...args) => {
							let [coordinateSequenceFactory] = args;
							overloads.call(this, new PrecisionModel(), 0, coordinateSequenceFactory);
						})(...args);
					}
				case 2:
					return ((...args) => {
						let [precisionModel, SRID] = args;
						overloads.call(this, precisionModel, SRID, GeometryFactory.getDefaultCoordinateSequenceFactory());
					})(...args);
				case 3:
					return ((...args) => {
						let [precisionModel, SRID, coordinateSequenceFactory] = args;
						this.precisionModel = precisionModel;
						this.coordinateSequenceFactory = coordinateSequenceFactory;
						this.SRID = SRID;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Serializable];
	}
	static get serialVersionUID() {
		return -6820524753094095635;
	}
	static toMultiPolygonArray(multiPolygons) {
		var multiPolygonArray = new Array(multiPolygons.size());
		return multiPolygons.toArray(multiPolygonArray);
	}
	static toGeometryArray(geometries) {
		if (geometries === null) return null;
		var geometryArray = new Array(geometries.size());
		return geometries.toArray(geometryArray);
	}
	static getDefaultCoordinateSequenceFactory() {
		return CoordinateArraySequenceFactory.instance();
	}
	static toMultiLineStringArray(multiLineStrings) {
		var multiLineStringArray = new Array(multiLineStrings.size());
		return multiLineStrings.toArray(multiLineStringArray);
	}
	static toLineStringArray(lineStrings) {
		var lineStringArray = new Array(lineStrings.size());
		return lineStrings.toArray(lineStringArray);
	}
	static toMultiPointArray(multiPoints) {
		var multiPointArray = new Array(multiPoints.size());
		return multiPoints.toArray(multiPointArray);
	}
	static toLinearRingArray(linearRings) {
		var linearRingArray = new Array(linearRings.size());
		return linearRings.toArray(linearRingArray);
	}
	static toPointArray(points) {
		var pointArray = new Array(points.size());
		return points.toArray(pointArray);
	}
	static toPolygonArray(polygons) {
		var polygonArray = new Array(polygons.size());
		return polygons.toArray(polygonArray);
	}
	static createPointFromInternalCoord(coord, exemplar) {
		exemplar.getPrecisionModel().makePrecise(coord);
		return exemplar.getFactory().createPoint(coord);
	}
	toGeometry(envelope) {
		if (envelope.isNull()) {
			return this.createPoint(null);
		}
		if (envelope.getMinX() === envelope.getMaxX() && envelope.getMinY() === envelope.getMaxY()) {
			return this.createPoint(new Coordinate(envelope.getMinX(), envelope.getMinY()));
		}
		if (envelope.getMinX() === envelope.getMaxX() || envelope.getMinY() === envelope.getMaxY()) {
			return this.createLineString([new Coordinate(envelope.getMinX(), envelope.getMinY()), new Coordinate(envelope.getMaxX(), envelope.getMaxY())]);
		}
		return this.createPolygon(this.createLinearRing([new Coordinate(envelope.getMinX(), envelope.getMinY()), new Coordinate(envelope.getMinX(), envelope.getMaxY()), new Coordinate(envelope.getMaxX(), envelope.getMaxY()), new Coordinate(envelope.getMaxX(), envelope.getMinY()), new Coordinate(envelope.getMinX(), envelope.getMinY())]), null);
	}
	createLineString(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Array) {
						return ((...args) => {
							let [coordinates] = args;
							return this.createLineString(coordinates !== null ? this.getCoordinateSequenceFactory().create(coordinates) : null);
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(CoordinateSequence) > -1) {
						return ((...args) => {
							let [coordinates] = args;
							return new LineString(coordinates, this);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	createMultiLineString(lineStrings) {
		return new MultiLineString(lineStrings, this);
	}
	buildGeometry(geomList) {
		var geomClass = null;
		var isHeterogeneous = false;
		var hasGeometryCollection = false;
		for (var i = geomList.iterator(); i.hasNext(); ) {
			var geom = i.next();
			var partClass = geom.getClass();
			if (geomClass === null) {
				geomClass = partClass;
			}
			if (partClass !== geomClass) {
				isHeterogeneous = true;
			}
			if (geom instanceof GeometryCollection) hasGeometryCollection = true;
		}
		if (geomClass === null) {
			return this.createGeometryCollection(null);
		}
		if (isHeterogeneous || hasGeometryCollection) {
			return this.createGeometryCollection(GeometryFactory.toGeometryArray(geomList));
		}
		var geom0 = geomList.iterator().next();
		var isCollection = geomList.size() > 1;
		if (isCollection) {
			if (geom0 instanceof Polygon) {
				return this.createMultiPolygon(GeometryFactory.toPolygonArray(geomList));
			} else if (geom0 instanceof LineString) {
				return this.createMultiLineString(GeometryFactory.toLineStringArray(geomList));
			} else if (geom0 instanceof Point) {
				return this.createMultiPoint(GeometryFactory.toPointArray(geomList));
			}
			Assert.shouldNeverReachHere("Unhandled class: " + geom0.getClass().getName());
		}
		return geom0;
	}
	createPoint(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Coordinate) {
						return ((...args) => {
							let [coordinate] = args;
							return this.createPoint(coordinate !== null ? this.getCoordinateSequenceFactory().create([coordinate]) : null);
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(CoordinateSequence) > -1) {
						return ((...args) => {
							let [coordinates] = args;
							return new Point(coordinates, this);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	getCoordinateSequenceFactory() {
		return this.coordinateSequenceFactory;
	}
	createPolygon(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						return new Polygon(this);
					})(...args);
				case 1:
					if (args[0] instanceof LinearRing) {
						return ((...args) => {
							let [shell] = args;
							return this.createPolygon(shell, null);
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(CoordinateSequence) > -1) {
						return ((...args) => {
							let [coordinates] = args;
							return this.createPolygon(this.createLinearRing(coordinates));
						})(...args);
					} else if (args[0] instanceof Array) {
						return ((...args) => {
							let [coordinates] = args;
							return this.createPolygon(this.createLinearRing(coordinates));
						})(...args);
					}
				case 2:
					return ((...args) => {
						let [shell, holes] = args;
						return new Polygon(shell, holes, this);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	getSRID() {
		return this.SRID;
	}
	createGeometryCollection(geometries) {
		return new GeometryCollection(geometries, this);
	}
	createGeometry(g) {
		var editor = new GeometryEditor(this);
		return editor.edit(g, new (class {
			edit(coordSeq, geometry) {
				return this.coordinateSequenceFactory.create(coordSeq);
			}
		})());
	}
	getPrecisionModel() {
		return this.precisionModel;
	}
	createLinearRing(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						return new LinearRing(this);
					})(...args);
				case 1:
					if (args[0] instanceof Array) {
						return ((...args) => {
							let [coordinates] = args;
							return this.createLinearRing(this.getCoordinateSequenceFactory().create(coordinates));
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(CoordinateSequence) > -1) {
						return ((...args) => {
							let [coordinates] = args;
							return new LinearRing(coordinates, this);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	createMultiPolygon(polygons) {
		return new MultiPolygon(polygons, this);
	}
	createMultiPoint(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Array) {
						return ((...args) => {
							let [point] = args;
							return new MultiPoint(point, this);
						})(...args);
					} else if (args[0] instanceof Array) {
						return ((...args) => {
							let [coordinates] = args;
							return this.createMultiPoint(this.getCoordinateSequenceFactory().create(coordinates));
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(CoordinateSequence) > -1) {
						return ((...args) => {
							let [coordinates] = args;
							if (coordinates === null) {
								return this.createMultiPoint(new Array(0));
							}
							var points = new Array(coordinates.size());
							for (var i = 0; i < coordinates.size(); i++) {
								var ptSeq = this.getCoordinateSequenceFactory().create(1, coordinates.getDimension());
								CoordinateSequences.copy(coordinates, i, ptSeq, 0, 1);
								points[i] = this.createPoint(ptSeq);
							}
							return this.createMultiPoint(points);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	getClass() {
		return GeometryFactory;
	}
}

