function QuadEdgeSubdivision(env, tolerance) {
	this.visitedKey = 0;
	this.quadEdges = new ArrayList();
	this.startingEdge = null;
	this.tolerance = null;
	this.edgeCoincidenceTolerance = null;
	this.frameVertex = [];
	this.frameEnv = null;
	this.locator = null;
	this.seg = new LineSegment();
	this.triEdges = [];
	if (arguments.length === 0) return;
	this.tolerance = tolerance;
	this.edgeCoincidenceTolerance = tolerance / QuadEdgeSubdivision.EDGE_COINCIDENCE_TOL_FACTOR;
	this.createFrame(env);
	this.startingEdge = this.initSubdiv();
	this.locator = new LastFoundQuadEdgeLocator(this);
}
module.exports = QuadEdgeSubdivision
var QuadEdge = require('com/vividsolutions/jts/triangulate/quadedge/QuadEdge');
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var HashSet = require('java/util/HashSet');
var WKTWriter = require('com/vividsolutions/jts/io/WKTWriter');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Stack = require('java/util/Stack');
var LastFoundQuadEdgeLocator = require('com/vividsolutions/jts/triangulate/quadedge/LastFoundQuadEdgeLocator');
var LocateFailureException = require('com/vividsolutions/jts/triangulate/quadedge/LocateFailureException');
var Vertex = require('com/vividsolutions/jts/triangulate/quadedge/Vertex');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
var ArrayList = require('java/util/ArrayList');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
var Triangle = require('com/vividsolutions/jts/geom/Triangle');
QuadEdgeSubdivision.prototype.getTriangleVertices = function (includeFrame) {
	var visitor = new TriangleVertexListVisitor();
	this.visitTriangles(visitor, includeFrame);
	return visitor.getTriangleVertices();
};
QuadEdgeSubdivision.prototype.isFrameVertex = function (v) {
	if (v.equals(this.frameVertex[0])) return true;
	if (v.equals(this.frameVertex[1])) return true;
	if (v.equals(this.frameVertex[2])) return true;
	return false;
};
QuadEdgeSubdivision.prototype.isVertexOfEdge = function (e, v) {
	if (v.equals(e.orig(), this.tolerance) || v.equals(e.dest(), this.tolerance)) {
		return true;
	}
	return false;
};
QuadEdgeSubdivision.prototype.connect = function (a, b) {
	var q = QuadEdge.connect(a, b);
	this.quadEdges.add(q);
	return q;
};
QuadEdgeSubdivision.prototype.getVoronoiCellPolygon = function (qe, geomFact) {
	var cellPts = new ArrayList();
	var startQE = qe;
	do {
		var cc = qe.rot().orig().getCoordinate();
		cellPts.add(cc);
		qe = qe.oPrev();
	} while (qe !== startQE);
	var coordList = new CoordinateList();
	coordList.addAll(cellPts, false);
	coordList.closeRing();
	if (coordList.size() < 4) {
		System.out.println(coordList);
		coordList.add(coordList.get(coordList.size() - 1), true);
	}
	var pts = coordList.toCoordinateArray();
	var cellPoly = geomFact.createPolygon(geomFact.createLinearRing(pts), null);
	var v = startQE.orig();
	cellPoly.setUserData(v.getCoordinate());
	return cellPoly;
};
QuadEdgeSubdivision.prototype.setLocator = function (locator) {
	this.locator = locator;
};
QuadEdgeSubdivision.prototype.initSubdiv = function () {
	var ea = this.makeEdge(this.frameVertex[0], this.frameVertex[1]);
	var eb = this.makeEdge(this.frameVertex[1], this.frameVertex[2]);
	QuadEdge.splice(ea.sym(), eb);
	var ec = this.makeEdge(this.frameVertex[2], this.frameVertex[0]);
	QuadEdge.splice(eb.sym(), ec);
	QuadEdge.splice(ec.sym(), ea);
	return ea;
};
QuadEdgeSubdivision.prototype.isFrameBorderEdge = function (e) {
	var leftTri = [];
	QuadEdgeSubdivision.getTriangleEdges(e, leftTri);
	var rightTri = [];
	QuadEdgeSubdivision.getTriangleEdges(e.sym(), rightTri);
	var vLeftTriOther = e.lNext().dest();
	if (this.isFrameVertex(vLeftTriOther)) return true;
	var vRightTriOther = e.sym().lNext().dest();
	if (this.isFrameVertex(vRightTriOther)) return true;
	return false;
};
QuadEdgeSubdivision.prototype.makeEdge = function (o, d) {
	var q = QuadEdge.makeEdge(o, d);
	this.quadEdges.add(q);
	return q;
};
QuadEdgeSubdivision.prototype.visitTriangles = function (triVisitor, includeFrame) {
	this.visitedKey++;
	var edgeStack = new Stack();
	edgeStack.push(this.startingEdge);
	var visitedEdges = new HashSet();
	while (!edgeStack.empty()) {
		var edge = edgeStack.pop();
		if (!visitedEdges.contains(edge)) {
			var triEdges = this.fetchTriangleToVisit(edge, edgeStack, includeFrame, visitedEdges);
			if (triEdges !== null) triVisitor.visit(triEdges);
		}
	}
};
QuadEdgeSubdivision.prototype.isFrameEdge = function (e) {
	if (this.isFrameVertex(e.orig()) || this.isFrameVertex(e.dest())) return true;
	return false;
};
QuadEdgeSubdivision.prototype.isOnEdge = function (e, p) {
	this.seg.setCoordinates(e.orig().getCoordinate(), e.dest().getCoordinate());
	var dist = this.seg.distance(p);
	return dist < this.edgeCoincidenceTolerance;
};
QuadEdgeSubdivision.prototype.getEnvelope = function () {
	return new Envelope(this.frameEnv);
};
QuadEdgeSubdivision.prototype.createFrame = function (env) {
	var deltaX = env.getWidth();
	var deltaY = env.getHeight();
	var offset = 0.0;
	if (deltaX > deltaY) {
		offset = deltaX * 10.0;
	} else {
		offset = deltaY * 10.0;
	}
	this.frameVertex[0] = new Vertex((env.getMaxX() + env.getMinX()) / 2.0, env.getMaxY() + offset);
	this.frameVertex[1] = new Vertex(env.getMinX() - offset, env.getMinY() - offset);
	this.frameVertex[2] = new Vertex(env.getMaxX() + offset, env.getMinY() - offset);
	this.frameEnv = new Envelope(this.frameVertex[0].getCoordinate(), this.frameVertex[1].getCoordinate());
	this.frameEnv.expandToInclude(this.frameVertex[2].getCoordinate());
};
QuadEdgeSubdivision.prototype.getTriangleCoordinates = function (includeFrame) {
	var visitor = new TriangleCoordinatesVisitor();
	this.visitTriangles(visitor, includeFrame);
	return visitor.getTriangles();
};
QuadEdgeSubdivision.prototype.getVertices = function (includeFrame) {
	var vertices = new HashSet();
	for (var i = this.quadEdges.iterator(); i.hasNext(); ) {
		var qe = i.next();
		var v = qe.orig();
		if (includeFrame || !this.isFrameVertex(v)) vertices.add(v);
		var vd = qe.dest();
		if (includeFrame || !this.isFrameVertex(vd)) vertices.add(vd);
	}
	return vertices;
};
QuadEdgeSubdivision.prototype.fetchTriangleToVisit = function (edge, edgeStack, includeFrame, visitedEdges) {
	var curr = edge;
	var edgeCount = 0;
	var isFrame = false;
	do {
		this.triEdges[edgeCount] = curr;
		if (this.isFrameEdge(curr)) isFrame = true;
		var sym = curr.sym();
		if (!visitedEdges.contains(sym)) edgeStack.push(sym);
		visitedEdges.add(curr);
		edgeCount++;
		curr = curr.lNext();
	} while (curr !== edge);
	if (isFrame && !includeFrame) return null;
	return this.triEdges;
};
QuadEdgeSubdivision.prototype.getEdges = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [geomFact] = args;
				var quadEdges = this.getPrimaryEdges(false);
				var edges = [];
				var i = 0;
				for (var it = quadEdges.iterator(); it.hasNext(); ) {
					var qe = it.next();
					edges[i++] = geomFact.createLineString([qe.orig().getCoordinate(), qe.dest().getCoordinate()]);
				}
				return geomFact.createMultiLineString(edges);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				return this.quadEdges;
			})(...args);
	}
};
QuadEdgeSubdivision.prototype.getVertexUniqueEdges = function (includeFrame) {
	var edges = new ArrayList();
	var visitedVertices = new HashSet();
	for (var i = this.quadEdges.iterator(); i.hasNext(); ) {
		var qe = i.next();
		var v = qe.orig();
		if (!visitedVertices.contains(v)) {
			visitedVertices.add(v);
			if (includeFrame || !this.isFrameVertex(v)) {
				edges.add(qe);
			}
		}
		var qd = qe.sym();
		var vd = qd.orig();
		if (!visitedVertices.contains(vd)) {
			visitedVertices.add(vd);
			if (includeFrame || !this.isFrameVertex(vd)) {
				edges.add(qd);
			}
		}
	}
	return edges;
};
QuadEdgeSubdivision.prototype.getTriangleEdges = function (includeFrame) {
	var visitor = new TriangleEdgesListVisitor();
	this.visitTriangles(visitor, includeFrame);
	return visitor.getTriangleEdges();
};
QuadEdgeSubdivision.prototype.getPrimaryEdges = function (includeFrame) {
	this.visitedKey++;
	var edges = new ArrayList();
	var edgeStack = new Stack();
	edgeStack.push(this.startingEdge);
	var visitedEdges = new HashSet();
	while (!edgeStack.empty()) {
		var edge = edgeStack.pop();
		if (!visitedEdges.contains(edge)) {
			var priQE = edge.getPrimary();
			if (includeFrame || !this.isFrameEdge(priQE)) edges.add(priQE);
			edgeStack.push(edge.oNext());
			edgeStack.push(edge.sym().oNext());
			visitedEdges.add(edge);
			visitedEdges.add(edge.sym());
		}
	}
	return edges;
};
QuadEdgeSubdivision.prototype.delete = function (e) {
	QuadEdge.splice(e, e.oPrev());
	QuadEdge.splice(e.sym(), e.sym().oPrev());
	var eSym = e.sym();
	var eRot = e.rot();
	var eRotSym = e.rot().sym();
	this.quadEdges.remove(e);
	this.quadEdges.remove(eSym);
	this.quadEdges.remove(eRot);
	this.quadEdges.remove(eRotSym);
	e.delete();
	eSym.delete();
	eRot.delete();
	eRotSym.delete();
};
QuadEdgeSubdivision.prototype.locateFromEdge = function (v, startEdge) {
	var iter = 0;
	var maxIter = this.quadEdges.size();
	var e = startEdge;
	while (true) {
		iter++;
		if (iter > maxIter) {
			throw new LocateFailureException(e.toLineSegment());
		}
		if (v.equals(e.orig()) || v.equals(e.dest())) {
			break;
		} else if (v.rightOf(e)) {
			e = e.sym();
		} else if (!v.rightOf(e.oNext())) {
			e = e.oNext();
		} else if (!v.rightOf(e.dPrev())) {
			e = e.dPrev();
		} else {
			break;
		}
	}
	return e;
};
QuadEdgeSubdivision.prototype.getTolerance = function () {
	return this.tolerance;
};
QuadEdgeSubdivision.prototype.getVoronoiCellPolygons = function (geomFact) {
	this.visitTriangles(new TriangleCircumcentreVisitor(), true);
	var cells = new ArrayList();
	var edges = this.getVertexUniqueEdges(false);
	for (var i = edges.iterator(); i.hasNext(); ) {
		var qe = i.next();
		cells.add(this.getVoronoiCellPolygon(qe, geomFact));
	}
	return cells;
};
QuadEdgeSubdivision.prototype.getVoronoiDiagram = function (geomFact) {
	var vorCells = this.getVoronoiCellPolygons(geomFact);
	return geomFact.createGeometryCollection(GeometryFactory.toGeometryArray(vorCells));
};
QuadEdgeSubdivision.prototype.getTriangles = function (geomFact) {
	var triPtsList = this.getTriangleCoordinates(false);
	var tris = [];
	var i = 0;
	for (var it = triPtsList.iterator(); it.hasNext(); ) {
		var triPt = it.next();
		tris[i++] = geomFact.createPolygon(geomFact.createLinearRing(triPt), null);
	}
	return geomFact.createGeometryCollection(tris);
};
QuadEdgeSubdivision.prototype.insertSite = function (v) {
	var e = this.locate(v);
	if (v.equals(e.orig(), this.tolerance) || v.equals(e.dest(), this.tolerance)) {
		return e;
	}
	var base = this.makeEdge(e.orig(), v);
	QuadEdge.splice(base, e);
	var startEdge = base;
	do {
		base = this.connect(e, base.sym());
		e = base.oPrev();
	} while (e.lNext() !== startEdge);
	return startEdge;
};
QuadEdgeSubdivision.prototype.locate = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [p0, p1] = args;
				var e = this.locator.locate(new Vertex(p0));
				if (e === null) return null;
				var base = e;
				if (e.dest().getCoordinate().equals2D(p0)) base = e.sym();
				var locEdge = base;
				do {
					if (locEdge.dest().getCoordinate().equals2D(p1)) return locEdge;
					locEdge = locEdge.oNext();
				} while (locEdge !== base);
				return null;
			})(...args);
		case 1:
			if (args[0] instanceof Vertex) {
				return ((...args) => {
					let [v] = args;
					return this.locator.locate(v);
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [p] = args;
					return this.locator.locate(new Vertex(p));
				})(...args);
			}
	}
};
QuadEdgeSubdivision.getTriangleEdges = function (startQE, triEdge) {
	triEdge[0] = startQE;
	triEdge[1] = triEdge[0].lNext();
	triEdge[2] = triEdge[1].lNext();
	if (triEdge[2].lNext() !== triEdge[0]) throw new IllegalArgumentException("Edges do not form a triangle");
};
function TriangleCircumcentreVisitor() {
	if (arguments.length === 0) return;
}
TriangleCircumcentreVisitor.prototype.visit = function (triEdges) {
	var a = triEdges[0].orig().getCoordinate();
	var b = triEdges[1].orig().getCoordinate();
	var c = triEdges[2].orig().getCoordinate();
	var cc = Triangle.circumcentre(a, b, c);
	var ccVertex = new Vertex(cc);
	for (var i = 0; i < 3; i++) {
		triEdges[i].rot().setOrig(ccVertex);
	}
};
QuadEdgeSubdivision.TriangleCircumcentreVisitor = TriangleCircumcentreVisitor;
function TriangleEdgesListVisitor() {}
TriangleEdgesListVisitor.prototype.getTriangleEdges = function () {
	return this.triList;
};
TriangleEdgesListVisitor.prototype.visit = function (triEdges) {
	this.triList.add(triEdges.clone());
};
QuadEdgeSubdivision.TriangleEdgesListVisitor = TriangleEdgesListVisitor;
function TriangleVertexListVisitor() {}
TriangleVertexListVisitor.prototype.visit = function (triEdges) {
	this.triList.add([triEdges[0].orig(), triEdges[1].orig(), triEdges[2].orig()]);
};
TriangleVertexListVisitor.prototype.getTriangleVertices = function () {
	return this.triList;
};
QuadEdgeSubdivision.TriangleVertexListVisitor = TriangleVertexListVisitor;
function TriangleCoordinatesVisitor() {
	this.coordList = new CoordinateList();
	this.triCoords = new ArrayList();
	if (arguments.length === 0) return;
}
TriangleCoordinatesVisitor.prototype.checkTriangleSize = function (pts) {
	var loc = "";
	if (pts.length >= 2) loc = WKTWriter.toLineString(pts[0], pts[1]); else {
		if (pts.length >= 1) loc = WKTWriter.toPoint(pts[0]);
	}
};
TriangleCoordinatesVisitor.prototype.visit = function (triEdges) {
	this.coordList.clear();
	for (var i = 0; i < 3; i++) {
		var v = triEdges[i].orig();
		this.coordList.add(v.getCoordinate());
	}
	if (this.coordList.size() > 0) {
		this.coordList.closeRing();
		var pts = this.coordList.toCoordinateArray();
		if (pts.length !== 4) {
			return null;
		}
		this.triCoords.add(pts);
	}
};
TriangleCoordinatesVisitor.prototype.getTriangles = function () {
	return this.triCoords;
};
QuadEdgeSubdivision.TriangleCoordinatesVisitor = TriangleCoordinatesVisitor;
QuadEdgeSubdivision.EDGE_COINCIDENCE_TOL_FACTOR = 1000;

