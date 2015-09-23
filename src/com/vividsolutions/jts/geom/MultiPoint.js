function MultiPoint(...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [points, factory] = args;
				MultiPoint.super_.call(this, points, factory);
			})(...args);
		case 3:
			return ((...args) => {
				let [points, precisionModel, SRID] = args;
				MultiPoint.super_.call(this, points, new GeometryFactory(precisionModel, SRID));
			})(...args);
	}
}
module.exports = MultiPoint
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var util = require('util');
util.inherits(MultiPoint, GeometryCollection)
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Dimension = require('com/vividsolutions/jts/geom/Dimension');
MultiPoint.prototype.isValid = function () {
	return true;
};
MultiPoint.prototype.equalsExact = function (other, tolerance) {
	if (!this.isEquivalentClass(other)) {
		return false;
	}
	return MultiPoint.super_.prototype.equalsExact.call(this, other, tolerance);
};
MultiPoint.prototype.getCoordinate = function (n) {
	return this.geometries[n].getCoordinate();
};
MultiPoint.prototype.getBoundaryDimension = function () {
	return Dimension.FALSE;
};
MultiPoint.prototype.getDimension = function () {
	return 0;
};
MultiPoint.prototype.getBoundary = function () {
	return this.getFactory().createGeometryCollection(null);
};
MultiPoint.prototype.getGeometryType = function () {
	return "MultiPoint";
};
MultiPoint.serialVersionUID = -8048474874175355449;

