import Location from 'com/vividsolutions/jts/geom/Location';
import LineString from 'com/vividsolutions/jts/geom/LineString';
import CGAlgorithms from 'com/vividsolutions/jts/algorithm/CGAlgorithms';
import Position from 'com/vividsolutions/jts/geomgraph/Position';
import Point from 'com/vividsolutions/jts/geom/Point';
import NodedSegmentString from 'com/vividsolutions/jts/noding/NodedSegmentString';
import Polygon from 'com/vividsolutions/jts/geom/Polygon';
import MultiPoint from 'com/vividsolutions/jts/geom/MultiPoint';
import LinearRing from 'com/vividsolutions/jts/geom/LinearRing';
import MultiPolygon from 'com/vividsolutions/jts/geom/MultiPolygon';
import Label from 'com/vividsolutions/jts/geomgraph/Label';
import GeometryCollection from 'com/vividsolutions/jts/geom/GeometryCollection';
import CoordinateArrays from 'com/vividsolutions/jts/geom/CoordinateArrays';
import ArrayList from 'java/util/ArrayList';
import MultiLineString from 'com/vividsolutions/jts/geom/MultiLineString';
import Triangle from 'com/vividsolutions/jts/geom/Triangle';
export default class OffsetCurveSetBuilder {
	constructor(...args) {
		(() => {
			this.inputGeom = null;
			this.distance = null;
			this.curveBuilder = null;
			this.curveList = new ArrayList();
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 3:
					return ((...args) => {
						let [inputGeom, distance, curveBuilder] = args;
						this.inputGeom = inputGeom;
						this.distance = distance;
						this.curveBuilder = curveBuilder;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	addPoint(p) {
		if (this.distance <= 0.0) return null;
		var coord = p.getCoordinates();
		var curve = this.curveBuilder.getLineCurve(coord, this.distance);
		this.addCurve(curve, Location.EXTERIOR, Location.INTERIOR);
	}
	addPolygon(p) {
		var offsetDistance = this.distance;
		var offsetSide = Position.LEFT;
		if (this.distance < 0.0) {
			offsetDistance = -this.distance;
			offsetSide = Position.RIGHT;
		}
		var shell = p.getExteriorRing();
		var shellCoord = CoordinateArrays.removeRepeatedPoints(shell.getCoordinates());
		if (this.distance < 0.0 && this.isErodedCompletely(shell, this.distance)) return null;
		if (this.distance <= 0.0 && shellCoord.length < 3) return null;
		this.addPolygonRing(shellCoord, offsetDistance, offsetSide, Location.EXTERIOR, Location.INTERIOR);
		for (var i = 0; i < p.getNumInteriorRing(); i++) {
			var hole = p.getInteriorRingN(i);
			var holeCoord = CoordinateArrays.removeRepeatedPoints(hole.getCoordinates());
			if (this.distance > 0.0 && this.isErodedCompletely(hole, -this.distance)) continue;
			this.addPolygonRing(holeCoord, offsetDistance, Position.opposite(offsetSide), Location.INTERIOR, Location.EXTERIOR);
		}
	}
	isTriangleErodedCompletely(triangleCoord, bufferDistance) {
		var tri = new Triangle(triangleCoord[0], triangleCoord[1], triangleCoord[2]);
		var inCentre = tri.inCentre();
		var distToCentre = CGAlgorithms.distancePointLine(inCentre, tri.p0, tri.p1);
		return distToCentre < Math.abs(bufferDistance);
	}
	addLineString(line) {
		if (this.distance <= 0.0 && !this.curveBuilder.getBufferParameters().isSingleSided()) return null;
		var coord = CoordinateArrays.removeRepeatedPoints(line.getCoordinates());
		var curve = this.curveBuilder.getLineCurve(coord, this.distance);
		this.addCurve(curve, Location.EXTERIOR, Location.INTERIOR);
	}
	addCurve(coord, leftLoc, rightLoc) {
		if (coord === null || coord.length < 2) return null;
		var e = new NodedSegmentString(coord, new Label(0, Location.BOUNDARY, leftLoc, rightLoc));
		this.curveList.add(e);
	}
	getCurves() {
		this.add(this.inputGeom);
		return this.curveList;
	}
	addPolygonRing(coord, offsetDistance, side, cwLeftLoc, cwRightLoc) {
		if (offsetDistance === 0.0 && coord.length < LinearRing.MINIMUM_VALID_SIZE) return null;
		var leftLoc = cwLeftLoc;
		var rightLoc = cwRightLoc;
		if (coord.length >= LinearRing.MINIMUM_VALID_SIZE && CGAlgorithms.isCCW(coord)) {
			leftLoc = cwRightLoc;
			rightLoc = cwLeftLoc;
			side = Position.opposite(side);
		}
		var curve = this.curveBuilder.getRingCurve(coord, side, offsetDistance);
		this.addCurve(curve, leftLoc, rightLoc);
	}
	add(g) {
		if (g.isEmpty()) return null;
		if (g instanceof Polygon) this.addPolygon(g); else if (g instanceof LineString) this.addLineString(g); else if (g instanceof Point) this.addPoint(g); else if (g instanceof MultiPoint) this.addCollection(g); else if (g instanceof MultiLineString) this.addCollection(g); else if (g instanceof MultiPolygon) this.addCollection(g); else if (g instanceof GeometryCollection) this.addCollection(g); else throw new UnsupportedOperationException(g.getClass().getName());
	}
	isErodedCompletely(ring, bufferDistance) {
		var ringCoord = ring.getCoordinates();
		var minDiam = 0.0;
		if (ringCoord.length < 4) return bufferDistance < 0;
		if (ringCoord.length === 4) return this.isTriangleErodedCompletely(ringCoord, bufferDistance);
		var env = ring.getEnvelopeInternal();
		var envMinDimension = Math.min(env.getHeight(), env.getWidth());
		if (bufferDistance < 0.0 && 2 * Math.abs(bufferDistance) > envMinDimension) return true;
		return false;
	}
	addCollection(gc) {
		for (var i = 0; i < gc.getNumGeometries(); i++) {
			var g = gc.getGeometryN(i);
			this.add(g);
		}
	}
	getClass() {
		return OffsetCurveSetBuilder;
	}
}

