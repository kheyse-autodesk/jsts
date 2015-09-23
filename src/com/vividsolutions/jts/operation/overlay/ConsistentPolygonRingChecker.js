function ConsistentPolygonRingChecker(graph) {
	this.graph = null;
	this.SCANNING_FOR_INCOMING = 1;
	this.LINKING_TO_OUTGOING = 2;
	if (arguments.length === 0) return;
	this.graph = graph;
}
module.exports = ConsistentPolygonRingChecker
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var TopologyException = require('com/vividsolutions/jts/geom/TopologyException');
var ArrayList = require('java/util/ArrayList');
var OverlayOp = require('com/vividsolutions/jts/operation/overlay/OverlayOp');
ConsistentPolygonRingChecker.prototype.testLinkResultDirectedEdges = function (deStar, opCode) {
	var ringEdges = this.getPotentialResultAreaEdges(deStar, opCode);
	var firstOut = null;
	var incoming = null;
	var state = this.SCANNING_FOR_INCOMING;
	for (var i = 0; i < ringEdges.size(); i++) {
		var nextOut = ringEdges.get(i);
		var nextIn = nextOut.getSym();
		if (!nextOut.getLabel().isArea()) continue;
		if (firstOut === null && this.isPotentialResultAreaEdge(nextOut, opCode)) firstOut = nextOut;
		switch (state) {
			case this.SCANNING_FOR_INCOMING:
				if (!this.isPotentialResultAreaEdge(nextIn, opCode)) continue;
				incoming = nextIn;
				state = this.LINKING_TO_OUTGOING;
				break;
			case this.LINKING_TO_OUTGOING:
				if (!this.isPotentialResultAreaEdge(nextOut, opCode)) continue;
				state = this.SCANNING_FOR_INCOMING;
				break;
		}
	}
	if (state === this.LINKING_TO_OUTGOING) {
		if (firstOut === null) throw new TopologyException("no outgoing dirEdge found", deStar.getCoordinate());
	}
};
ConsistentPolygonRingChecker.prototype.getPotentialResultAreaEdges = function (deStar, opCode) {
	var resultAreaEdgeList = new ArrayList();
	for (var it = deStar.iterator(); it.hasNext(); ) {
		var de = it.next();
		if (this.isPotentialResultAreaEdge(de, opCode) || this.isPotentialResultAreaEdge(de.getSym(), opCode)) resultAreaEdgeList.add(de);
	}
	return resultAreaEdgeList;
};
ConsistentPolygonRingChecker.prototype.checkAll = function () {
	this.check(OverlayOp.INTERSECTION);
	this.check(OverlayOp.DIFFERENCE);
	this.check(OverlayOp.UNION);
	this.check(OverlayOp.SYMDIFFERENCE);
};
ConsistentPolygonRingChecker.prototype.check = function (opCode) {
	for (var nodeit = this.graph.getNodeIterator(); nodeit.hasNext(); ) {
		var node = nodeit.next();
		this.testLinkResultDirectedEdges(node.getEdges(), opCode);
	}
};
ConsistentPolygonRingChecker.prototype.isPotentialResultAreaEdge = function (de, opCode) {
	var label = de.getLabel();
	if (label.isArea() && !de.isInteriorAreaEdge() && OverlayOp.isResultOfOp(label.getLocation(0, Position.RIGHT), label.getLocation(1, Position.RIGHT), opCode)) {
		return true;
	}
	return false;
};

