function GeometryGraph(...args) {
	this.parentGeom = null;
	this.lineEdgeMap = new HashMap();
	this.boundaryNodeRule = null;
	this.useBoundaryDeterminationRule = true;
	this.argIndex = null;
	this.boundaryNodes = null;
	this.hasTooFewPoints = false;
	this.invalidPoint = null;
	this.areaPtLocator = null;
	this.ptLocator = new PointLocator();
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [argIndex, parentGeom] = args;
				GeometryGraph.call(this, argIndex, parentGeom, BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE);
			})(...args);
		case 3:
			return ((...args) => {
				let [argIndex, parentGeom, boundaryNodeRule] = args;
				this.argIndex = argIndex;
				this.parentGeom = parentGeom;
				this.boundaryNodeRule = boundaryNodeRule;
				if (parentGeom !== null) {
					this.add(parentGeom);
				}
			})(...args);
	}
}
module.exports = GeometryGraph
var PlanarGraph = require('com/vividsolutions/jts/geomgraph/PlanarGraph');
var util = require('util');
util.inherits(GeometryGraph, PlanarGraph)
var PointLocator = require('com/vividsolutions/jts/algorithm/PointLocator');
var Location = require('com/vividsolutions/jts/geom/Location');
var LineString = require('com/vividsolutions/jts/geom/LineString');
var HashMap = require('java/util/HashMap');
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Point = require('com/vividsolutions/jts/geom/Point');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var MultiPoint = require('com/vividsolutions/jts/geom/MultiPoint');
var SimpleMCSweepLineIntersector = require('com/vividsolutions/jts/geomgraph/index/SimpleMCSweepLineIntersector');
var LinearRing = require('com/vividsolutions/jts/geom/LinearRing');
var BoundaryNodeRule = require('com/vividsolutions/jts/algorithm/BoundaryNodeRule');
var SegmentIntersector = require('com/vividsolutions/jts/geomgraph/index/SegmentIntersector');
var MultiPolygon = require('com/vividsolutions/jts/geom/MultiPolygon');
var Label = require('com/vividsolutions/jts/geomgraph/Label');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var Polygonal = require('com/vividsolutions/jts/geom/Polygonal');
var IndexedPointInAreaLocator = require('com/vividsolutions/jts/algorithm/locate/IndexedPointInAreaLocator');
var Assert = require('com/vividsolutions/jts/util/Assert');
var Edge = require('com/vividsolutions/jts/geomgraph/Edge');
var MultiLineString = require('com/vividsolutions/jts/geom/MultiLineString');
GeometryGraph.prototype.insertBoundaryPoint = function (argIndex, coord) {
	var n = this.nodes.addNode(coord);
	var lbl = n.getLabel();
	var boundaryCount = 1;
	var loc = Location.NONE;
	loc = lbl.getLocation(argIndex, Position.ON);
	if (loc === Location.BOUNDARY) boundaryCount++;
	var newLoc = GeometryGraph.determineBoundary(this.boundaryNodeRule, boundaryCount);
	lbl.setLocation(argIndex, newLoc);
};
GeometryGraph.prototype.computeSelfNodes = function (li, computeRingSelfNodes) {
	var si = new SegmentIntersector(li, true, false);
	var esi = this.createEdgeSetIntersector();
	if (!computeRingSelfNodes && (this.parentGeom instanceof LinearRing || this.parentGeom instanceof Polygon || this.parentGeom instanceof MultiPolygon)) {
		esi.computeIntersections(this.edges, si, false);
	} else {
		esi.computeIntersections(this.edges, si, true);
	}
	this.addSelfIntersectionNodes(this.argIndex);
	return si;
};
GeometryGraph.prototype.computeSplitEdges = function (edgelist) {
	for (var i = this.edges.iterator(); i.hasNext(); ) {
		var e = i.next();
		e.eiList.addSplitEdges(edgelist);
	}
};
GeometryGraph.prototype.computeEdgeIntersections = function (g, li, includeProper) {
	var si = new SegmentIntersector(li, includeProper, true);
	si.setBoundaryNodes(this.getBoundaryNodes(), g.getBoundaryNodes());
	var esi = this.createEdgeSetIntersector();
	esi.computeIntersections(this.edges, g.edges, si);
	return si;
};
GeometryGraph.prototype.getGeometry = function () {
	return this.parentGeom;
};
GeometryGraph.prototype.getBoundaryNodeRule = function () {
	return this.boundaryNodeRule;
};
GeometryGraph.prototype.hasTooFewPoints = function () {
	return this.hasTooFewPoints;
};
GeometryGraph.prototype.addPoint = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Point) {
				return ((...args) => {
					let [p] = args;
					var coord = p.getCoordinate();
					this.insertPoint(this.argIndex, coord, Location.INTERIOR);
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [pt] = args;
					this.insertPoint(this.argIndex, pt, Location.INTERIOR);
				})(...args);
			}
	}
};
GeometryGraph.prototype.addPolygon = function (p) {
	this.addPolygonRing(p.getExteriorRing(), Location.EXTERIOR, Location.INTERIOR);
	for (var i = 0; i < p.getNumInteriorRing(); i++) {
		var hole = p.getInteriorRingN(i);
		this.addPolygonRing(hole, Location.INTERIOR, Location.EXTERIOR);
	}
};
GeometryGraph.prototype.addEdge = function (e) {
	this.insertEdge(e);
	var coord = e.getCoordinates();
	this.insertPoint(this.argIndex, coord[0], Location.BOUNDARY);
	this.insertPoint(this.argIndex, coord[coord.length - 1], Location.BOUNDARY);
};
GeometryGraph.prototype.addLineString = function (line) {
	var coord = CoordinateArrays.removeRepeatedPoints(line.getCoordinates());
	if (coord.length < 2) {
		this.hasTooFewPoints = true;
		this.invalidPoint = coord[0];
		return null;
	}
	var e = new Edge(coord, new Label(this.argIndex, Location.INTERIOR));
	this.lineEdgeMap.put(line, e);
	this.insertEdge(e);
	Assert.isTrue(coord.length >= 2, "found LineString with single point");
	this.insertBoundaryPoint(this.argIndex, coord[0]);
	this.insertBoundaryPoint(this.argIndex, coord[coord.length - 1]);
};
GeometryGraph.prototype.getInvalidPoint = function () {
	return this.invalidPoint;
};
GeometryGraph.prototype.getBoundaryPoints = function () {
	var coll = this.getBoundaryNodes();
	var pts = [];
	var i = 0;
	for (var it = coll.iterator(); it.hasNext(); ) {
		var node = it.next();
		pts[i++] = node.getCoordinate().clone();
	}
	return pts;
};
GeometryGraph.prototype.getBoundaryNodes = function () {
	if (this.boundaryNodes === null) this.boundaryNodes = this.nodes.getBoundaryNodes(this.argIndex);
	return this.boundaryNodes;
};
GeometryGraph.prototype.addSelfIntersectionNode = function (argIndex, coord, loc) {
	if (this.isBoundaryNode(argIndex, coord)) return null;
	if (loc === Location.BOUNDARY && this.useBoundaryDeterminationRule) this.insertBoundaryPoint(argIndex, coord); else this.insertPoint(argIndex, coord, loc);
};
GeometryGraph.prototype.addPolygonRing = function (lr, cwLeft, cwRight) {
	if (lr.isEmpty()) return null;
	var coord = CoordinateArrays.removeRepeatedPoints(lr.getCoordinates());
	if (coord.length < 4) {
		this.hasTooFewPoints = true;
		this.invalidPoint = coord[0];
		return null;
	}
	var left = cwLeft;
	var right = cwRight;
	if (CGAlgorithms.isCCW(coord)) {
		left = cwRight;
		right = cwLeft;
	}
	var e = new Edge(coord, new Label(this.argIndex, Location.BOUNDARY, left, right));
	this.lineEdgeMap.put(lr, e);
	this.insertEdge(e);
	this.insertPoint(this.argIndex, coord[0], Location.BOUNDARY);
};
GeometryGraph.prototype.insertPoint = function (argIndex, coord, onLocation) {
	var n = this.nodes.addNode(coord);
	var lbl = n.getLabel();
	if (lbl === null) {
		n.label = new Label(argIndex, onLocation);
	} else lbl.setLocation(argIndex, onLocation);
};
GeometryGraph.prototype.createEdgeSetIntersector = function () {
	return new SimpleMCSweepLineIntersector();
};
GeometryGraph.prototype.addSelfIntersectionNodes = function (argIndex) {
	for (var i = this.edges.iterator(); i.hasNext(); ) {
		var e = i.next();
		var eLoc = e.getLabel().getLocation(argIndex);
		for (var eiIt = e.eiList.iterator(); eiIt.hasNext(); ) {
			var ei = eiIt.next();
			this.addSelfIntersectionNode(argIndex, ei.coord, eLoc);
		}
	}
};
GeometryGraph.prototype.add = function (g) {
	if (g.isEmpty()) return null;
	if (g instanceof MultiPolygon) this.useBoundaryDeterminationRule = false;
	if (g instanceof Polygon) this.addPolygon(g); else if (g instanceof LineString) this.addLineString(g); else if (g instanceof Point) this.addPoint(g); else if (g instanceof MultiPoint) this.addCollection(g); else if (g instanceof MultiLineString) this.addCollection(g); else if (g instanceof MultiPolygon) this.addCollection(g); else if (g instanceof GeometryCollection) this.addCollection(g); else throw new UnsupportedOperationException(g.getClass().getName());
};
GeometryGraph.prototype.addCollection = function (gc) {
	for (var i = 0; i < gc.getNumGeometries(); i++) {
		var g = gc.getGeometryN(i);
		this.add(g);
	}
};
GeometryGraph.prototype.locate = function (pt) {
	if (this.parentGeom instanceof Polygonal && this.parentGeom.getNumGeometries() > 50) {
		if (this.areaPtLocator === null) {
			this.areaPtLocator = new IndexedPointInAreaLocator(this.parentGeom);
		}
		return this.areaPtLocator.locate(pt);
	}
	return this.ptLocator.locate(pt, this.parentGeom);
};
GeometryGraph.prototype.findEdge = function (line) {
	return this.lineEdgeMap.get(line);
};
GeometryGraph.determineBoundary = function (boundaryNodeRule, boundaryCount) {
	return boundaryNodeRule.isInBoundary(boundaryCount) ? Location.BOUNDARY : Location.INTERIOR;
};

