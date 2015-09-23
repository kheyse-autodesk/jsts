function PolygonBuilder(geometryFactory) {
	this.geometryFactory = null;
	this.shellList = new ArrayList();
	if (arguments.length === 0) return;
	this.geometryFactory = geometryFactory;
}
module.exports = PolygonBuilder
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var TopologyException = require('com/vividsolutions/jts/geom/TopologyException');
var MaximalEdgeRing = require('com/vividsolutions/jts/operation/overlay/MaximalEdgeRing');
var ArrayList = require('java/util/ArrayList');
var Assert = require('com/vividsolutions/jts/util/Assert');
var PlanarGraph = require('com/vividsolutions/jts/geomgraph/PlanarGraph');
PolygonBuilder.prototype.sortShellsAndHoles = function (edgeRings, shellList, freeHoleList) {
	for (var it = edgeRings.iterator(); it.hasNext(); ) {
		var er = it.next();
		if (er.isHole()) {
			freeHoleList.add(er);
		} else {
			shellList.add(er);
		}
	}
};
PolygonBuilder.prototype.computePolygons = function (shellList) {
	var resultPolyList = new ArrayList();
	for (var it = shellList.iterator(); it.hasNext(); ) {
		var er = it.next();
		var poly = er.toPolygon(this.geometryFactory);
		resultPolyList.add(poly);
	}
	return resultPolyList;
};
PolygonBuilder.prototype.placeFreeHoles = function (shellList, freeHoleList) {
	for (var it = freeHoleList.iterator(); it.hasNext(); ) {
		var hole = it.next();
		if (hole.getShell() === null) {
			var shell = this.findEdgeRingContaining(hole, shellList);
			if (shell === null) throw new TopologyException("unable to assign hole to a shell", hole.getCoordinate(0));
			hole.setShell(shell);
		}
	}
};
PolygonBuilder.prototype.buildMinimalEdgeRings = function (maxEdgeRings, shellList, freeHoleList) {
	var edgeRings = new ArrayList();
	for (var it = maxEdgeRings.iterator(); it.hasNext(); ) {
		var er = it.next();
		if (er.getMaxNodeDegree() > 2) {
			er.linkDirectedEdgesForMinimalEdgeRings();
			var minEdgeRings = er.buildMinimalRings();
			var shell = this.findShell(minEdgeRings);
			if (shell !== null) {
				this.placePolygonHoles(shell, minEdgeRings);
				shellList.add(shell);
			} else {
				freeHoleList.addAll(minEdgeRings);
			}
		} else {
			edgeRings.add(er);
		}
	}
	return edgeRings;
};
PolygonBuilder.prototype.containsPoint = function (p) {
	for (var it = this.shellList.iterator(); it.hasNext(); ) {
		var er = it.next();
		if (er.containsPoint(p)) return true;
	}
	return false;
};
PolygonBuilder.prototype.buildMaximalEdgeRings = function (dirEdges) {
	var maxEdgeRings = new ArrayList();
	for (var it = dirEdges.iterator(); it.hasNext(); ) {
		var de = it.next();
		if (de.isInResult() && de.getLabel().isArea()) {
			if (de.getEdgeRing() === null) {
				var er = new MaximalEdgeRing(de, this.geometryFactory);
				maxEdgeRings.add(er);
				er.setInResult();
			}
		}
	}
	return maxEdgeRings;
};
PolygonBuilder.prototype.placePolygonHoles = function (shell, minEdgeRings) {
	for (var it = minEdgeRings.iterator(); it.hasNext(); ) {
		var er = it.next();
		if (er.isHole()) {
			er.setShell(shell);
		}
	}
};
PolygonBuilder.prototype.getPolygons = function () {
	var resultPolyList = this.computePolygons(this.shellList);
	return resultPolyList;
};
PolygonBuilder.prototype.findEdgeRingContaining = function (testEr, shellList) {
	var testRing = testEr.getLinearRing();
	var testEnv = testRing.getEnvelopeInternal();
	var testPt = testRing.getCoordinateN(0);
	var minShell = null;
	var minEnv = null;
	for (var it = shellList.iterator(); it.hasNext(); ) {
		var tryShell = it.next();
		var tryRing = tryShell.getLinearRing();
		var tryEnv = tryRing.getEnvelopeInternal();
		if (minShell !== null) minEnv = minShell.getLinearRing().getEnvelopeInternal();
		var isContained = false;
		if (tryEnv.contains(testEnv) && CGAlgorithms.isPointInRing(testPt, tryRing.getCoordinates())) isContained = true;
		if (isContained) {
			if (minShell === null || minEnv.contains(tryEnv)) {
				minShell = tryShell;
			}
		}
	}
	return minShell;
};
PolygonBuilder.prototype.findShell = function (minEdgeRings) {
	var shellCount = 0;
	var shell = null;
	for (var it = minEdgeRings.iterator(); it.hasNext(); ) {
		var er = it.next();
		if (!er.isHole()) {
			shell = er;
			shellCount++;
		}
	}
	Assert.isTrue(shellCount <= 1, "found two shells in MinimalEdgeRing list");
	return shell;
};
PolygonBuilder.prototype.add = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [dirEdges, nodes] = args;
				PlanarGraph.linkResultDirectedEdges(nodes);
				var maxEdgeRings = this.buildMaximalEdgeRings(dirEdges);
				var freeHoleList = new ArrayList();
				var edgeRings = this.buildMinimalEdgeRings(maxEdgeRings, this.shellList, freeHoleList);
				this.sortShellsAndHoles(edgeRings, this.shellList, freeHoleList);
				this.placeFreeHoles(this.shellList, freeHoleList);
			})(...args);
		case 1:
			return ((...args) => {
				let [graph] = args;
				this.add(graph.getEdgeEnds(), graph.getNodes());
			})(...args);
	}
};

