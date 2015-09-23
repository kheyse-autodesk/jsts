function Geometry(factory) {
	this.envelope = null;
	this.factory = null;
	this.SRID = null;
	this.userData = null;
	if (arguments.length === 0) return;
	this.factory = factory;
	this.SRID = factory.getSRID();
}
module.exports = Geometry
var LineString = require('com/vividsolutions/jts/geom/LineString');
var WKTWriter = require('com/vividsolutions/jts/io/WKTWriter');
var GeometryCollectionMapper = require('com/vividsolutions/jts/geom/util/GeometryCollectionMapper');
var IsValidOp = require('com/vividsolutions/jts/operation/valid/IsValidOp');
var Point = require('com/vividsolutions/jts/geom/Point');
var InteriorPointArea = require('com/vividsolutions/jts/algorithm/InteriorPointArea');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var MultiPoint = require('com/vividsolutions/jts/geom/MultiPoint');
var UnaryUnionOp = require('com/vividsolutions/jts/operation/union/UnaryUnionOp');
var SnapIfNeededOverlayOp = require('com/vividsolutions/jts/operation/overlay/snap/SnapIfNeededOverlayOp');
var LinearRing = require('com/vividsolutions/jts/geom/LinearRing');
var InteriorPointLine = require('com/vividsolutions/jts/algorithm/InteriorPointLine');
var IsSimpleOp = require('com/vividsolutions/jts/operation/IsSimpleOp');
var BufferOp = require('com/vividsolutions/jts/operation/buffer/BufferOp');
var MultiPolygon = require('com/vividsolutions/jts/geom/MultiPolygon');
var GeometryComponentFilter = require('com/vividsolutions/jts/geom/GeometryComponentFilter');
var ConvexHull = require('com/vividsolutions/jts/algorithm/ConvexHull');
var Centroid = require('com/vividsolutions/jts/algorithm/Centroid');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var RelateOp = require('com/vividsolutions/jts/operation/relate/RelateOp');
var InteriorPointPoint = require('com/vividsolutions/jts/algorithm/InteriorPointPoint');
var DistanceOp = require('com/vividsolutions/jts/operation/distance/DistanceOp');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
var RectangleContains = require('com/vividsolutions/jts/operation/predicate/RectangleContains');
var Assert = require('com/vividsolutions/jts/util/Assert');
var RectangleIntersects = require('com/vividsolutions/jts/operation/predicate/RectangleIntersects');
var MultiLineString = require('com/vividsolutions/jts/geom/MultiLineString');
var OverlayOp = require('com/vividsolutions/jts/operation/overlay/OverlayOp');
Geometry.prototype.isGeometryCollection = function () {
	return this.getClass().equals(com.vividsolutions.jts.geom.GeometryCollection);
};
Geometry.prototype.getFactory = function () {
	return this.factory;
};
Geometry.prototype.getGeometryN = function (n) {
	return this;
};
Geometry.prototype.getArea = function () {
	return 0.0;
};
Geometry.prototype.union = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [other] = args;
				if (this.isEmpty() || other.isEmpty()) {
					if (this.isEmpty() && other.isEmpty()) return OverlayOp.createEmptyResult(OverlayOp.UNION, this, other, this.factory);
					if (this.isEmpty()) return other.clone();
					if (other.isEmpty()) return this.clone();
				}
				this.checkNotGeometryCollection(this);
				this.checkNotGeometryCollection(other);
				return SnapIfNeededOverlayOp.overlayOp(this, other, OverlayOp.UNION);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				return UnaryUnionOp.union(this);
			})(...args);
	}
};
Geometry.prototype.isValid = function () {
	return IsValidOp.isValid(this);
};
Geometry.prototype.isRectangle = function () {
	return false;
};
Geometry.prototype.equals = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [g] = args;
					if (g === null) return false;
					return this.equalsTopo(g);
				})(...args);
			} else if (args[0] instanceof Object) {
				return ((...args) => {
					let [o] = args;
					if (!(o instanceof Geometry)) return false;
					var g = o;
					return this.equalsExact(g);
				})(...args);
			}
	}
};
Geometry.prototype.equalsExact = function (other) {
	return this === other || this.equalsExact(other, 0);
};
Geometry.prototype.intersection = function (other) {
	if (this.isEmpty() || other.isEmpty()) return OverlayOp.createEmptyResult(OverlayOp.INTERSECTION, this, other, this.factory);
	if (this.isGeometryCollection()) {
		var g2 = other;
		return GeometryCollectionMapper.map(this, new GeometryMapper.MapOp());
	}
	this.checkNotGeometryCollection(this);
	this.checkNotGeometryCollection(other);
	return SnapIfNeededOverlayOp.overlayOp(this, other, OverlayOp.INTERSECTION);
};
Geometry.prototype.covers = function (g) {
	if (!this.getEnvelopeInternal().covers(g.getEnvelopeInternal())) return false;
	if (this.isRectangle()) {
		return true;
	}
	return this.relate(g).isCovers();
};
Geometry.prototype.getClassSortIndex = function () {
	for (var i = 0; i < Geometry.sortedClasses.length; i++) {
		if (Geometry.sortedClasses[i].isInstance(this)) return i;
	}
	Assert.shouldNeverReachHere("Class not supported: " + this.getClass());
	return -1;
};
Geometry.prototype.intersects = function (g) {
	if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) return false;
	if (this.isRectangle()) {
		return RectangleIntersects.intersects(this, g);
	}
	if (g.isRectangle()) {
		return RectangleIntersects.intersects(g, this);
	}
	return this.relate(g).isIntersects();
};
Geometry.prototype.touches = function (g) {
	if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) return false;
	return this.relate(g).isTouches(this.getDimension(), g.getDimension());
};
Geometry.prototype.geometryChanged = function () {
	this.apply(Geometry.geometryChangedFilter);
};
Geometry.prototype.within = function (g) {
	return g.contains(this);
};
Geometry.prototype.geometryChangedAction = function () {
	this.envelope = null;
};
Geometry.prototype.buffer = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [distance, quadrantSegments] = args;
				return BufferOp.bufferOp(this, distance, quadrantSegments);
			})(...args);
		case 1:
			return ((...args) => {
				let [distance] = args;
				return BufferOp.bufferOp(this, distance);
			})(...args);
		case 3:
			return ((...args) => {
				let [distance, quadrantSegments, endCapStyle] = args;
				return BufferOp.bufferOp(this, distance, quadrantSegments, endCapStyle);
			})(...args);
	}
};
Geometry.prototype.equalsNorm = function (g) {
	if (g === null) return false;
	return this.norm().equalsExact(g.norm());
};
Geometry.prototype.getLength = function () {
	return 0.0;
};
Geometry.prototype.getNumGeometries = function () {
	return 1;
};
Geometry.prototype.compareTo = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [o, comp] = args;
				var other = o;
				if (this.getClassSortIndex() !== other.getClassSortIndex()) {
					return this.getClassSortIndex() - other.getClassSortIndex();
				}
				if (this.isEmpty() && other.isEmpty()) {
					return 0;
				}
				if (this.isEmpty()) {
					return -1;
				}
				if (other.isEmpty()) {
					return 1;
				}
				return this.compareToSameClass(o, comp);
			})(...args);
		case 1:
			return ((...args) => {
				let [o] = args;
				var other = o;
				if (this.getClassSortIndex() !== other.getClassSortIndex()) {
					return this.getClassSortIndex() - other.getClassSortIndex();
				}
				if (this.isEmpty() && other.isEmpty()) {
					return 0;
				}
				if (this.isEmpty()) {
					return -1;
				}
				if (other.isEmpty()) {
					return 1;
				}
				return this.compareToSameClass(o);
			})(...args);
	}
};
Geometry.prototype.convexHull = function () {
	return new ConvexHull(this).getConvexHull();
};
Geometry.prototype.equalsTopo = function (g) {
	if (!this.getEnvelopeInternal().equals(g.getEnvelopeInternal())) return false;
	return this.relate(g).isEquals(this.getDimension(), g.getDimension());
};
Geometry.prototype.coveredBy = function (g) {
	return g.covers(this);
};
Geometry.prototype.getUserData = function () {
	return this.userData;
};
Geometry.prototype.getSRID = function () {
	return this.SRID;
};
Geometry.prototype.getEnvelope = function () {
	return this.getFactory().toGeometry(this.getEnvelopeInternal());
};
Geometry.prototype.checkNotGeometryCollection = function (g) {
	if (g.getClass().getName().equals("com.vividsolutions.jts.geom.GeometryCollection")) {
		throw new IllegalArgumentException("This method does not support GeometryCollection arguments");
	}
};
Geometry.prototype.equal = function (a, b, tolerance) {
	if (tolerance === 0) {
		return a.equals(b);
	}
	return a.distance(b) <= tolerance;
};
Geometry.prototype.relate = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [g, intersectionPattern] = args;
				return this.relate(g).matches(intersectionPattern);
			})(...args);
		case 1:
			return ((...args) => {
				let [g] = args;
				this.checkNotGeometryCollection(this);
				this.checkNotGeometryCollection(g);
				return RelateOp.relate(this, g);
			})(...args);
	}
};
Geometry.prototype.overlaps = function (g) {
	if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) return false;
	return this.relate(g).isOverlaps(this.getDimension(), g.getDimension());
};
Geometry.prototype.norm = function () {
	var copy = this.clone();
	copy.normalize();
	return copy;
};
Geometry.prototype.getPrecisionModel = function () {
	return this.factory.getPrecisionModel();
};
Geometry.prototype.getCentroid = function () {
	if (this.isEmpty()) return this.factory.createPoint(null);
	var centPt = Centroid.getCentroid(this);
	return this.createPointFromInternalCoord(centPt, this);
};
Geometry.prototype.getEnvelopeInternal = function () {
	if (this.envelope === null) {
		this.envelope = this.computeEnvelopeInternal();
	}
	return new Envelope(this.envelope);
};
Geometry.prototype.isEquivalentClass = function (other) {
	return this.getClass().getName().equals(other.getClass().getName());
};
Geometry.prototype.clone = function () {
	try {
		var clone = Geometry.super_.prototype.clone.call(this);
		if (clone.envelope !== null) {
			clone.envelope = new Envelope(clone.envelope);
		}
		return clone;
	} catch (e) {
		if (e instanceof CloneNotSupportedException) {
			Assert.shouldNeverReachHere();
			return null;
		}
	} finally {}
};
Geometry.prototype.setSRID = function (SRID) {
	this.SRID = SRID;
};
Geometry.prototype.getInteriorPoint = function () {
	if (this.isEmpty()) return this.factory.createPoint(null);
	var interiorPt = null;
	var dim = this.getDimension();
	if (dim === 0) {
		var intPt = new InteriorPointPoint(this);
		interiorPt = intPt.getInteriorPoint();
	} else if (dim === 1) {
		var intPt = new InteriorPointLine(this);
		interiorPt = intPt.getInteriorPoint();
	} else {
		var intPt = new InteriorPointArea(this);
		interiorPt = intPt.getInteriorPoint();
	}
	return this.createPointFromInternalCoord(interiorPt, this);
};
Geometry.prototype.symDifference = function (other) {
	if (this.isEmpty() || other.isEmpty()) {
		if (this.isEmpty() && other.isEmpty()) return OverlayOp.createEmptyResult(OverlayOp.SYMDIFFERENCE, this, other, this.factory);
		if (this.isEmpty()) return other.clone();
		if (other.isEmpty()) return this.clone();
	}
	this.checkNotGeometryCollection(this);
	this.checkNotGeometryCollection(other);
	return SnapIfNeededOverlayOp.overlayOp(this, other, OverlayOp.SYMDIFFERENCE);
};
Geometry.prototype.setUserData = function (userData) {
	this.userData = userData;
};
Geometry.prototype.toString = function () {
	return this.toText();
};
Geometry.prototype.createPointFromInternalCoord = function (coord, exemplar) {
	exemplar.getPrecisionModel().makePrecise(coord);
	return exemplar.getFactory().createPoint(coord);
};
Geometry.prototype.disjoint = function (g) {
	return !this.intersects(g);
};
Geometry.prototype.toText = function () {
	var writer = new WKTWriter();
	return writer.write(this);
};
Geometry.prototype.crosses = function (g) {
	if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) return false;
	return this.relate(g).isCrosses(this.getDimension(), g.getDimension());
};
Geometry.prototype.contains = function (g) {
	if (!this.getEnvelopeInternal().contains(g.getEnvelopeInternal())) return false;
	if (this.isRectangle()) {
		return RectangleContains.contains(this, g);
	}
	return this.relate(g).isContains();
};
Geometry.prototype.difference = function (other) {
	if (this.isEmpty()) return OverlayOp.createEmptyResult(OverlayOp.DIFFERENCE, this, other, this.factory);
	if (other.isEmpty()) return this.clone();
	this.checkNotGeometryCollection(this);
	this.checkNotGeometryCollection(other);
	return SnapIfNeededOverlayOp.overlayOp(this, other, OverlayOp.DIFFERENCE);
};
Geometry.prototype.isSimple = function () {
	var op = new IsSimpleOp(this);
	return op.isSimple();
};
Geometry.prototype.compare = function (a, b) {
	var i = a.iterator();
	var j = b.iterator();
	while (i.hasNext() && j.hasNext()) {
		var aElement = i.next();
		var bElement = j.next();
		var comparison = aElement.compareTo(bElement);
		if (comparison !== 0) {
			return comparison;
		}
	}
	if (i.hasNext()) {
		return 1;
	}
	if (j.hasNext()) {
		return -1;
	}
	return 0;
};
Geometry.prototype.isWithinDistance = function (geom, distance) {
	var envDist = this.getEnvelopeInternal().distance(geom.getEnvelopeInternal());
	if (envDist > distance) return false;
	return DistanceOp.isWithinDistance(this, geom, distance);
};
Geometry.prototype.distance = function (g) {
	return DistanceOp.distance(this, g);
};
Geometry.prototype.hashCode = function () {
	return this.getEnvelopeInternal().hashCode();
};
Geometry.hasNonEmptyElements = function (geometries) {
	for (var i = 0; i < geometries.length; i++) {
		if (!geometries[i].isEmpty()) {
			return true;
		}
	}
	return false;
};
Geometry.hasNullElements = function (array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] === null) {
			return true;
		}
	}
	return false;
};
Geometry.serialVersionUID = 8763622679187376702;
Geometry.sortedClasses = [Point, MultiPoint, LineString, LinearRing, MultiLineString, Polygon, MultiPolygon, GeometryCollection];
Geometry.geometryChangedFilter = new GeometryComponentFilter();

