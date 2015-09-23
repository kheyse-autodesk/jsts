function Point(...args) {
	this.coordinates = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [coordinates, factory] = args;
				Point.super_.call(this, factory);
				this.init(coordinates);
			})(...args);
		case 3:
			return ((...args) => {
				let [coordinate, precisionModel, SRID] = args;
				Point.super_.call(this, new GeometryFactory(precisionModel, SRID));
				this.init(this.getFactory().getCoordinateSequenceFactory().create(coordinate !== null ? [coordinate] : []));
			})(...args);
	}
}
module.exports = Point
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var util = require('util');
util.inherits(Point, Geometry)
var CoordinateFilter = require('com/vividsolutions/jts/geom/CoordinateFilter');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var GeometryComponentFilter = require('com/vividsolutions/jts/geom/GeometryComponentFilter');
var Dimension = require('com/vividsolutions/jts/geom/Dimension');
var GeometryFilter = require('com/vividsolutions/jts/geom/GeometryFilter');
var CoordinateSequenceFilter = require('com/vividsolutions/jts/geom/CoordinateSequenceFilter');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
var Assert = require('com/vividsolutions/jts/util/Assert');
Point.prototype.computeEnvelopeInternal = function () {
	if (this.isEmpty()) {
		return new Envelope();
	}
	var env = new Envelope();
	env.expandToInclude(this.coordinates.getX(0), this.coordinates.getY(0));
	return env;
};
Point.prototype.getCoordinates = function () {
	return this.isEmpty() ? [] : [this.getCoordinate()];
};
Point.prototype.equalsExact = function (other, tolerance) {
	if (!this.isEquivalentClass(other)) {
		return false;
	}
	if (this.isEmpty() && other.isEmpty()) {
		return true;
	}
	if (this.isEmpty() !== other.isEmpty()) {
		return false;
	}
	return this.equal(other.getCoordinate(), this.getCoordinate(), tolerance);
};
Point.prototype.normalize = function () {};
Point.prototype.getCoordinate = function () {
	return this.coordinates.size() !== 0 ? this.coordinates.getCoordinate(0) : null;
};
Point.prototype.getBoundaryDimension = function () {
	return Dimension.FALSE;
};
Point.prototype.getDimension = function () {
	return 0;
};
Point.prototype.getNumPoints = function () {
	return this.isEmpty() ? 0 : 1;
};
Point.prototype.reverse = function () {
	return this.clone();
};
Point.prototype.getX = function () {
	if (this.getCoordinate() === null) {
		throw new IllegalStateException("getX called on empty Point");
	}
	return this.x;
};
Point.prototype.compareToSameClass = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [other, comp] = args;
				var point = other;
				return comp.compare(this.coordinates, point.coordinates);
			})(...args);
		case 1:
			return ((...args) => {
				let [other] = args;
				var point = other;
				return this.getCoordinate().compareTo(point.getCoordinate());
			})(...args);
	}
};
Point.prototype.apply = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof CoordinateFilter) {
				return ((...args) => {
					let [filter] = args;
					if (this.isEmpty()) {
						return null;
					}
					filter.filter(this.getCoordinate());
				})(...args);
			} else if (args[0] instanceof CoordinateSequenceFilter) {
				return ((...args) => {
					let [filter] = args;
					if (this.isEmpty()) return null;
					filter.filter(this.coordinates, 0);
					if (filter.isGeometryChanged()) this.geometryChanged();
				})(...args);
			} else if (args[0] instanceof GeometryFilter) {
				return ((...args) => {
					let [filter] = args;
					filter.filter(this);
				})(...args);
			} else if (args[0] instanceof GeometryComponentFilter) {
				return ((...args) => {
					let [filter] = args;
					filter.filter(this);
				})(...args);
			}
	}
};
Point.prototype.getBoundary = function () {
	return this.getFactory().createGeometryCollection(null);
};
Point.prototype.clone = function () {
	var p = Point.super_.prototype.clone.call(this);
	p.coordinates = this.coordinates.clone();
	return p;
};
Point.prototype.getGeometryType = function () {
	return "Point";
};
Point.prototype.getCoordinateSequence = function () {
	return this.coordinates;
};
Point.prototype.getY = function () {
	if (this.getCoordinate() === null) {
		throw new IllegalStateException("getY called on empty Point");
	}
	return this.y;
};
Point.prototype.isEmpty = function () {
	return this.coordinates.size() === 0;
};
Point.prototype.init = function (coordinates) {
	if (coordinates === null) {
		coordinates = this.getFactory().getCoordinateSequenceFactory().create([]);
	}
	Assert.isTrue(coordinates.size() <= 1);
	this.coordinates = coordinates;
};
Point.prototype.isSimple = function () {
	return true;
};
Point.serialVersionUID = 4902022702746614570;

