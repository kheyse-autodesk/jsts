function GeometryTransformer() {
	this.inputGeom = null;
	this.factory = null;
	this.pruneEmptyGeometry = true;
	this.preserveGeometryCollectionType = true;
	this.preserveCollections = false;
	this.preserveType = false;
	if (arguments.length === 0) return;
}
module.exports = GeometryTransformer
var LineString = require('com/vividsolutions/jts/geom/LineString');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Point = require('com/vividsolutions/jts/geom/Point');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var MultiPoint = require('com/vividsolutions/jts/geom/MultiPoint');
var LinearRing = require('com/vividsolutions/jts/geom/LinearRing');
var MultiPolygon = require('com/vividsolutions/jts/geom/MultiPolygon');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var ArrayList = require('java/util/ArrayList');
var MultiLineString = require('com/vividsolutions/jts/geom/MultiLineString');
GeometryTransformer.prototype.transformPoint = function (geom, parent) {
	return this.factory.createPoint(this.transformCoordinates(geom.getCoordinateSequence(), geom));
};
GeometryTransformer.prototype.transformPolygon = function (geom, parent) {
	var isAllValidLinearRings = true;
	var shell = this.transformLinearRing(geom.getExteriorRing(), geom);
	if (shell === null || !(shell instanceof LinearRing) || shell.isEmpty()) isAllValidLinearRings = false;
	var holes = new ArrayList();
	for (var i = 0; i < geom.getNumInteriorRing(); i++) {
		var hole = this.transformLinearRing(geom.getInteriorRingN(i), geom);
		if (hole === null || hole.isEmpty()) {
			continue;
		}
		if (!(hole instanceof LinearRing)) isAllValidLinearRings = false;
		holes.add(hole);
	}
	if (isAllValidLinearRings) return this.factory.createPolygon(shell, holes.toArray([])); else {
		var components = new ArrayList();
		if (shell !== null) components.add(shell);
		components.addAll(holes);
		return this.factory.buildGeometry(components);
	}
};
GeometryTransformer.prototype.createCoordinateSequence = function (coords) {
	return this.factory.getCoordinateSequenceFactory().create(coords);
};
GeometryTransformer.prototype.getInputGeometry = function () {
	return this.inputGeom;
};
GeometryTransformer.prototype.transformMultiLineString = function (geom, parent) {
	var transGeomList = new ArrayList();
	for (var i = 0; i < geom.getNumGeometries(); i++) {
		var transformGeom = this.transformLineString(geom.getGeometryN(i), geom);
		if (transformGeom === null) continue;
		if (transformGeom.isEmpty()) continue;
		transGeomList.add(transformGeom);
	}
	return this.factory.buildGeometry(transGeomList);
};
GeometryTransformer.prototype.transformCoordinates = function (coords, parent) {
	return this.copy(coords);
};
GeometryTransformer.prototype.transformLineString = function (geom, parent) {
	return this.factory.createLineString(this.transformCoordinates(geom.getCoordinateSequence(), geom));
};
GeometryTransformer.prototype.transformMultiPoint = function (geom, parent) {
	var transGeomList = new ArrayList();
	for (var i = 0; i < geom.getNumGeometries(); i++) {
		var transformGeom = this.transformPoint(geom.getGeometryN(i), geom);
		if (transformGeom === null) continue;
		if (transformGeom.isEmpty()) continue;
		transGeomList.add(transformGeom);
	}
	return this.factory.buildGeometry(transGeomList);
};
GeometryTransformer.prototype.transformMultiPolygon = function (geom, parent) {
	var transGeomList = new ArrayList();
	for (var i = 0; i < geom.getNumGeometries(); i++) {
		var transformGeom = this.transformPolygon(geom.getGeometryN(i), geom);
		if (transformGeom === null) continue;
		if (transformGeom.isEmpty()) continue;
		transGeomList.add(transformGeom);
	}
	return this.factory.buildGeometry(transGeomList);
};
GeometryTransformer.prototype.copy = function (seq) {
	return seq.clone();
};
GeometryTransformer.prototype.transformGeometryCollection = function (geom, parent) {
	var transGeomList = new ArrayList();
	for (var i = 0; i < geom.getNumGeometries(); i++) {
		var transformGeom = this.transform(geom.getGeometryN(i));
		if (transformGeom === null) continue;
		if (this.pruneEmptyGeometry && transformGeom.isEmpty()) continue;
		transGeomList.add(transformGeom);
	}
	if (this.preserveGeometryCollectionType) return this.factory.createGeometryCollection(GeometryFactory.toGeometryArray(transGeomList));
	return this.factory.buildGeometry(transGeomList);
};
GeometryTransformer.prototype.transform = function (inputGeom) {
	this.inputGeom = inputGeom;
	this.factory = inputGeom.getFactory();
	if (inputGeom instanceof Point) return this.transformPoint(inputGeom, null);
	if (inputGeom instanceof MultiPoint) return this.transformMultiPoint(inputGeom, null);
	if (inputGeom instanceof LinearRing) return this.transformLinearRing(inputGeom, null);
	if (inputGeom instanceof LineString) return this.transformLineString(inputGeom, null);
	if (inputGeom instanceof MultiLineString) return this.transformMultiLineString(inputGeom, null);
	if (inputGeom instanceof Polygon) return this.transformPolygon(inputGeom, null);
	if (inputGeom instanceof MultiPolygon) return this.transformMultiPolygon(inputGeom, null);
	if (inputGeom instanceof GeometryCollection) return this.transformGeometryCollection(inputGeom, null);
	throw new IllegalArgumentException("Unknown Geometry subtype: " + inputGeom.getClass().getName());
};
GeometryTransformer.prototype.transformLinearRing = function (geom, parent) {
	var seq = this.transformCoordinates(geom.getCoordinateSequence(), geom);
	if (seq === null) return this.factory.createLinearRing(null);
	var seqSize = seq.size();
	if (seqSize > 0 && seqSize < 4 && !this.preserveType) return this.factory.createLineString(seq);
	return this.factory.createLinearRing(seq);
};

