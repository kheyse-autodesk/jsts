function MultiPolygon(...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [polygons, factory] = args;
				MultiPolygon.super_.call(this, polygons, factory);
			})(...args);
		case 3:
			return ((...args) => {
				let [polygons, precisionModel, SRID] = args;
				MultiPolygon.call(this, polygons, new GeometryFactory(precisionModel, SRID));
			})(...args);
	}
}
module.exports = MultiPolygon
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var util = require('util');
util.inherits(MultiPolygon, GeometryCollection)
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var ArrayList = require('java/util/ArrayList');
MultiPolygon.prototype.equalsExact = function (other, tolerance) {
	if (!this.isEquivalentClass(other)) {
		return false;
	}
	return MultiPolygon.super_.prototype.equalsExact.call(this, other, tolerance);
};
MultiPolygon.prototype.getBoundaryDimension = function () {
	return 1;
};
MultiPolygon.prototype.getDimension = function () {
	return 2;
};
MultiPolygon.prototype.reverse = function () {
	var n = this.geometries.length;
	var revGeoms = [];
	for (var i = 0; i < this.geometries.length; i++) {
		revGeoms[i] = this.geometries[i].reverse();
	}
	return this.getFactory().createMultiPolygon(revGeoms);
};
MultiPolygon.prototype.getBoundary = function () {
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
};
MultiPolygon.prototype.getGeometryType = function () {
	return "MultiPolygon";
};
MultiPolygon.serialVersionUID = -551033529766975875;

