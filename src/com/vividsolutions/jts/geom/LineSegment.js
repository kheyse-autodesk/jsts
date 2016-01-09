import NotRepresentableException from '../algorithm/NotRepresentableException';
import CGAlgorithms from '../algorithm/CGAlgorithms';
import Coordinate from './Coordinate';
import Double from 'java/lang/Double';
import Comparable from 'java/lang/Comparable';
import RobustLineIntersector from '../algorithm/RobustLineIntersector';
import HCoordinate from '../algorithm/HCoordinate';
import Serializable from 'java/io/Serializable';
export default class LineSegment {
	constructor(...args) {
		(() => {
			this.p0 = null;
			this.p1 = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						overloads.call(this, new Coordinate(), new Coordinate());
					})(...args);
				case 1:
					return ((...args) => {
						let [ls] = args;
						overloads.call(this, ls.p0, ls.p1);
					})(...args);
				case 2:
					return ((...args) => {
						let [p0, p1] = args;
						this.p0 = p0;
						this.p1 = p1;
					})(...args);
				case 4:
					return ((...args) => {
						let [x0, y0, x1, y1] = args;
						overloads.call(this, new Coordinate(x0, y0), new Coordinate(x1, y1));
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Comparable, Serializable];
	}
	static get serialVersionUID() {
		return 3252005833466256227;
	}
	static midPoint(p0, p1) {
		return new Coordinate((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
	}
	minX() {
		return Math.min(this.p0.x, this.p1.x);
	}
	orientationIndex(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Coordinate) {
						return ((...args) => {
							let [p] = args;
							return CGAlgorithms.orientationIndex(this.p0, this.p1, p);
						})(...args);
					} else if (args[0] instanceof LineSegment) {
						return ((...args) => {
							let [seg] = args;
							var orient0 = CGAlgorithms.orientationIndex(this.p0, this.p1, seg.p0);
							var orient1 = CGAlgorithms.orientationIndex(this.p0, this.p1, seg.p1);
							if (orient0 >= 0 && orient1 >= 0) return Math.max(orient0, orient1);
							if (orient0 <= 0 && orient1 <= 0) return Math.max(orient0, orient1);
							return 0;
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	toGeometry(geomFactory) {
		return geomFactory.createLineString([this.p0, this.p1]);
	}
	isVertical() {
		return this.p0.x === this.p1.x;
	}
	equals(o) {
		if (!(o instanceof LineSegment)) {
			return false;
		}
		var other = o;
		return this.p0.equals(other.p0) && this.p1.equals(other.p1);
	}
	intersection(line) {
		var li = new RobustLineIntersector();
		li.computeIntersection(this.p0, this.p1, line.p0, line.p1);
		if (li.hasIntersection()) return li.getIntersection(0);
		return null;
	}
	project(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof LineSegment) {
						return ((...args) => {
							let [seg] = args;
							var pf0 = this.projectionFactor(seg.p0);
							var pf1 = this.projectionFactor(seg.p1);
							if (pf0 >= 1.0 && pf1 >= 1.0) return null;
							if (pf0 <= 0.0 && pf1 <= 0.0) return null;
							var newp0 = this.project(seg.p0);
							if (pf0 < 0.0) newp0 = this.p0;
							if (pf0 > 1.0) newp0 = this.p1;
							var newp1 = this.project(seg.p1);
							if (pf1 < 0.0) newp1 = this.p0;
							if (pf1 > 1.0) newp1 = this.p1;
							return new LineSegment(newp0, newp1);
						})(...args);
					} else if (args[0] instanceof Coordinate) {
						return ((...args) => {
							let [p] = args;
							if (p.equals(this.p0) || p.equals(this.p1)) return new Coordinate(p);
							var r = this.projectionFactor(p);
							var coord = new Coordinate();
							coord.x = this.p0.x + r * (this.p1.x - this.p0.x);
							coord.y = this.p0.y + r * (this.p1.y - this.p0.y);
							return coord;
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	normalize() {
		if (this.p1.compareTo(this.p0) < 0) this.reverse();
	}
	angle() {
		return Math.atan2(this.p1.y - this.p0.y, this.p1.x - this.p0.x);
	}
	getCoordinate(i) {
		if (i === 0) return this.p0;
		return this.p1;
	}
	distancePerpendicular(p) {
		return CGAlgorithms.distancePointLinePerpendicular(p, this.p0, this.p1);
	}
	minY() {
		return Math.min(this.p0.y, this.p1.y);
	}
	midPoint() {
		return LineSegment.midPoint(this.p0, this.p1);
	}
	projectionFactor(p) {
		if (p.equals(this.p0)) return 0.0;
		if (p.equals(this.p1)) return 1.0;
		var dx = this.p1.x - this.p0.x;
		var dy = this.p1.y - this.p0.y;
		var len = dx * dx + dy * dy;
		if (len <= 0.0) return Double.NaN;
		var r = ((p.x - this.p0.x) * dx + (p.y - this.p0.y) * dy) / len;
		return r;
	}
	closestPoints(line) {
		var intPt = this.intersection(line);
		if (intPt !== null) {
			return [intPt, intPt];
		}
		var closestPt = new Array(2);
		var minDistance = Double.MAX_VALUE;
		var dist = null;
		var close00 = this.closestPoint(line.p0);
		minDistance = close00.distance(line.p0);
		closestPt[0] = close00;
		closestPt[1] = line.p0;
		var close01 = this.closestPoint(line.p1);
		dist = close01.distance(line.p1);
		if (dist < minDistance) {
			minDistance = dist;
			closestPt[0] = close01;
			closestPt[1] = line.p1;
		}
		var close10 = line.closestPoint(this.p0);
		dist = close10.distance(this.p0);
		if (dist < minDistance) {
			minDistance = dist;
			closestPt[0] = this.p0;
			closestPt[1] = close10;
		}
		var close11 = line.closestPoint(this.p1);
		dist = close11.distance(this.p1);
		if (dist < minDistance) {
			minDistance = dist;
			closestPt[0] = this.p1;
			closestPt[1] = close11;
		}
		return closestPt;
	}
	closestPoint(p) {
		var factor = this.projectionFactor(p);
		if (factor > 0 && factor < 1) {
			return this.project(p);
		}
		var dist0 = this.p0.distance(p);
		var dist1 = this.p1.distance(p);
		if (dist0 < dist1) return this.p0;
		return this.p1;
	}
	maxX() {
		return Math.max(this.p0.x, this.p1.x);
	}
	getLength() {
		return this.p0.distance(this.p1);
	}
	compareTo(o) {
		var other = o;
		var comp0 = this.p0.compareTo(other.p0);
		if (comp0 !== 0) return comp0;
		return this.p1.compareTo(other.p1);
	}
	reverse() {
		var temp = this.p0;
		this.p0 = this.p1;
		this.p1 = temp;
	}
	equalsTopo(other) {
		return this.p0.equals(other.p0) && this.p1.equals(other.p1) || this.p0.equals(other.p1) && this.p1.equals(other.p0);
	}
	lineIntersection(line) {
		try {
			var intPt = HCoordinate.intersection(this.p0, this.p1, line.p0, line.p1);
			return intPt;
		} catch (ex) {
			if (ex instanceof NotRepresentableException) {} else throw ex;
		} finally {}
		return null;
	}
	maxY() {
		return Math.max(this.p0.y, this.p1.y);
	}
	pointAlongOffset(segmentLengthFraction, offsetDistance) {
		var segx = this.p0.x + segmentLengthFraction * (this.p1.x - this.p0.x);
		var segy = this.p0.y + segmentLengthFraction * (this.p1.y - this.p0.y);
		var dx = this.p1.x - this.p0.x;
		var dy = this.p1.y - this.p0.y;
		var len = Math.sqrt(dx * dx + dy * dy);
		var ux = 0.0;
		var uy = 0.0;
		if (offsetDistance !== 0.0) {
			if (len <= 0.0) throw new IllegalStateException("Cannot compute offset from zero-length line segment");
			ux = offsetDistance * dx / len;
			uy = offsetDistance * dy / len;
		}
		var offsetx = segx - uy;
		var offsety = segy + ux;
		var coord = new Coordinate(offsetx, offsety);
		return coord;
	}
	setCoordinates(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [ls] = args;
						this.setCoordinates(ls.p0, ls.p1);
					})(...args);
				case 2:
					return ((...args) => {
						let [p0, p1] = args;
						this.p0.x = p0.x;
						this.p0.y = p0.y;
						this.p1.x = p1.x;
						this.p1.y = p1.y;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	segmentFraction(inputPt) {
		var segFrac = this.projectionFactor(inputPt);
		if (segFrac < 0.0) segFrac = 0.0; else if (segFrac > 1.0 || Double.isNaN(segFrac)) segFrac = 1.0;
		return segFrac;
	}
	toString() {
		return Math.trunc(Math.trunc(Math.trunc(Math.trunc(Math.trunc(Math.trunc("LINESTRING( " + this.p0.x + " ") + this.p0.y) + ", ") + this.p1.x) + " ") + this.p1.y) + ")";
	}
	isHorizontal() {
		return this.p0.y === this.p1.y;
	}
	distance(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Coordinate) {
						return ((...args) => {
							let [p] = args;
							return CGAlgorithms.distancePointLine(p, this.p0, this.p1);
						})(...args);
					} else if (args[0] instanceof LineSegment) {
						return ((...args) => {
							let [ls] = args;
							return CGAlgorithms.distanceLineLine(this.p0, this.p1, ls.p0, ls.p1);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	pointAlong(segmentLengthFraction) {
		var coord = new Coordinate();
		coord.x = this.p0.x + segmentLengthFraction * (this.p1.x - this.p0.x);
		coord.y = this.p0.y + segmentLengthFraction * (this.p1.y - this.p0.y);
		return coord;
	}
	hashCode() {
		var bits0 = java.lang.Double.doubleToLongBits(this.p0.x);
		bits0 ^= java.lang.Double.doubleToLongBits(this.p0.y) * 31;
		var hash0 = Math.trunc(bits0) ^ Math.trunc(bits0 >> 32);
		var bits1 = java.lang.Double.doubleToLongBits(this.p1.x);
		bits1 ^= java.lang.Double.doubleToLongBits(this.p1.y) * 31;
		var hash1 = Math.trunc(bits1) ^ Math.trunc(bits1 >> 32);
		return hash0 ^ hash1;
	}
	getClass() {
		return LineSegment;
	}
}

