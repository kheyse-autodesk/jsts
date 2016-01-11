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

Geometry.prototype.isValid = function() {
	return IsValidOp.isValid(this);
}

Geometry.prototype.union = function(...args) {
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
	return overloads.apply(this, args)
}

Geometry.prototype.buffer = function(...args) {
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
}

Geometry.prototype.checkNotGeometryCollection = function() {
  return !(this instanceof GeometryCollection);
}
