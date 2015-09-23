function DistanceOp(...args) {
	this.geom = null;
	this.terminateDistance = 0.0;
	this.ptLocator = new PointLocator();
	this.minDistanceLocation = null;
	this.minDistance = Double.MAX_VALUE;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [g0, g1] = args;
				DistanceOp.call(this, g0, g1, 0.0);
			})(...args);
		case 3:
			return ((...args) => {
				let [g0, g1, terminateDistance] = args;
				this.geom = [];
				this.geom[0] = g0;
				this.geom[1] = g1;
				this.terminateDistance = terminateDistance;
			})(...args);
	}
}
module.exports = DistanceOp
var PointLocator = require('com/vividsolutions/jts/algorithm/PointLocator');
var PolygonExtracter = require('com/vividsolutions/jts/geom/util/PolygonExtracter');
var Location = require('com/vividsolutions/jts/geom/Location');
var LineString = require('com/vividsolutions/jts/geom/LineString');
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Point = require('com/vividsolutions/jts/geom/Point');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var GeometryLocation = require('com/vividsolutions/jts/operation/distance/GeometryLocation');
var Double = require('java/lang/Double');
var PointExtracter = require('com/vividsolutions/jts/geom/util/PointExtracter');
var ConnectedElementLocationFilter = require('com/vividsolutions/jts/operation/distance/ConnectedElementLocationFilter');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
var LinearComponentExtracter = require('com/vividsolutions/jts/geom/util/LinearComponentExtracter');
var List = require('java/util/List');
DistanceOp.prototype.computeContainmentDistance = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [polyGeomIndex, locPtPoly] = args;
				var locationsIndex = 1 - polyGeomIndex;
				var polys = PolygonExtracter.getPolygons(this.geom[polyGeomIndex]);
				if (polys.size() > 0) {
					var insideLocs = ConnectedElementLocationFilter.getLocations(this.geom[locationsIndex]);
					this.computeContainmentDistance(insideLocs, polys, locPtPoly);
					if (this.minDistance <= this.terminateDistance) {
						this.minDistanceLocation[locationsIndex] = locPtPoly[0];
						this.minDistanceLocation[polyGeomIndex] = locPtPoly[1];
						return null;
					}
				}
			})(...args);
		case 3:
			if (args[2] instanceof Array && args[0] instanceof List && args[1] instanceof List) {
				return ((...args) => {
					let [locs, polys, locPtPoly] = args;
					for (var i = 0; i < locs.size(); i++) {
						var loc = locs.get(i);
						for (var j = 0; j < polys.size(); j++) {
							this.computeContainmentDistance(loc, polys.get(j), locPtPoly);
							if (this.minDistance <= this.terminateDistance) return null;
						}
					}
				})(...args);
			} else if (args[2] instanceof Array && args[0] instanceof GeometryLocation && args[1] instanceof Polygon) {
				return ((...args) => {
					let [ptLoc, poly, locPtPoly] = args;
					var pt = ptLoc.getCoordinate();
					if (Location.EXTERIOR !== this.ptLocator.locate(pt, poly)) {
						this.minDistance = 0.0;
						locPtPoly[0] = ptLoc;
						locPtPoly[1] = new GeometryLocation(poly, pt);
						;
						return null;
					}
				})(...args);
			}
		case 0:
			return ((...args) => {
				let [] = args;
				var locPtPoly = [];
				this.computeContainmentDistance(0, locPtPoly);
				if (this.minDistance <= this.terminateDistance) return null;
				this.computeContainmentDistance(1, locPtPoly);
			})(...args);
	}
};
DistanceOp.prototype.computeMinDistanceLinesPoints = function (lines, points, locGeom) {
	for (var i = 0; i < lines.size(); i++) {
		var line = lines.get(i);
		for (var j = 0; j < points.size(); j++) {
			var pt = points.get(j);
			this.computeMinDistance(line, pt, locGeom);
			if (this.minDistance <= this.terminateDistance) return null;
		}
	}
};
DistanceOp.prototype.computeFacetDistance = function () {
	var locGeom = [];
	var lines0 = LinearComponentExtracter.getLines(this.geom[0]);
	var lines1 = LinearComponentExtracter.getLines(this.geom[1]);
	var pts0 = PointExtracter.getPoints(this.geom[0]);
	var pts1 = PointExtracter.getPoints(this.geom[1]);
	this.computeMinDistanceLines(lines0, lines1, locGeom);
	this.updateMinDistance(locGeom, false);
	if (this.minDistance <= this.terminateDistance) return null;
	locGeom[0] = null;
	locGeom[1] = null;
	this.computeMinDistanceLinesPoints(lines0, pts1, locGeom);
	this.updateMinDistance(locGeom, false);
	if (this.minDistance <= this.terminateDistance) return null;
	locGeom[0] = null;
	locGeom[1] = null;
	this.computeMinDistanceLinesPoints(lines1, pts0, locGeom);
	this.updateMinDistance(locGeom, true);
	if (this.minDistance <= this.terminateDistance) return null;
	locGeom[0] = null;
	locGeom[1] = null;
	this.computeMinDistancePoints(pts0, pts1, locGeom);
	this.updateMinDistance(locGeom, false);
};
DistanceOp.prototype.closestPoints = function () {
	return this.nearestPoints();
};
DistanceOp.prototype.nearestLocations = function () {
	this.computeMinDistance();
	return this.minDistanceLocation;
};
DistanceOp.prototype.closestLocations = function () {
	return this.nearestLocations();
};
DistanceOp.prototype.updateMinDistance = function (locGeom, flip) {
	if (locGeom[0] === null) return null;
	if (flip) {
		this.minDistanceLocation[0] = locGeom[1];
		this.minDistanceLocation[1] = locGeom[0];
	} else {
		this.minDistanceLocation[0] = locGeom[0];
		this.minDistanceLocation[1] = locGeom[1];
	}
};
DistanceOp.prototype.nearestPoints = function () {
	this.computeMinDistance();
	var nearestPts = [this.minDistanceLocation[0].getCoordinate(), this.minDistanceLocation[1].getCoordinate()];
	return nearestPts;
};
DistanceOp.prototype.computeMinDistance = function (...args) {
	switch (args.length) {
		case 3:
			if (args[2] instanceof Array && args[0] instanceof LineString && args[1] instanceof LineString) {
				return ((...args) => {
					let [line0, line1, locGeom] = args;
					if (line0.getEnvelopeInternal().distance(line1.getEnvelopeInternal()) > this.minDistance) return null;
					var coord0 = line0.getCoordinates();
					var coord1 = line1.getCoordinates();
					for (var i = 0; i < coord0.length - 1; i++) {
						for (var j = 0; j < coord1.length - 1; j++) {
							var dist = CGAlgorithms.distanceLineLine(coord0[i], coord0[i + 1], coord1[j], coord1[j + 1]);
							if (dist < this.minDistance) {
								this.minDistance = dist;
								var seg0 = new LineSegment(coord0[i], coord0[i + 1]);
								var seg1 = new LineSegment(coord1[j], coord1[j + 1]);
								var closestPt = seg0.closestPoints(seg1);
								locGeom[0] = new GeometryLocation(line0, i, closestPt[0]);
								locGeom[1] = new GeometryLocation(line1, j, closestPt[1]);
							}
							if (this.minDistance <= this.terminateDistance) return null;
						}
					}
				})(...args);
			} else if (args[2] instanceof Array && args[0] instanceof LineString && args[1] instanceof Point) {
				return ((...args) => {
					let [line, pt, locGeom] = args;
					if (line.getEnvelopeInternal().distance(pt.getEnvelopeInternal()) > this.minDistance) return null;
					var coord0 = line.getCoordinates();
					var coord = pt.getCoordinate();
					for (var i = 0; i < coord0.length - 1; i++) {
						var dist = CGAlgorithms.distancePointLine(coord, coord0[i], coord0[i + 1]);
						if (dist < this.minDistance) {
							this.minDistance = dist;
							var seg = new LineSegment(coord0[i], coord0[i + 1]);
							var segClosestPoint = seg.closestPoint(coord);
							locGeom[0] = new GeometryLocation(line, i, segClosestPoint);
							locGeom[1] = new GeometryLocation(pt, 0, coord);
						}
						if (this.minDistance <= this.terminateDistance) return null;
					}
				})(...args);
			}
		case 0:
			return ((...args) => {
				let [] = args;
				if (this.minDistanceLocation !== null) return null;
				this.minDistanceLocation = [];
				this.computeContainmentDistance();
				if (this.minDistance <= this.terminateDistance) return null;
				this.computeFacetDistance();
			})(...args);
	}
};
DistanceOp.prototype.computeMinDistancePoints = function (points0, points1, locGeom) {
	for (var i = 0; i < points0.size(); i++) {
		var pt0 = points0.get(i);
		for (var j = 0; j < points1.size(); j++) {
			var pt1 = points1.get(j);
			var dist = pt0.getCoordinate().distance(pt1.getCoordinate());
			if (dist < this.minDistance) {
				this.minDistance = dist;
				locGeom[0] = new GeometryLocation(pt0, 0, pt0.getCoordinate());
				locGeom[1] = new GeometryLocation(pt1, 0, pt1.getCoordinate());
			}
			if (this.minDistance <= this.terminateDistance) return null;
		}
	}
};
DistanceOp.prototype.distance = function () {
	if (this.geom[0] === null || this.geom[1] === null) throw new IllegalArgumentException("null geometries are not supported");
	if (this.geom[0].isEmpty() || this.geom[1].isEmpty()) return 0.0;
	this.computeMinDistance();
	return this.minDistance;
};
DistanceOp.prototype.computeMinDistanceLines = function (lines0, lines1, locGeom) {
	for (var i = 0; i < lines0.size(); i++) {
		var line0 = lines0.get(i);
		for (var j = 0; j < lines1.size(); j++) {
			var line1 = lines1.get(j);
			this.computeMinDistance(line0, line1, locGeom);
			if (this.minDistance <= this.terminateDistance) return null;
		}
	}
};
DistanceOp.distance = function (g0, g1) {
	var distOp = new DistanceOp(g0, g1);
	return distOp.distance();
};
DistanceOp.isWithinDistance = function (g0, g1, distance) {
	var distOp = new DistanceOp(g0, g1, distance);
	return distOp.distance() <= distance;
};
DistanceOp.nearestPoints = function (g0, g1) {
	var distOp = new DistanceOp(g0, g1);
	return distOp.nearestPoints();
};
DistanceOp.closestPoints = function (g0, g1) {
	var distOp = new DistanceOp(g0, g1);
	return distOp.nearestPoints();
};

