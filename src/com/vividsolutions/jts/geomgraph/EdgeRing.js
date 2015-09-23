function EdgeRing(start, geometryFactory) {
	this.startDe = null;
	this.maxNodeDegree = -1;
	this.edges = new ArrayList();
	this.pts = new ArrayList();
	this.label = new Label(Location.NONE);
	this.ring = null;
	this.isHole = null;
	this.shell = null;
	this.holes = new ArrayList();
	this.geometryFactory = null;
	if (arguments.length === 0) return;
	this.geometryFactory = geometryFactory;
	this.computePoints(start);
	this.computeRing();
}
module.exports = EdgeRing
var Location = require('com/vividsolutions/jts/geom/Location');
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var TopologyException = require('com/vividsolutions/jts/geom/TopologyException');
var Label = require('com/vividsolutions/jts/geomgraph/Label');
var ArrayList = require('java/util/ArrayList');
var Assert = require('com/vividsolutions/jts/util/Assert');
EdgeRing.prototype.computeRing = function () {
	if (this.ring !== null) return null;
	var coord = [];
	for (var i = 0; i < this.pts.size(); i++) {
		coord[i] = this.pts.get(i);
	}
	this.ring = this.geometryFactory.createLinearRing(coord);
	this.isHole = CGAlgorithms.isCCW(this.ring.getCoordinates());
};
EdgeRing.prototype.isIsolated = function () {
	return this.label.getGeometryCount() === 1;
};
EdgeRing.prototype.computePoints = function (start) {
	this.startDe = start;
	var de = start;
	var isFirstEdge = true;
	do {
		if (de === null) throw new TopologyException("Found null DirectedEdge");
		if (de.getEdgeRing() === this) throw new TopologyException("Directed Edge visited twice during ring-building at " + de.getCoordinate());
		this.edges.add(de);
		var label = de.getLabel();
		Assert.isTrue(label.isArea());
		this.mergeLabel(label);
		this.addPoints(de.getEdge(), de.isForward(), isFirstEdge);
		isFirstEdge = false;
		this.setEdgeRing(de, this);
		de = this.getNext(de);
	} while (de !== this.startDe);
};
EdgeRing.prototype.getLinearRing = function () {
	return this.ring;
};
EdgeRing.prototype.getCoordinate = function (i) {
	return this.pts.get(i);
};
EdgeRing.prototype.computeMaxNodeDegree = function () {
	this.maxNodeDegree = 0;
	var de = this.startDe;
	do {
		var node = de.getNode();
		var degree = node.getEdges().getOutgoingDegree(this);
		if (degree > this.maxNodeDegree) this.maxNodeDegree = degree;
		de = this.getNext(de);
	} while (de !== this.startDe);
	this.maxNodeDegree *= 2;
};
EdgeRing.prototype.addPoints = function (edge, isForward, isFirstEdge) {
	var edgePts = edge.getCoordinates();
	if (isForward) {
		var startIndex = 1;
		if (isFirstEdge) startIndex = 0;
		for (var i = startIndex; i < edgePts.length; i++) {
			this.pts.add(edgePts[i]);
		}
	} else {
		var startIndex = edgePts.length - 2;
		if (isFirstEdge) startIndex = edgePts.length - 1;
		for (var i = startIndex; i >= 0; i--) {
			this.pts.add(edgePts[i]);
		}
	}
};
EdgeRing.prototype.isHole = function () {
	return this.isHole;
};
EdgeRing.prototype.setInResult = function () {
	var de = this.startDe;
	do {
		de.getEdge().setInResult(true);
		de = de.getNext();
	} while (de !== this.startDe);
};
EdgeRing.prototype.containsPoint = function (p) {
	var shell = this.getLinearRing();
	var env = shell.getEnvelopeInternal();
	if (!env.contains(p)) return false;
	if (!CGAlgorithms.isPointInRing(p, shell.getCoordinates())) return false;
	for (var i = this.holes.iterator(); i.hasNext(); ) {
		var hole = i.next();
		if (hole.containsPoint(p)) return false;
	}
	return true;
};
EdgeRing.prototype.addHole = function (ring) {
	this.holes.add(ring);
};
EdgeRing.prototype.isShell = function () {
	return this.shell === null;
};
EdgeRing.prototype.getLabel = function () {
	return this.label;
};
EdgeRing.prototype.getEdges = function () {
	return this.edges;
};
EdgeRing.prototype.getMaxNodeDegree = function () {
	if (this.maxNodeDegree < 0) this.computeMaxNodeDegree();
	return this.maxNodeDegree;
};
EdgeRing.prototype.getShell = function () {
	return this.shell;
};
EdgeRing.prototype.mergeLabel = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [deLabel, geomIndex] = args;
				var loc = deLabel.getLocation(geomIndex, Position.RIGHT);
				if (loc === Location.NONE) return null;
				if (this.label.getLocation(geomIndex) === Location.NONE) {
					this.label.setLocation(geomIndex, loc);
					return null;
				}
			})(...args);
		case 1:
			return ((...args) => {
				let [deLabel] = args;
				this.mergeLabel(deLabel, 0);
				this.mergeLabel(deLabel, 1);
			})(...args);
	}
};
EdgeRing.prototype.setShell = function (shell) {
	this.shell = shell;
	if (shell !== null) shell.addHole(this);
};
EdgeRing.prototype.toPolygon = function (geometryFactory) {
	var holeLR = [];
	for (var i = 0; i < this.holes.size(); i++) {
		holeLR[i] = this.holes.get(i).getLinearRing();
	}
	var poly = geometryFactory.createPolygon(this.getLinearRing(), holeLR);
	return poly;
};

