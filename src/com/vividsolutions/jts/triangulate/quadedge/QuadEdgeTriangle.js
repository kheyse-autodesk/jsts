function QuadEdgeTriangle(edge) {
	this.edge = null;
	this.data = null;
	if (arguments.length === 0) return;
	this.edge = edge.clone();
	for (var i = 0; i < 3; i++) {
		edge[i].setData(this);
	}
}
module.exports = QuadEdgeTriangle
var QuadEdge = require('com/vividsolutions/jts/triangulate/quadedge/QuadEdge');
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Vertex = require('com/vividsolutions/jts/triangulate/quadedge/Vertex');
var ArrayList = require('java/util/ArrayList');
QuadEdgeTriangle.prototype.getCoordinates = function () {
	var pts = [];
	for (var i = 0; i < 3; i++) {
		pts[i] = this.edge[i].orig().getCoordinate();
	}
	pts[3] = new Coordinate(pts[0]);
	return pts;
};
QuadEdgeTriangle.prototype.getVertex = function (i) {
	return this.edge[i].orig();
};
QuadEdgeTriangle.prototype.isBorder = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [i] = args;
				return this.getAdjacentTriangleAcrossEdge(i) === null;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				for (var i = 0; i < 3; i++) {
					if (this.getAdjacentTriangleAcrossEdge(i) === null) return true;
				}
				return false;
			})(...args);
	}
};
QuadEdgeTriangle.prototype.getEdgeIndex = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof QuadEdge) {
				return ((...args) => {
					let [e] = args;
					for (var i = 0; i < 3; i++) {
						if (this.edge[i] === e) return i;
					}
					return -1;
				})(...args);
			} else if (args[0] instanceof Vertex) {
				return ((...args) => {
					let [v] = args;
					for (var i = 0; i < 3; i++) {
						if (this.edge[i].orig() === v) return i;
					}
					return -1;
				})(...args);
			}
	}
};
QuadEdgeTriangle.prototype.getGeometry = function (fact) {
	var ring = fact.createLinearRing(this.getCoordinates());
	var tri = fact.createPolygon(ring, null);
	return tri;
};
QuadEdgeTriangle.prototype.getCoordinate = function (i) {
	return this.edge[i].orig().getCoordinate();
};
QuadEdgeTriangle.prototype.getTrianglesAdjacentToVertex = function (vertexIndex) {
	var adjTris = new ArrayList();
	var start = this.getEdge(vertexIndex);
	var qe = start;
	do {
		var adjTri = qe.getData();
		if (adjTri !== null) {
			adjTris.add(adjTri);
		}
		qe = qe.oNext();
	} while (qe !== start);
	return adjTris;
};
QuadEdgeTriangle.prototype.getNeighbours = function () {
	var neigh = [];
	for (var i = 0; i < 3; i++) {
		neigh[i] = this.getEdge(i).sym().getData();
	}
	return neigh;
};
QuadEdgeTriangle.prototype.getAdjacentTriangleAcrossEdge = function (edgeIndex) {
	return this.getEdge(edgeIndex).sym().getData();
};
QuadEdgeTriangle.prototype.setData = function (data) {
	this.data = data;
};
QuadEdgeTriangle.prototype.getData = function () {
	return this.data;
};
QuadEdgeTriangle.prototype.getAdjacentTriangleEdgeIndex = function (i) {
	return this.getAdjacentTriangleAcrossEdge(i).getEdgeIndex(this.getEdge(i).sym());
};
QuadEdgeTriangle.prototype.getVertices = function () {
	var vert = [];
	for (var i = 0; i < 3; i++) {
		vert[i] = this.getVertex(i);
	}
	return vert;
};
QuadEdgeTriangle.prototype.getEdges = function () {
	return this.edge;
};
QuadEdgeTriangle.prototype.getEdge = function (i) {
	return this.edge[i];
};
QuadEdgeTriangle.prototype.toString = function () {
	return this.getGeometry(new GeometryFactory()).toString();
};
QuadEdgeTriangle.prototype.isLive = function () {
	return this.edge !== null;
};
QuadEdgeTriangle.prototype.kill = function () {
	this.edge = null;
};
QuadEdgeTriangle.prototype.contains = function (pt) {
	var ring = this.getCoordinates();
	return CGAlgorithms.isPointInRing(pt, ring);
};
QuadEdgeTriangle.prototype.getEdgeSegment = function (i, seg) {
	seg.p0 = this.edge[i].orig().getCoordinate();
	var nexti = (i + 1) % 3;
	seg.p1 = this.edge[nexti].orig().getCoordinate();
};
QuadEdgeTriangle.toPolygon = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Array) {
				return ((...args) => {
					let [v] = args;
					var ringPts = [v[0].getCoordinate(), v[1].getCoordinate(), v[2].getCoordinate(), v[0].getCoordinate()];
					var fact = new GeometryFactory();
					var ring = fact.createLinearRing(ringPts);
					var tri = fact.createPolygon(ring, null);
					return tri;
				})(...args);
			} else if (args[0] instanceof Array) {
				return ((...args) => {
					let [e] = args;
					var ringPts = [e[0].orig().getCoordinate(), e[1].orig().getCoordinate(), e[2].orig().getCoordinate(), e[0].orig().getCoordinate()];
					var fact = new GeometryFactory();
					var ring = fact.createLinearRing(ringPts);
					var tri = fact.createPolygon(ring, null);
					return tri;
				})(...args);
			}
	}
};
QuadEdgeTriangle.nextIndex = function (index) {
	return index = (index + 1) % 3;
};
QuadEdgeTriangle.contains = function (...args) {
	switch (args.length) {
		case 2:
			if (args[0] instanceof Array && args[1] instanceof Coordinate) {
				return ((...args) => {
					let [tri, pt] = args;
					var ring = [tri[0].getCoordinate(), tri[1].getCoordinate(), tri[2].getCoordinate(), tri[0].getCoordinate()];
					return CGAlgorithms.isPointInRing(pt, ring);
				})(...args);
			} else if (args[0] instanceof Array && args[1] instanceof Coordinate) {
				return ((...args) => {
					let [tri, pt] = args;
					var ring = [tri[0].orig().getCoordinate(), tri[1].orig().getCoordinate(), tri[2].orig().getCoordinate(), tri[0].orig().getCoordinate()];
					return CGAlgorithms.isPointInRing(pt, ring);
				})(...args);
			}
	}
};
QuadEdgeTriangle.createOn = function (subdiv) {
	var visitor = new QuadEdgeTriangleBuilderVisitor();
	subdiv.visitTriangles(visitor, false);
	return visitor.getTriangles();
};
function QuadEdgeTriangleBuilderVisitor() {
	this.triangles = new ArrayList();
	if (arguments.length === 0) return;
}
QuadEdgeTriangleBuilderVisitor.prototype.visit = function (edges) {
	this.triangles.add(new QuadEdgeTriangle(edges));
};
QuadEdgeTriangleBuilderVisitor.prototype.getTriangles = function () {
	return this.triangles;
};
QuadEdgeTriangle.QuadEdgeTriangleBuilderVisitor = QuadEdgeTriangleBuilderVisitor;

