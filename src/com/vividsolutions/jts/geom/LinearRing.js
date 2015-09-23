function LinearRing(...args) {
	switch (args.length) {
		case 2:
			if (args[0] instanceof Coordinate && args[1] instanceof GeometryFactory) {
				return ((...args) => {
					let [points, factory] = args;
					LinearRing.call(this, factory.getCoordinateSequenceFactory().create(points), factory);
				})(...args);
			} else if (args[0] instanceof CoordinateSequence && args[1] instanceof GeometryFactory) {
				return ((...args) => {
					let [points, factory] = args;
					LinearRing.super_.call(this, points, factory);
					this.validateConstruction();
				})(...args);
			}
		case 3:
			return ((...args) => {
				let [points, precisionModel, SRID] = args;
				LinearRing.call(this, points, new GeometryFactory(precisionModel, SRID));
				this.validateConstruction();
			})(...args);
	}
}
module.exports = LinearRing
var LineString = require('com/vividsolutions/jts/geom/LineString');
var util = require('util');
util.inherits(LinearRing, LineString)
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var CoordinateSequences = require('com/vividsolutions/jts/geom/CoordinateSequences');
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
var Dimension = require('com/vividsolutions/jts/geom/Dimension');
LinearRing.prototype.getBoundaryDimension = function () {
	return Dimension.FALSE;
};
LinearRing.prototype.isClosed = function () {
	if (this.isEmpty()) {
		return true;
	}
	return LinearRing.super_.prototype.isClosed.call(this);
};
LinearRing.prototype.reverse = function () {
	var seq = this.points.clone();
	CoordinateSequences.reverse(seq);
	var rev = this.getFactory().createLinearRing(seq);
	return rev;
};
LinearRing.prototype.validateConstruction = function () {
	if (!this.isEmpty() && !LinearRing.super_.prototype.isClosed.call(this)) {
		throw new IllegalArgumentException("Points of LinearRing do not form a closed linestring");
	}
	if (this.getCoordinateSequence().size() >= 1 && this.getCoordinateSequence().size() < LinearRing.MINIMUM_VALID_SIZE) {
		throw new IllegalArgumentException("Invalid number of points in LinearRing (found " + this.getCoordinateSequence().size() + " - must be 0 or >= 4)");
	}
};
LinearRing.prototype.getGeometryType = function () {
	return "LinearRing";
};
LinearRing.MINIMUM_VALID_SIZE = 4;
LinearRing.serialVersionUID = -4261142084085851829;

