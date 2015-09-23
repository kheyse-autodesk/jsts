function PolygonizeGraph(factory) {
	this.factory = null;
	if (arguments.length === 0) return;
	this.factory = factory;
}
module.exports = PolygonizeGraph
var PlanarGraph = require('com/vividsolutions/jts/planargraph/PlanarGraph');
var util = require('util');
util.inherits(PolygonizeGraph, PlanarGraph)
var PolygonizeDirectedEdge = require('com/vividsolutions/jts/operation/polygonize/PolygonizeDirectedEdge');
var HashSet = require('java/util/HashSet');
var Stack = require('java/util/Stack');
var Node = require('com/vividsolutions/jts/planargraph/Node');
var PolygonizeEdge = require('com/vividsolutions/jts/operation/polygonize/PolygonizeEdge');
var EdgeRing = require('com/vividsolutions/jts/operation/polygonize/EdgeRing');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var ArrayList = require('java/util/ArrayList');
var Assert = require('com/vividsolutions/jts/util/Assert');
PolygonizeGraph.prototype.findEdgeRing = function (startDE) {
	var er = new EdgeRing(this.factory);
	er.build(startDE);
	return er;
};
PolygonizeGraph.prototype.computeDepthParity = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [de] = args;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				while (true) {
					var de = null;
					if (de === null) return null;
					this.computeDepthParity(de);
				}
			})(...args);
	}
};
PolygonizeGraph.prototype.computeNextCWEdges = function () {
	for (var iNode = this.nodeIterator(); iNode.hasNext(); ) {
		var node = iNode.next();
		PolygonizeGraph.computeNextCWEdges(node);
	}
};
PolygonizeGraph.prototype.addEdge = function (line) {
	if (line.isEmpty()) {
		return null;
	}
	var linePts = CoordinateArrays.removeRepeatedPoints(line.getCoordinates());
	if (linePts.length < 2) {
		return null;
	}
	var startPt = linePts[0];
	var endPt = linePts[linePts.length - 1];
	var nStart = this.getNode(startPt);
	var nEnd = this.getNode(endPt);
	var de0 = new PolygonizeDirectedEdge(nStart, nEnd, linePts[1], true);
	var de1 = new PolygonizeDirectedEdge(nEnd, nStart, linePts[linePts.length - 2], false);
	var edge = new PolygonizeEdge(line);
	edge.setDirectedEdges(de0, de1);
	this.add(edge);
};
PolygonizeGraph.prototype.deleteCutEdges = function () {
	this.computeNextCWEdges();
	PolygonizeGraph.findLabeledEdgeRings(this.dirEdges);
	var cutLines = new ArrayList();
	for (var i = this.dirEdges.iterator(); i.hasNext(); ) {
		var de = i.next();
		if (de.isMarked()) continue;
		var sym = de.getSym();
		if (de.getLabel() === sym.getLabel()) {
			de.setMarked(true);
			sym.setMarked(true);
			var e = de.getEdge();
			cutLines.add(e.getLine());
		}
	}
	return cutLines;
};
PolygonizeGraph.prototype.getEdgeRings = function () {
	this.computeNextCWEdges();
	PolygonizeGraph.label(this.dirEdges, -1);
	var maximalRings = PolygonizeGraph.findLabeledEdgeRings(this.dirEdges);
	this.convertMaximalToMinimalEdgeRings(maximalRings);
	var edgeRingList = new ArrayList();
	for (var i = this.dirEdges.iterator(); i.hasNext(); ) {
		var de = i.next();
		if (de.isMarked()) continue;
		if (de.isInRing()) continue;
		var er = this.findEdgeRing(de);
		edgeRingList.add(er);
	}
	return edgeRingList;
};
PolygonizeGraph.prototype.getNode = function (pt) {
	var node = this.findNode(pt);
	if (node === null) {
		node = new Node(pt);
		this.add(node);
	}
	return node;
};
PolygonizeGraph.prototype.convertMaximalToMinimalEdgeRings = function (ringEdges) {
	for (var i = ringEdges.iterator(); i.hasNext(); ) {
		var de = i.next();
		var label = de.getLabel();
		var intNodes = PolygonizeGraph.findIntersectionNodes(de, label);
		if (intNodes === null) continue;
		for (var iNode = intNodes.iterator(); iNode.hasNext(); ) {
			var node = iNode.next();
			PolygonizeGraph.computeNextCCWEdges(node, label);
		}
	}
};
PolygonizeGraph.prototype.deleteDangles = function () {
	var nodesToRemove = this.findNodesOfDegree(1);
	var dangleLines = new HashSet();
	var nodeStack = new Stack();
	for (var i = nodesToRemove.iterator(); i.hasNext(); ) {
		nodeStack.push(i.next());
	}
	while (!nodeStack.isEmpty()) {
		var node = nodeStack.pop();
		PolygonizeGraph.deleteAllEdges(node);
		var nodeOutEdges = node.getOutEdges().getEdges();
		for (var i = nodeOutEdges.iterator(); i.hasNext(); ) {
			var de = i.next();
			de.setMarked(true);
			var sym = de.getSym();
			if (sym !== null) sym.setMarked(true);
			var e = de.getEdge();
			dangleLines.add(e.getLine());
			var toNode = de.getToNode();
			if (PolygonizeGraph.getDegreeNonDeleted(toNode) === 1) nodeStack.push(toNode);
		}
	}
	return dangleLines;
};
PolygonizeGraph.findLabeledEdgeRings = function (dirEdges) {
	var edgeRingStarts = new ArrayList();
	var currLabel = 1;
	for (var i = dirEdges.iterator(); i.hasNext(); ) {
		var de = i.next();
		if (de.isMarked()) continue;
		if (de.getLabel() >= 0) continue;
		edgeRingStarts.add(de);
		var edges = EdgeRing.findDirEdgesInRing(de);
		PolygonizeGraph.label(edges, currLabel);
		currLabel++;
	}
	return edgeRingStarts;
};
PolygonizeGraph.getDegreeNonDeleted = function (node) {
	var edges = node.getOutEdges().getEdges();
	var degree = 0;
	for (var i = edges.iterator(); i.hasNext(); ) {
		var de = i.next();
		if (!de.isMarked()) degree++;
	}
	return degree;
};
PolygonizeGraph.deleteAllEdges = function (node) {
	var edges = node.getOutEdges().getEdges();
	for (var i = edges.iterator(); i.hasNext(); ) {
		var de = i.next();
		de.setMarked(true);
		var sym = de.getSym();
		if (sym !== null) sym.setMarked(true);
	}
};
PolygonizeGraph.label = function (dirEdges, label) {
	for (var i = dirEdges.iterator(); i.hasNext(); ) {
		var de = i.next();
		de.setLabel(label);
	}
};
PolygonizeGraph.computeNextCWEdges = function (node) {
	var deStar = node.getOutEdges();
	var startDE = null;
	var prevDE = null;
	for (var i = deStar.getEdges().iterator(); i.hasNext(); ) {
		var outDE = i.next();
		if (outDE.isMarked()) continue;
		if (startDE === null) startDE = outDE;
		if (prevDE !== null) {
			var sym = prevDE.getSym();
			sym.setNext(outDE);
		}
		prevDE = outDE;
	}
	if (prevDE !== null) {
		var sym = prevDE.getSym();
		sym.setNext(startDE);
	}
};
PolygonizeGraph.computeNextCCWEdges = function (node, label) {
	var deStar = node.getOutEdges();
	var firstOutDE = null;
	var prevInDE = null;
	var edges = deStar.getEdges();
	for (var i = edges.size() - 1; i >= 0; i--) {
		var de = edges.get(i);
		var sym = de.getSym();
		var outDE = null;
		if (de.getLabel() === label) outDE = de;
		var inDE = null;
		if (sym.getLabel() === label) inDE = sym;
		if (outDE === null && inDE === null) continue;
		if (inDE !== null) {
			prevInDE = inDE;
		}
		if (outDE !== null) {
			if (prevInDE !== null) {
				prevInDE.setNext(outDE);
				prevInDE = null;
			}
			if (firstOutDE === null) firstOutDE = outDE;
		}
	}
	if (prevInDE !== null) {
		Assert.isTrue(firstOutDE !== null);
		prevInDE.setNext(firstOutDE);
	}
};
PolygonizeGraph.getDegree = function (node, label) {
	var edges = node.getOutEdges().getEdges();
	var degree = 0;
	for (var i = edges.iterator(); i.hasNext(); ) {
		var de = i.next();
		if (de.getLabel() === label) degree++;
	}
	return degree;
};
PolygonizeGraph.findIntersectionNodes = function (startDE, label) {
	var de = startDE;
	var intNodes = null;
	do {
		var node = de.getFromNode();
		if (PolygonizeGraph.getDegree(node, label) > 1) {
			if (intNodes === null) intNodes = new ArrayList();
			intNodes.add(node);
		}
		de = de.getNext();
		Assert.isTrue(de !== null, "found null DE in ring");
		Assert.isTrue(de === startDE || !de.isInRing(), "found DE already in ring");
	} while (de !== startDE);
	return intNodes;
};

