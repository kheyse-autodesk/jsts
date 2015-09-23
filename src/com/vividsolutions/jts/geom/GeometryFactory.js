function GeometryFactory(...args) {
	this.precisionModel = null;
	this.coordinateSequenceFactory = null;
	this.SRID = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [precisionModel, SRID] = args;
				GeometryFactory.call(this, precisionModel, SRID, GeometryFactory.getDefaultCoordinateSequenceFactory());
			})(...args);
		case 1:
			if (args[0] instanceof CoordinateSequenceFactory) {
				return ((...args) => {
					let [coordinateSequenceFactory] = args;
					GeometryFactory.call(this, new PrecisionModel(), 0, coordinateSequenceFactory);
				})(...args);
			} else if (args[0] instanceof PrecisionModel) {
				return ((...args) => {
					let [precisionModel] = args;
					GeometryFactory.call(this, precisionModel, 0, GeometryFactory.getDefaultCoordinateSequenceFactory());
				})(...args);
			}
		case 3:
			return ((...args) => {
				let [precisionModel, SRID, coordinateSequenceFactory] = args;
				this.precisionModel = precisionModel;
				this.coordinateSequenceFactory = coordinateSequenceFactory;
				this.SRID = SRID;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				GeometryFactory.call(this, new PrecisionModel(), 0);
			})(...args);
	}
}
module.exports = GeometryFactory
var CoordinateSequenceFactory = require('com/vividsolutions/jts/geom/CoordinateSequenceFactory');
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Point = require('com/vividsolutions/jts/geom/Point');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var MultiPoint = require('com/vividsolutions/jts/geom/MultiPoint');
var GeometryEditor = require('com/vividsolutions/jts/geom/util/GeometryEditor');
var LinearRing = require('com/vividsolutions/jts/geom/LinearRing');
var CoordinateArraySequenceFactory = require('com/vividsolutions/jts/geom/impl/CoordinateArraySequenceFactory');
var MultiPolygon = require('com/vividsolutions/jts/geom/MultiPolygon');
var CoordinateSequences = require('com/vividsolutions/jts/geom/CoordinateSequences');
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var PrecisionModel = require('com/vividsolutions/jts/geom/PrecisionModel');
var Assert = require('com/vividsolutions/jts/util/Assert');
var MultiLineString = require('com/vividsolutions/jts/geom/MultiLineString');
GeometryFactory.prototype.toGeometry = function (envelope) {
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
};
GeometryFactory.prototype.createLineString = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Array) {
				return ((...args) => {
					let [coordinates] = args;
					return this.createLineString(coordinates !== null ? this.getCoordinateSequenceFactory().create(coordinates) : null);
				})(...args);
			} else if (args[0] instanceof CoordinateSequence) {
				return ((...args) => {
					let [coordinates] = args;
					return new LineString(coordinates, this);
				})(...args);
			}
	}
};
GeometryFactory.prototype.createMultiLineString = function (lineStrings) {
	return new MultiLineString(lineStrings, this);
};
GeometryFactory.prototype.buildGeometry = function (geomList) {
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
};
GeometryFactory.prototype.createPoint = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [coordinate] = args;
					return this.createPoint(coordinate !== null ? this.getCoordinateSequenceFactory().create([coordinate]) : null);
				})(...args);
			} else if (args[0] instanceof CoordinateSequence) {
				return ((...args) => {
					let [coordinates] = args;
					return new Point(coordinates, this);
				})(...args);
			}
	}
};
GeometryFactory.prototype.getCoordinateSequenceFactory = function () {
	return this.coordinateSequenceFactory;
};
GeometryFactory.prototype.createPolygon = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [shell, holes] = args;
				return new Polygon(shell, holes, this);
			})(...args);
		case 1:
			if (args[0] instanceof CoordinateSequence) {
				return ((...args) => {
					let [coordinates] = args;
					return this.createPolygon(this.createLinearRing(coordinates));
				})(...args);
			} else if (args[0] instanceof Array) {
				return ((...args) => {
					let [coordinates] = args;
					return this.createPolygon(this.createLinearRing(coordinates));
				})(...args);
			} else if (args[0] instanceof LinearRing) {
				return ((...args) => {
					let [shell] = args;
					return this.createPolygon(shell, null);
				})(...args);
			}
	}
};
GeometryFactory.prototype.getSRID = function () {
	return this.SRID;
};
GeometryFactory.prototype.createGeometryCollection = function (geometries) {
	return new GeometryCollection(geometries, this);
};
GeometryFactory.prototype.createGeometry = function (g) {
	var editor = new GeometryEditor(this);
	return editor.edit(g, new GeometryEditor.CoordinateSequenceOperation());
};
GeometryFactory.prototype.getPrecisionModel = function () {
	return this.precisionModel;
};
GeometryFactory.prototype.createLinearRing = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Array) {
				return ((...args) => {
					let [coordinates] = args;
					return this.createLinearRing(coordinates !== null ? this.getCoordinateSequenceFactory().create(coordinates) : null);
				})(...args);
			} else if (args[0] instanceof CoordinateSequence) {
				return ((...args) => {
					let [coordinates] = args;
					return new LinearRing(coordinates, this);
				})(...args);
			}
	}
};
GeometryFactory.prototype.createMultiPolygon = function (polygons) {
	return new MultiPolygon(polygons, this);
};
GeometryFactory.prototype.createMultiPoint = function (...args) {
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
					return this.createMultiPoint(coordinates !== null ? this.getCoordinateSequenceFactory().create(coordinates) : null);
				})(...args);
			} else if (args[0] instanceof CoordinateSequence) {
				return ((...args) => {
					let [coordinates] = args;
					if (coordinates === null) {
						return this.createMultiPoint([]);
					}
					var points = [];
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
GeometryFactory.toMultiPolygonArray = function (multiPolygons) {
	var multiPolygonArray = [];
	return multiPolygons.toArray(multiPolygonArray);
};
GeometryFactory.toGeometryArray = function (geometries) {
	if (geometries === null) return null;
	var geometryArray = [];
	return geometries.toArray(geometryArray);
};
GeometryFactory.getDefaultCoordinateSequenceFactory = function () {
	return CoordinateArraySequenceFactory.instance();
};
GeometryFactory.toMultiLineStringArray = function (multiLineStrings) {
	var multiLineStringArray = [];
	return multiLineStrings.toArray(multiLineStringArray);
};
GeometryFactory.toLineStringArray = function (lineStrings) {
	var lineStringArray = [];
	return lineStrings.toArray(lineStringArray);
};
GeometryFactory.toMultiPointArray = function (multiPoints) {
	var multiPointArray = [];
	return multiPoints.toArray(multiPointArray);
};
GeometryFactory.toLinearRingArray = function (linearRings) {
	var linearRingArray = [];
	return linearRings.toArray(linearRingArray);
};
GeometryFactory.toPointArray = function (points) {
	var pointArray = [];
	return points.toArray(pointArray);
};
GeometryFactory.toPolygonArray = function (polygons) {
	var polygonArray = [];
	return polygons.toArray(polygonArray);
};
GeometryFactory.createPointFromInternalCoord = function (coord, exemplar) {
	exemplar.getPrecisionModel().makePrecise(coord);
	return exemplar.getFactory().createPoint(coord);
};
GeometryFactory.serialVersionUID = -6820524753094095635;

