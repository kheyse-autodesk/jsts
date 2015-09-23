function GeometryCollection(...args) {
	this.geometries = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geometries, factory] = args;
				GeometryCollection.super_.call(this, factory);
				if (geometries === null) {
					geometries = [];
				}
				if (GeometryCollection.hasNullElements(geometries)) {
					throw new IllegalArgumentException("geometries must not contain null elements");
				}
				this.geometries = geometries;
			})(...args);
		case 3:
			return ((...args) => {
				let [geometries, precisionModel, SRID] = args;
				GeometryCollection.call(this, geometries, new GeometryFactory(precisionModel, SRID));
			})(...args);
	}
}
module.exports = GeometryCollection
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var util = require('util');
util.inherits(GeometryCollection, Geometry)
var TreeSet = require('java/util/TreeSet');
var Arrays = require('java/util/Arrays');
var CoordinateFilter = require('com/vividsolutions/jts/geom/CoordinateFilter');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var GeometryComponentFilter = require('com/vividsolutions/jts/geom/GeometryComponentFilter');
var Dimension = require('com/vividsolutions/jts/geom/Dimension');
var GeometryFilter = require('com/vividsolutions/jts/geom/GeometryFilter');
var CoordinateSequenceFilter = require('com/vividsolutions/jts/geom/CoordinateSequenceFilter');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
var Assert = require('com/vividsolutions/jts/util/Assert');
GeometryCollection.prototype.computeEnvelopeInternal = function () {
	var envelope = new Envelope();
	for (var i = 0; i < this.geometries.length; i++) {
		envelope.expandToInclude(this.geometries[i].getEnvelopeInternal());
	}
	return envelope;
};
GeometryCollection.prototype.getGeometryN = function (n) {
	return this.geometries[n];
};
GeometryCollection.prototype.getCoordinates = function () {
	var coordinates = [];
	var k = -1;
	for (var i = 0; i < this.geometries.length; i++) {
		var childCoordinates = this.geometries[i].getCoordinates();
		for (var j = 0; j < childCoordinates.length; j++) {
			k++;
			coordinates[k] = childCoordinates[j];
		}
	}
	return coordinates;
};
GeometryCollection.prototype.getArea = function () {
	var area = 0.0;
	for (var i = 0; i < this.geometries.length; i++) {
		area += this.geometries[i].getArea();
	}
	return area;
};
GeometryCollection.prototype.equalsExact = function (other, tolerance) {
	if (!this.isEquivalentClass(other)) {
		return false;
	}
	var otherCollection = other;
	if (this.geometries.length !== otherCollection.geometries.length) {
		return false;
	}
	for (var i = 0; i < this.geometries.length; i++) {
		if (!this.geometries[i].equalsExact(otherCollection.geometries[i], tolerance)) {
			return false;
		}
	}
	return true;
};
GeometryCollection.prototype.normalize = function () {
	for (var i = 0; i < this.geometries.length; i++) {
		this.geometries[i].normalize();
	}
	Arrays.sort(this.geometries);
};
GeometryCollection.prototype.getCoordinate = function () {
	if (this.isEmpty()) return null;
	return this.geometries[0].getCoordinate();
};
GeometryCollection.prototype.getBoundaryDimension = function () {
	var dimension = Dimension.FALSE;
	for (var i = 0; i < this.geometries.length; i++) {
		dimension = Math.max(dimension, this.geometries[i].getBoundaryDimension());
	}
	return dimension;
};
GeometryCollection.prototype.getDimension = function () {
	var dimension = Dimension.FALSE;
	for (var i = 0; i < this.geometries.length; i++) {
		dimension = Math.max(dimension, this.geometries[i].getDimension());
	}
	return dimension;
};
GeometryCollection.prototype.getLength = function () {
	var sum = 0.0;
	for (var i = 0; i < this.geometries.length; i++) {
		sum += this.geometries[i].getLength();
	}
	return sum;
};
GeometryCollection.prototype.getNumPoints = function () {
	var numPoints = 0;
	for (var i = 0; i < this.geometries.length; i++) {
		numPoints += this.geometries[i].getNumPoints();
	}
	return numPoints;
};
GeometryCollection.prototype.getNumGeometries = function () {
	return this.geometries.length;
};
GeometryCollection.prototype.reverse = function () {
	var n = this.geometries.length;
	var revGeoms = [];
	for (var i = 0; i < this.geometries.length; i++) {
		revGeoms[i] = this.geometries[i].reverse();
	}
	return this.getFactory().createGeometryCollection(revGeoms);
};
GeometryCollection.prototype.compareToSameClass = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [o, comp] = args;
				var gc = o;
				var n1 = this.getNumGeometries();
				var n2 = gc.getNumGeometries();
				var i = 0;
				while (i < n1 && i < n2) {
					var thisGeom = this.getGeometryN(i);
					var otherGeom = gc.getGeometryN(i);
					var holeComp = thisGeom.compareToSameClass(otherGeom, comp);
					if (holeComp !== 0) return holeComp;
					i++;
				}
				if (i < n1) return 1;
				if (i < n2) return -1;
				return 0;
			})(...args);
		case 1:
			return ((...args) => {
				let [o] = args;
				var theseElements = new TreeSet(Arrays.asList(this.geometries));
				var otherElements = new TreeSet(Arrays.asList(this.geometries));
				return this.compare(theseElements, otherElements);
			})(...args);
	}
};
GeometryCollection.prototype.apply = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof CoordinateFilter) {
				return ((...args) => {
					let [filter] = args;
					for (var i = 0; i < this.geometries.length; i++) {
						this.geometries[i].apply(filter);
					}
				})(...args);
			} else if (args[0] instanceof CoordinateSequenceFilter) {
				return ((...args) => {
					let [filter] = args;
					if (this.geometries.length === 0) return null;
					for (var i = 0; i < this.geometries.length; i++) {
						this.geometries[i].apply(filter);
						if (filter.isDone()) {
							break;
						}
					}
					if (filter.isGeometryChanged()) this.geometryChanged();
				})(...args);
			} else if (args[0] instanceof GeometryFilter) {
				return ((...args) => {
					let [filter] = args;
					filter.filter(this);
					for (var i = 0; i < this.geometries.length; i++) {
						this.geometries[i].apply(filter);
					}
				})(...args);
			} else if (args[0] instanceof GeometryComponentFilter) {
				return ((...args) => {
					let [filter] = args;
					filter.filter(this);
					for (var i = 0; i < this.geometries.length; i++) {
						this.geometries[i].apply(filter);
					}
				})(...args);
			}
	}
};
GeometryCollection.prototype.getBoundary = function () {
	this.checkNotGeometryCollection(this);
	Assert.shouldNeverReachHere();
	return null;
};
GeometryCollection.prototype.clone = function () {
	var gc = GeometryCollection.super_.prototype.clone.call(this);
	gc.geometries = [];
	for (var i = 0; i < this.geometries.length; i++) {
		gc.geometries[i] = this.geometries[i].clone();
	}
	return gc;
};
GeometryCollection.prototype.getGeometryType = function () {
	return "GeometryCollection";
};
GeometryCollection.prototype.isEmpty = function () {
	for (var i = 0; i < this.geometries.length; i++) {
		if (!this.geometries[i].isEmpty()) {
			return false;
		}
	}
	return true;
};
GeometryCollection.serialVersionUID = -5694727726395021467;

