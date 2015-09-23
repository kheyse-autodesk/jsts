function Polygon(...args) {
	this.shell = null;
	this.holes = null;
	switch (args.length) {
		case 4:
			return ((...args) => {
				let [shell, holes, precisionModel, SRID] = args;
				Polygon.call(this, shell, holes, new GeometryFactory(precisionModel, SRID));
			})(...args);
		case 3:
			if (Number.isInteger(args[2]) && args[0] instanceof LinearRing && args[1] instanceof PrecisionModel) {
				return ((...args) => {
					let [shell, precisionModel, SRID] = args;
					Polygon.call(this, shell, [], new GeometryFactory(precisionModel, SRID));
				})(...args);
			} else if (args[2] instanceof GeometryFactory && args[0] instanceof LinearRing && args[1] instanceof Array) {
				return ((...args) => {
					let [shell, holes, factory] = args;
					Polygon.super_.call(this, factory);
					if (shell === null) {
						shell = this.getFactory().createLinearRing(null);
					}
					if (holes === null) {
						holes = [];
					}
					if (Polygon.hasNullElements(holes)) {
						throw new IllegalArgumentException("holes must not contain null elements");
					}
					if (shell.isEmpty() && Polygon.hasNonEmptyElements(holes)) {
						throw new IllegalArgumentException("shell is empty but holes are not");
					}
					this.shell = shell;
					this.holes = holes;
				})(...args);
			}
	}
}
module.exports = Polygon
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var util = require('util');
util.inherits(Polygon, Geometry)
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Arrays = require('java/util/Arrays');
var CoordinateFilter = require('com/vividsolutions/jts/geom/CoordinateFilter');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var LinearRing = require('com/vividsolutions/jts/geom/LinearRing');
var GeometryComponentFilter = require('com/vividsolutions/jts/geom/GeometryComponentFilter');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var PrecisionModel = require('com/vividsolutions/jts/geom/PrecisionModel');
var GeometryFilter = require('com/vividsolutions/jts/geom/GeometryFilter');
var CoordinateSequenceFilter = require('com/vividsolutions/jts/geom/CoordinateSequenceFilter');
Polygon.prototype.computeEnvelopeInternal = function () {
	return this.shell.getEnvelopeInternal();
};
Polygon.prototype.getCoordinates = function () {
	if (this.isEmpty()) {
		return [];
	}
	var coordinates = [];
	var k = -1;
	var shellCoordinates = this.shell.getCoordinates();
	for (var x = 0; x < shellCoordinates.length; x++) {
		k++;
		coordinates[k] = shellCoordinates[x];
	}
	for (var i = 0; i < this.holes.length; i++) {
		var childCoordinates = this.holes[i].getCoordinates();
		for (var j = 0; j < childCoordinates.length; j++) {
			k++;
			coordinates[k] = childCoordinates[j];
		}
	}
	return coordinates;
};
Polygon.prototype.getArea = function () {
	var area = 0.0;
	area += Math.abs(CGAlgorithms.signedArea(this.shell.getCoordinateSequence()));
	for (var i = 0; i < this.holes.length; i++) {
		area -= Math.abs(CGAlgorithms.signedArea(this.holes[i].getCoordinateSequence()));
	}
	return area;
};
Polygon.prototype.isRectangle = function () {
	if (this.getNumInteriorRing() !== 0) return false;
	if (this.shell === null) return false;
	if (this.shell.getNumPoints() !== 5) return false;
	var seq = this.shell.getCoordinateSequence();
	var env = this.getEnvelopeInternal();
	for (var i = 0; i < 5; i++) {
		var x = seq.getX(i);
		if (!(x === env.getMinX() || x === env.getMaxX())) return false;
		var y = seq.getY(i);
		if (!(y === env.getMinY() || y === env.getMaxY())) return false;
	}
	var prevX = seq.getX(0);
	var prevY = seq.getY(0);
	for (var i = 1; i <= 4; i++) {
		var x = seq.getX(i);
		var y = seq.getY(i);
		var xChanged = x !== prevX;
		var yChanged = y !== prevY;
		if (xChanged === yChanged) return false;
		prevX = x;
		prevY = y;
	}
	return true;
};
Polygon.prototype.equalsExact = function (other, tolerance) {
	if (!this.isEquivalentClass(other)) {
		return false;
	}
	var otherPolygon = other;
	var thisShell = this.shell;
	var otherPolygonShell = otherPolygon.shell;
	if (!thisShell.equalsExact(otherPolygonShell, tolerance)) {
		return false;
	}
	if (this.holes.length !== otherPolygon.holes.length) {
		return false;
	}
	for (var i = 0; i < this.holes.length; i++) {
		if (!this.holes[i].equalsExact(otherPolygon.holes[i], tolerance)) {
			return false;
		}
	}
	return true;
};
Polygon.prototype.normalize = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [ring, clockwise] = args;
				if (ring.isEmpty()) {
					return null;
				}
				var uniqueCoordinates = [];
				System.arraycopy(ring.getCoordinates(), 0, uniqueCoordinates, 0, uniqueCoordinates.length);
				var minCoordinate = CoordinateArrays.minCoordinate(ring.getCoordinates());
				CoordinateArrays.scroll(uniqueCoordinates, minCoordinate);
				System.arraycopy(uniqueCoordinates, 0, ring.getCoordinates(), 0, uniqueCoordinates.length);
				ring.getCoordinates()[uniqueCoordinates.length] = uniqueCoordinates[0];
				if (CGAlgorithms.isCCW(ring.getCoordinates()) === clockwise) {
					CoordinateArrays.reverse(ring.getCoordinates());
				}
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				this.normalize(this.shell, true);
				for (var i = 0; i < this.holes.length; i++) {
					this.normalize(this.holes[i], false);
				}
				Arrays.sort(this.holes);
			})(...args);
	}
};
Polygon.prototype.getCoordinate = function () {
	return this.shell.getCoordinate();
};
Polygon.prototype.getNumInteriorRing = function () {
	return this.holes.length;
};
Polygon.prototype.getBoundaryDimension = function () {
	return 1;
};
Polygon.prototype.getDimension = function () {
	return 2;
};
Polygon.prototype.getLength = function () {
	var len = 0.0;
	len += this.shell.getLength();
	for (var i = 0; i < this.holes.length; i++) {
		len += this.holes[i].getLength();
	}
	return len;
};
Polygon.prototype.getNumPoints = function () {
	var numPoints = this.shell.getNumPoints();
	for (var i = 0; i < this.holes.length; i++) {
		numPoints += this.holes[i].getNumPoints();
	}
	return numPoints;
};
Polygon.prototype.reverse = function () {
	var poly = Polygon.super_.prototype.clone.call(this);
	poly.shell = this.shell.clone().reverse();
	poly.holes = [];
	for (var i = 0; i < this.holes.length; i++) {
		poly.holes[i] = this.holes[i].clone().reverse();
	}
	return poly;
};
Polygon.prototype.convexHull = function () {
	return this.getExteriorRing().convexHull();
};
Polygon.prototype.compareToSameClass = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [o, comp] = args;
				var poly = o;
				var thisShell = this.shell;
				var otherShell = poly.shell;
				var shellComp = thisShell.compareToSameClass(otherShell, comp);
				if (shellComp !== 0) return shellComp;
				var nHole1 = this.getNumInteriorRing();
				var nHole2 = poly.getNumInteriorRing();
				var i = 0;
				while (i < nHole1 && i < nHole2) {
					var thisHole = this.getInteriorRingN(i);
					var otherHole = poly.getInteriorRingN(i);
					var holeComp = thisHole.compareToSameClass(otherHole, comp);
					if (holeComp !== 0) return holeComp;
					i++;
				}
				if (i < nHole1) return 1;
				if (i < nHole2) return -1;
				return 0;
			})(...args);
		case 1:
			return ((...args) => {
				let [o] = args;
				var thisShell = this.shell;
				var otherShell = this.shell;
				return thisShell.compareToSameClass(otherShell);
			})(...args);
	}
};
Polygon.prototype.apply = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof CoordinateFilter) {
				return ((...args) => {
					let [filter] = args;
					this.shell.apply(filter);
					for (var i = 0; i < this.holes.length; i++) {
						this.holes[i].apply(filter);
					}
				})(...args);
			} else if (args[0] instanceof CoordinateSequenceFilter) {
				return ((...args) => {
					let [filter] = args;
					this.shell.apply(filter);
					if (!filter.isDone()) {
						for (var i = 0; i < this.holes.length; i++) {
							this.holes[i].apply(filter);
							if (filter.isDone()) break;
						}
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
					this.shell.apply(filter);
					for (var i = 0; i < this.holes.length; i++) {
						this.holes[i].apply(filter);
					}
				})(...args);
			}
	}
};
Polygon.prototype.getBoundary = function () {
	if (this.isEmpty()) {
		return this.getFactory().createMultiLineString(null);
	}
	var rings = [];
	rings[0] = this.shell;
	for (var i = 0; i < this.holes.length; i++) {
		rings[i + 1] = this.holes[i];
	}
	if (rings.length <= 1) return this.getFactory().createLinearRing(rings[0].getCoordinateSequence());
	return this.getFactory().createMultiLineString(rings);
};
Polygon.prototype.clone = function () {
	var poly = Polygon.super_.prototype.clone.call(this);
	poly.shell = this.shell.clone();
	poly.holes = [];
	for (var i = 0; i < this.holes.length; i++) {
		poly.holes[i] = this.holes[i].clone();
	}
	return poly;
};
Polygon.prototype.getGeometryType = function () {
	return "Polygon";
};
Polygon.prototype.getExteriorRing = function () {
	return this.shell;
};
Polygon.prototype.isEmpty = function () {
	return this.shell.isEmpty();
};
Polygon.prototype.getInteriorRingN = function (n) {
	return this.holes[n];
};
Polygon.serialVersionUID = -3494792200821764533;

