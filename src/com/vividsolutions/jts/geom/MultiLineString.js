function MultiLineString(...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [lineStrings, factory] = args;
				MultiLineString.super_.call(this, lineStrings, factory);
			})(...args);
		case 3:
			return ((...args) => {
				let [lineStrings, precisionModel, SRID] = args;
				MultiLineString.super_.call(this, lineStrings, new GeometryFactory(precisionModel, SRID));
			})(...args);
	}
}
module.exports = MultiLineString
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var util = require('util');
util.inherits(MultiLineString, GeometryCollection)
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var BoundaryOp = require('com/vividsolutions/jts/operation/BoundaryOp');
var Dimension = require('com/vividsolutions/jts/geom/Dimension');
MultiLineString.prototype.equalsExact = function (other, tolerance) {
	if (!this.isEquivalentClass(other)) {
		return false;
	}
	return MultiLineString.super_.prototype.equalsExact.call(this, other, tolerance);
};
MultiLineString.prototype.getBoundaryDimension = function () {
	if (this.isClosed()) {
		return Dimension.FALSE;
	}
	return 0;
};
MultiLineString.prototype.isClosed = function () {
	if (this.isEmpty()) {
		return false;
	}
	for (var i = 0; i < this.geometries.length; i++) {
		if (!this.geometries[i].isClosed()) {
			return false;
		}
	}
	return true;
};
MultiLineString.prototype.getDimension = function () {
	return 1;
};
MultiLineString.prototype.reverse = function () {
	var nLines = this.geometries.length;
	var revLines = [];
	for (var i = 0; i < this.geometries.length; i++) {
		revLines[nLines - 1 - i] = this.geometries[i].reverse();
	}
	return this.getFactory().createMultiLineString(revLines);
};
MultiLineString.prototype.getBoundary = function () {
	return new BoundaryOp(this).getBoundary();
};
MultiLineString.prototype.getGeometryType = function () {
	return "MultiLineString";
};
MultiLineString.serialVersionUID = 8166665132445433741;

