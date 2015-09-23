function ConnectedInteriorTester(geomGraph) {
	this.geometryFactory = new GeometryFactory();
	this.geomGraph = null;
	this.disconnectedRingcoord = null;
	if (arguments.length === 0) return;
	this.geomGraph = geomGraph;
}
module.exports = ConnectedInteriorTester
var Location = require('com/vividsolutions/jts/geom/Location');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var MultiPolygon = require('com/vividsolutions/jts/geom/MultiPolygon');
var MaximalEdgeRing = require('com/vividsolutions/jts/operation/overlay/MaximalEdgeRing');
var OverlayNodeFactory = require('com/vividsolutions/jts/operation/overlay/OverlayNodeFactory');
var ArrayList = require('java/util/ArrayList');
var Assert = require('com/vividsolutions/jts/util/Assert');
var PlanarGraph = require('com/vividsolutions/jts/geomgraph/PlanarGraph');
ConnectedInteriorTester.prototype.visitInteriorRing = function (ring, graph) {
	var pts = ring.getCoordinates();
	var pt0 = pts[0];
	var pt1 = ConnectedInteriorTester.findDifferentPoint(pts, pt0);
	var e = graph.findEdgeInSameDirection(pt0, pt1);
	var de = graph.findEdgeEnd(e);
	var intDe = null;
	if (de.getLabel().getLocation(0, Position.RIGHT) === Location.INTERIOR) {
		intDe = de;
	} else if (de.getSym().getLabel().getLocation(0, Position.RIGHT) === Location.INTERIOR) {
		intDe = de.getSym();
	}
	Assert.isTrue(intDe !== null, "unable to find dirEdge with Interior on RHS");
	this.visitLinkedDirectedEdges(intDe);
};
ConnectedInteriorTester.prototype.visitShellInteriors = function (g, graph) {
	if (g instanceof Polygon) {
		var p = g;
		this.visitInteriorRing(p.getExteriorRing(), graph);
	}
	if (g instanceof MultiPolygon) {
		var mp = g;
		for (var i = 0; i < mp.getNumGeometries(); i++) {
			var p = mp.getGeometryN(i);
			this.visitInteriorRing(p.getExteriorRing(), graph);
		}
	}
};
ConnectedInteriorTester.prototype.getCoordinate = function () {
	return this.disconnectedRingcoord;
};
ConnectedInteriorTester.prototype.setInteriorEdgesInResult = function (graph) {
	for (var it = graph.getEdgeEnds().iterator(); it.hasNext(); ) {
		var de = it.next();
		if (de.getLabel().getLocation(0, Position.RIGHT) === Location.INTERIOR) {
			de.setInResult(true);
		}
	}
};
ConnectedInteriorTester.prototype.visitLinkedDirectedEdges = function (start) {
	var startDe = start;
	var de = start;
	do {
		Assert.isTrue(de !== null, "found null Directed Edge");
		de.setVisited(true);
		de = de.getNext();
	} while (de !== startDe);
};
ConnectedInteriorTester.prototype.buildEdgeRings = function (dirEdges) {
	var edgeRings = new ArrayList();
	for (var it = dirEdges.iterator(); it.hasNext(); ) {
		var de = it.next();
		if (de.isInResult() && de.getEdgeRing() === null) {
			var er = new MaximalEdgeRing(de, this.geometryFactory);
			er.linkDirectedEdgesForMinimalEdgeRings();
			var minEdgeRings = er.buildMinimalRings();
			edgeRings.addAll(minEdgeRings);
		}
	}
	return edgeRings;
};
ConnectedInteriorTester.prototype.hasUnvisitedShellEdge = function (edgeRings) {
	for (var i = 0; i < edgeRings.size(); i++) {
		var er = edgeRings.get(i);
		if (er.isHole()) continue;
		var edges = er.getEdges();
		var de = edges.get(0);
		if (de.getLabel().getLocation(0, Position.RIGHT) !== Location.INTERIOR) continue;
		for (var j = 0; j < edges.size(); j++) {
			de = edges.get(j);
			if (!de.isVisited()) {
				this.disconnectedRingcoord = de.getCoordinate();
				return true;
			}
		}
	}
	return false;
};
ConnectedInteriorTester.prototype.isInteriorsConnected = function () {
	var splitEdges = new ArrayList();
	this.geomGraph.computeSplitEdges(splitEdges);
	var graph = new PlanarGraph(new OverlayNodeFactory());
	graph.addEdges(splitEdges);
	this.setInteriorEdgesInResult(graph);
	graph.linkResultDirectedEdges();
	var edgeRings = this.buildEdgeRings(graph.getEdgeEnds());
	this.visitShellInteriors(this.geomGraph.getGeometry(), graph);
	return !this.hasUnvisitedShellEdge(edgeRings);
};
ConnectedInteriorTester.findDifferentPoint = function (coord, pt) {
	for (var i = 0; i < coord.length; i++) {
		if (!coord[i].equals(pt)) return coord[i];
	}
	return null;
};

