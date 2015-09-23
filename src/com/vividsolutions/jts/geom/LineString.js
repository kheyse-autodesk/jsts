function LineString(...args) {
	this.points = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [points, factory] = args;
				LineString.super_.call(this, factory);
				this.init(points);
			})(...args);
		case 3:
			return ((...args) => {
				let [points, precisionModel, SRID] = args;
				LineString.super_.call(this, new GeometryFactory(precisionModel, SRID));
				this.init(this.getFactory().getCoordinateSequenceFactory().create(points));
			})(...args);
	}
}
module.exports = LineString
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var util = require('util');
util.inherits(LineString, Geometry)
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var CoordinateFilter = require('com/vividsolutions/jts/geom/CoordinateFilter');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var BoundaryOp = require('com/vividsolutions/jts/operation/BoundaryOp');
var CoordinateSequences = require('com/vividsolutions/jts/geom/CoordinateSequences');
var GeometryComponentFilter = require('com/vividsolutions/jts/geom/GeometryComponentFilter');
var Dimension = require('com/vividsolutions/jts/geom/Dimension');
var GeometryFilter = require('com/vividsolutions/jts/geom/GeometryFilter');
var CoordinateSequenceFilter = require('com/vividsolutions/jts/geom/CoordinateSequenceFilter');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
LineString.prototype.computeEnvelopeInternal = function () {
	if (this.isEmpty()) {
		return new Envelope();
	}
	return this.points.expandEnvelope(new Envelope());
};
LineString.prototype.isRing = function () {
	return this.isClosed() && this.isSimple();
};
LineString.prototype.getCoordinates = function () {
	return this.points.toCoordinateArray();
};
LineString.prototype.equalsExact = function (other, tolerance) {
	if (!this.isEquivalentClass(other)) {
		return false;
	}
	var otherLineString = other;
	if (this.points.size() !== otherLineString.points.size()) {
		return false;
	}
	for (var i = 0; i < this.points.size(); i++) {
		if (!this.equal(this.points.getCoordinate(i), otherLineString.points.getCoordinate(i), tolerance)) {
			return false;
		}
	}
	return true;
};
LineString.prototype.normalize = function () {
	for (var i = 0; i < this.points.size() / 2; i++) {
		var j = this.points.size() - 1 - i;
		if (!this.points.getCoordinate(i).equals(this.points.getCoordinate(j))) {
			if (this.points.getCoordinate(i).compareTo(this.points.getCoordinate(j)) > 0) {
				CoordinateSequences.reverse(this.points);
			}
			return null;
		}
	}
};
LineString.prototype.getCoordinate = function () {
	if (this.isEmpty()) return null;
	return this.points.getCoordinate(0);
};
LineString.prototype.getBoundaryDimension = function () {
	if (this.isClosed()) {
		return Dimension.FALSE;
	}
	return 0;
};
LineString.prototype.isClosed = function () {
	if (this.isEmpty()) {
		return false;
	}
	return this.getCoordinateN(0).equals2D(this.getCoordinateN(this.getNumPoints() - 1));
};
LineString.prototype.getEndPoint = function () {
	if (this.isEmpty()) {
		return null;
	}
	return this.getPointN(this.getNumPoints() - 1);
};
LineString.prototype.getDimension = function () {
	return 1;
};
LineString.prototype.getLength = function () {
	return CGAlgorithms.distance(this.points);
};
LineString.prototype.getNumPoints = function () {
	return this.points.size();
};
LineString.prototype.reverse = function () {
	var seq = this.points.clone();
	CoordinateSequences.reverse(seq);
	var revLine = this.getFactory().createLineString(seq);
	return revLine;
};
LineString.prototype.compareToSameClass = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [o, comp] = args;
				var line = o;
				return comp.compare(this.points, line.points);
			})(...args);
		case 1:
			return ((...args) => {
				let [o] = args;
				var line = o;
				var i = 0;
				var j = 0;
				while (i < this.points.size() && j < line.points.size()) {
					var comparison = this.points.getCoordinate(i).compareTo(line.points.getCoordinate(j));
					if (comparison !== 0) {
						return comparison;
					}
					i++;
					j++;
				}
				if (i < this.points.size()) {
					return 1;
				}
				if (j < line.points.size()) {
					return -1;
				}
				return 0;
			})(...args);
	}
};
LineString.prototype.apply = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof CoordinateFilter) {
				return ((...args) => {
					let [filter] = args;
					for (var i = 0; i < this.points.size(); i++) {
						filter.filter(this.points.getCoordinate(i));
					}
				})(...args);
			} else if (args[0] instanceof CoordinateSequenceFilter) {
				return ((...args) => {
					let [filter] = args;
					if (this.points.size() === 0) return null;
					for (var i = 0; i < this.points.size(); i++) {
						filter.filter(this.points, i);
						if (filter.isDone()) break;
					}
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
LineString.prototype.getBoundary = function () {
	return new BoundaryOp(this).getBoundary();
};
LineString.prototype.isEquivalentClass = function (other) {
	return other instanceof LineString;
};
LineString.prototype.clone = function () {
	var ls = LineString.super_.prototype.clone.call(this);
	ls.points = this.points.clone();
	return ls;
};
LineString.prototype.getCoordinateN = function (n) {
	return this.points.getCoordinate(n);
};
LineString.prototype.getGeometryType = function () {
	return "LineString";
};
LineString.prototype.getCoordinateSequence = function () {
	return this.points;
};
LineString.prototype.isEmpty = function () {
	return this.points.size() === 0;
};
LineString.prototype.init = function (points) {
	if (points === null) {
		points = this.getFactory().getCoordinateSequenceFactory().create([]);
	}
	if (points.size() === 1) {
		throw new IllegalArgumentException("Invalid number of points in LineString (found " + points.size() + " - must be 0 or >= 2)");
	}
	this.points = points;
};
LineString.prototype.isCoordinate = function (pt) {
	for (var i = 0; i < this.points.size(); i++) {
		if (this.points.getCoordinate(i).equals(pt)) {
			return true;
		}
	}
	return false;
};
LineString.prototype.getStartPoint = function () {
	if (this.isEmpty()) {
		return null;
	}
	return this.getPointN(0);
};
LineString.prototype.getPointN = function (n) {
	return this.getFactory().createPoint(this.points.getCoordinate(n));
};
LineString.serialVersionUID = 3110669828065365560;

