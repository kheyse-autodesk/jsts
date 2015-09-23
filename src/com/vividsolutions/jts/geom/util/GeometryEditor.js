function GeometryEditor(...args) {
	this.factory = null;
	this.isUserDataCopied = false;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [factory] = args;
				this.factory = factory;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
			})(...args);
	}
}
module.exports = GeometryEditor
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Point = require('com/vividsolutions/jts/geom/Point');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var MultiPoint = require('com/vividsolutions/jts/geom/MultiPoint');
var LinearRing = require('com/vividsolutions/jts/geom/LinearRing');
var MultiPolygon = require('com/vividsolutions/jts/geom/MultiPolygon');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var ArrayList = require('java/util/ArrayList');
var Assert = require('com/vividsolutions/jts/util/Assert');
var MultiLineString = require('com/vividsolutions/jts/geom/MultiLineString');
GeometryEditor.prototype.setCopyUserData = function (isUserDataCopied) {
	this.isUserDataCopied = isUserDataCopied;
};
GeometryEditor.prototype.edit = function (geometry, operation) {
	if (geometry === null) return null;
	var result = this.editInternal(geometry, operation);
	if (this.isUserDataCopied) {
		result.setUserData(geometry.getUserData());
	}
	return result;
};
GeometryEditor.prototype.editInternal = function (geometry, operation) {
	if (this.factory === null) this.factory = geometry.getFactory();
	if (geometry instanceof GeometryCollection) {
		return this.editGeometryCollection(geometry, operation);
	}
	if (geometry instanceof Polygon) {
		return this.editPolygon(geometry, operation);
	}
	if (geometry instanceof Point) {
		return operation.edit(geometry, this.factory);
	}
	if (geometry instanceof LineString) {
		return operation.edit(geometry, this.factory);
	}
	Assert.shouldNeverReachHere("Unsupported Geometry class: " + geometry.getClass().getName());
	return null;
};
GeometryEditor.prototype.editGeometryCollection = function (collection, operation) {
	var collectionForType = operation.edit(collection, this.factory);
	var geometries = new ArrayList();
	for (var i = 0; i < collectionForType.getNumGeometries(); i++) {
		var geometry = this.edit(collectionForType.getGeometryN(i), operation);
		if (geometry === null || geometry.isEmpty()) {
			continue;
		}
		geometries.add(geometry);
	}
	if (collectionForType.getClass() === MultiPoint) {
		return this.factory.createMultiPoint(geometries.toArray([]));
	}
	if (collectionForType.getClass() === MultiLineString) {
		return this.factory.createMultiLineString(geometries.toArray([]));
	}
	if (collectionForType.getClass() === MultiPolygon) {
		return this.factory.createMultiPolygon(geometries.toArray([]));
	}
	return this.factory.createGeometryCollection(geometries.toArray([]));
};
GeometryEditor.prototype.editPolygon = function (polygon, operation) {
	var newPolygon = operation.edit(polygon, this.factory);
	if (newPolygon === null) newPolygon = this.factory.createPolygon(null);
	if (newPolygon.isEmpty()) {
		return newPolygon;
	}
	var shell = this.edit(newPolygon.getExteriorRing(), operation);
	if (shell === null || shell.isEmpty()) {
		return this.factory.createPolygon(null, null);
	}
	var holes = new ArrayList();
	for (var i = 0; i < newPolygon.getNumInteriorRing(); i++) {
		var hole = this.edit(newPolygon.getInteriorRingN(i), operation);
		if (hole === null || hole.isEmpty()) {
			continue;
		}
		holes.add(hole);
	}
	return this.factory.createPolygon(shell, holes.toArray([]));
};
function NoOpGeometryOperation() {}
NoOpGeometryOperation.prototype.edit = function (geometry, factory) {
	return geometry;
};
GeometryEditor.NoOpGeometryOperation = NoOpGeometryOperation;
function CoordinateOperation() {}
CoordinateOperation.prototype.edit = function (geometry, factory) {
	if (geometry instanceof LinearRing) {
		return factory.createLinearRing(this.edit(geometry.getCoordinates(), geometry));
	}
	if (geometry instanceof LineString) {
		return factory.createLineString(this.edit(geometry.getCoordinates(), geometry));
	}
	if (geometry instanceof Point) {
		var newCoordinates = this.edit(geometry.getCoordinates(), geometry);
		return factory.createPoint(newCoordinates.length > 0 ? newCoordinates[0] : null);
	}
	return geometry;
};
GeometryEditor.CoordinateOperation = CoordinateOperation;
function CoordinateSequenceOperation() {}
CoordinateSequenceOperation.prototype.edit = function (geometry, factory) {
	if (geometry instanceof LinearRing) {
		return factory.createLinearRing(this.edit(geometry.getCoordinateSequence(), geometry));
	}
	if (geometry instanceof LineString) {
		return factory.createLineString(this.edit(geometry.getCoordinateSequence(), geometry));
	}
	if (geometry instanceof Point) {
		return factory.createPoint(this.edit(geometry.getCoordinateSequence(), geometry));
	}
	return geometry;
};
GeometryEditor.CoordinateSequenceOperation = CoordinateSequenceOperation;

