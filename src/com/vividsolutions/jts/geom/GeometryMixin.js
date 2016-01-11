import WKTWriter from '../io/WKTWriter';
import GeometryCollectionMapper from './util/GeometryCollectionMapper';
import IsValidOp from '../operation/valid/IsValidOp';
import InteriorPointArea from '../algorithm/InteriorPointArea';
import UnaryUnionOp from '../operation/union/UnaryUnionOp';
import SnapIfNeededOverlayOp from '../operation/overlay/snap/SnapIfNeededOverlayOp';
import InteriorPointLine from '../algorithm/InteriorPointLine';
import IsSimpleOp from '../operation/IsSimpleOp';
import BufferOp from '../operation/buffer/BufferOp';
import ConvexHull from '../algorithm/ConvexHull';
import Centroid from '../algorithm/Centroid';
import Comparable from 'java/lang/Comparable';
import RelateOp from '../operation/relate/RelateOp';
import InteriorPointPoint from '../algorithm/InteriorPointPoint';
import Cloneable from 'java/lang/Cloneable';
import Serializable from 'java/io/Serializable';
import DistanceOp from '../operation/distance/DistanceOp';
import Envelope from './Envelope';
import RectangleContains from '../operation/predicate/RectangleContains';
import Assert from '../util/Assert';
import RectangleIntersects from '../operation/predicate/RectangleIntersects';
import OverlayOp from '../operation/overlay/OverlayOp';

import Geometry from './Geometry';
import GeometryCollection from './GeometryCollection';

Geometry.hasNonEmptyElements = function(geometries) {
	for (var i = 0; i < geometries.length; i++) {
		if (!geometries[i].isEmpty()) {
			return true;
		}
	}
	return false;
}
Geometry.hasNullElements = function(array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] === null) {
			return true;
		}
	}
	return false;
}

const mixin = {
	isGeometryCollection() {
		return this instanceof GeometryCollection;
	},
	getFactory() {
		return this.factory;
	},
	getGeometryN(n) {
		return this;
	},
	getArea() {
		return 0.0;
	},
	union(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						return UnaryUnionOp.union(this);
					})(...args);
				case 1:
					return ((...args) => {
						let [other] = args;
						if (this.isEmpty() || other.isEmpty()) {
							if (this.isEmpty() && other.isEmpty()) return OverlayOp.createEmptyResult(OverlayOp.UNION, this, other, this.factory);
							if (this.isEmpty()) return other.copy();
							if (other.isEmpty()) return this.copy();
						}
						this.checkNotGeometryCollection(this);
						this.checkNotGeometryCollection(other);
						return SnapIfNeededOverlayOp.overlayOp(this, other, OverlayOp.UNION);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	},
	isValid() {
		return IsValidOp.isValid(this);
	},
	intersection(other) {
		if (this.isEmpty() || other.isEmpty()) return OverlayOp.createEmptyResult(OverlayOp.INTERSECTION, this, other, this.factory);
		if (this.isGeometryCollection()) {
			var g2 = other;
			return GeometryCollectionMapper.map(this, new (class {
				map(g) {
					return g.intersection(g2);
				}
			})());
		}
		this.checkNotGeometryCollection(this);
		this.checkNotGeometryCollection(other);
		return SnapIfNeededOverlayOp.overlayOp(this, other, OverlayOp.INTERSECTION);
	},
	intersects(g) {
		if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) return false;
		if (this.isRectangle()) {
			return RectangleIntersects.intersects(this, g);
		}
		if (g.isRectangle()) {
			return RectangleIntersects.intersects(g, this);
		}
		return this.relate(g).isIntersects();
	},
	buffer(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [distance] = args;
						return BufferOp.bufferOp(this, distance);
					})(...args);
				case 2:
					return ((...args) => {
						let [distance, quadrantSegments] = args;
						return BufferOp.bufferOp(this, distance, quadrantSegments);
					})(...args);
				case 3:
					return ((...args) => {
						let [distance, quadrantSegments, endCapStyle] = args;
						return BufferOp.bufferOp(this, distance, quadrantSegments, endCapStyle);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	},
	convexHull() {
		return new ConvexHull(this).getConvexHull();
	},
	checkNotGeometryCollection(g) {
		return !(this instanceof GeometryCollection);
	},
	relate(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [g] = args;
						this.checkNotGeometryCollection(this);
						this.checkNotGeometryCollection(g);
						return RelateOp.relate(this, g);
					})(...args);
				case 2:
					return ((...args) => {
						let [g, intersectionPattern] = args;
						return this.relate(g).matches(intersectionPattern);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	},
	getCentroid() {
		if (this.isEmpty()) return this.factory.createPoint();
		var centPt = Centroid.getCentroid(this);
		return this.createPointFromInternalCoord(centPt, this);
	},
	isEquivalentClass(other) {
		return this.getClass() === other.getClass();
	},
	getInteriorPoint() {
		if (this.isEmpty()) return this.factory.createPoint();
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
	},
	symDifference(other) {
		if (this.isEmpty() || other.isEmpty()) {
			if (this.isEmpty() && other.isEmpty()) return OverlayOp.createEmptyResult(OverlayOp.SYMDIFFERENCE, this, other, this.factory);
			if (this.isEmpty()) return other.copy();
			if (other.isEmpty()) return this.copy();
		}
		this.checkNotGeometryCollection(this);
		this.checkNotGeometryCollection(other);
		return SnapIfNeededOverlayOp.overlayOp(this, other, OverlayOp.SYMDIFFERENCE);
	},
	createPointFromInternalCoord(coord, exemplar) {
		exemplar.getPrecisionModel().makePrecise(coord);
		return exemplar.getFactory().createPoint(coord);
	},
	disjoint(g) {
		return !this.intersects(g);
	},
	toText() {
		var writer = new WKTWriter();
		return writer.write(this);
	},
	contains(g) {
		if (!this.getEnvelopeInternal().contains(g.getEnvelopeInternal())) return false;
		if (this.isRectangle()) {
			return RectangleContains.contains(this, g);
		}
		return this.relate(g).isContains();
	},
	difference(other) {
		if (this.isEmpty()) return OverlayOp.createEmptyResult(OverlayOp.DIFFERENCE, this, other, this.factory);
		if (other.isEmpty()) return this.copy();
		this.checkNotGeometryCollection(this);
		this.checkNotGeometryCollection(other);
		return SnapIfNeededOverlayOp.overlayOp(this, other, OverlayOp.DIFFERENCE);
	},
	isSimple() {
		var op = new IsSimpleOp(this);
		return op.isSimple();
	},
	isWithinDistance(geom, distance) {
		var envDist = this.getEnvelopeInternal().distance(geom.getEnvelopeInternal());
		if (envDist > distance) return false;
		return DistanceOp.isWithinDistance(this, geom, distance);
	},
	distance(g) {
		return DistanceOp.distance(this, g);
	}
}

for (const key in mixin) {
	Geometry.prototype[key] = mixin[key];
};
