function EdgeRing(factory) {
	this.factory = null;
	this.deList = new ArrayList();
	this.lowestEdge = null;
	this.ring = null;
	this.ringPts = null;
	this.holes = null;
	this.shell = null;
	this.isHole = null;
	this.isProcessed = false;
	this.isIncludedSet = false;
	this.isIncluded = false;
	if (arguments.length === 0) return;
	this.factory = factory;
}
module.exports = EdgeRing
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var WKTWriter = require('com/vividsolutions/jts/io/WKTWriter');
var CoordinateArraySequence = require('com/vividsolutions/jts/geom/impl/CoordinateArraySequence');
var LinearRing = require('com/vividsolutions/jts/geom/LinearRing');
var Exception = require('java/lang/Exception');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var ArrayList = require('java/util/ArrayList');
var Assert = require('com/vividsolutions/jts/util/Assert');
EdgeRing.prototype.isIncluded = function () {
	return this.isIncluded;
};
EdgeRing.prototype.getCoordinates = function () {
	if (this.ringPts === null) {
		var coordList = new CoordinateList();
		for (var i = this.deList.iterator(); i.hasNext(); ) {
			var de = i.next();
			var edge = de.getEdge();
			EdgeRing.addEdge(edge.getLine().getCoordinates(), de.getEdgeDirection(), coordList);
		}
		this.ringPts = coordList.toCoordinateArray();
	}
	return this.ringPts;
};
EdgeRing.prototype.isIncludedSet = function () {
	return this.isIncludedSet;
};
EdgeRing.prototype.isValid = function () {
	this.getCoordinates();
	if (this.ringPts.length <= 3) return false;
	this.getRing();
	return this.ring.isValid();
};
EdgeRing.prototype.build = function (startDE) {
	var de = startDE;
	do {
		this.add(de);
		de.setRing(this);
		de = de.getNext();
		Assert.isTrue(de !== null, "found null DE in ring");
		Assert.isTrue(de === startDE || !de.isInRing(), "found DE already in ring");
	} while (de !== startDE);
};
EdgeRing.prototype.isOuterHole = function () {
	if (!this.isHole) return false;
	return !this.hasShell();
};
EdgeRing.prototype.getPolygon = function () {
	var holeLR = null;
	if (this.holes !== null) {
		holeLR = [];
		for (var i = 0; i < this.holes.size(); i++) {
			holeLR[i] = this.holes.get(i);
		}
	}
	var poly = this.factory.createPolygon(this.ring, holeLR);
	return poly;
};
EdgeRing.prototype.isHole = function () {
	return this.isHole;
};
EdgeRing.prototype.isProcessed = function () {
	return this.isProcessed;
};
EdgeRing.prototype.addHole = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof LinearRing) {
				return ((...args) => {
					let [hole] = args;
					if (this.holes === null) this.holes = new ArrayList();
					this.holes.add(hole);
				})(...args);
			} else if (args[0] instanceof EdgeRing) {
				return ((...args) => {
					let [holeER] = args;
					holeER.setShell(this);
					var hole = holeER.getRing();
					if (this.holes === null) this.holes = new ArrayList();
					this.holes.add(hole);
				})(...args);
			}
	}
};
EdgeRing.prototype.setIncluded = function (isIncluded) {
	this.isIncluded = isIncluded;
	this.isIncludedSet = true;
};
EdgeRing.prototype.getOuterHole = function () {
	if (this.isHole()) return null;
	for (var i = 0; i < this.deList.size(); i++) {
		var de = this.deList.get(i);
		var adjRing = de.getSym().getRing();
		if (adjRing.isOuterHole()) return adjRing;
	}
	return null;
};
EdgeRing.prototype.computeHole = function () {
	var ring = this.getRing();
	this.isHole = CGAlgorithms.isCCW(ring.getCoordinates());
};
EdgeRing.prototype.hasShell = function () {
	return this.shell !== null;
};
EdgeRing.prototype.isOuterShell = function () {
	return this.getOuterHole() !== null;
};
EdgeRing.prototype.getLineString = function () {
	this.getCoordinates();
	return this.factory.createLineString(this.ringPts);
};
EdgeRing.prototype.toString = function () {
	return WKTWriter.toLineString(new CoordinateArraySequence(this.getCoordinates()));
};
EdgeRing.prototype.getShell = function () {
	if (this.isHole()) return this.shell;
	return this;
};
EdgeRing.prototype.add = function (de) {
	this.deList.add(de);
};
EdgeRing.prototype.getRing = function () {
	if (this.ring !== null) return this.ring;
	this.getCoordinates();
	if (this.ringPts.length < 3) System.out.println(this.ringPts);
	try {
		this.ring = this.factory.createLinearRing(this.ringPts);
	} catch (e) {
		if (e instanceof Exception) {
			System.out.println(this.ringPts);
		}
	} finally {}
	return this.ring;
};
EdgeRing.prototype.updateIncluded = function () {
	if (this.isHole()) return null;
	for (var i = 0; i < this.deList.size(); i++) {
		var de = this.deList.get(i);
		var adjShell = de.getSym().getRing().getShell();
		if (adjShell !== null && adjShell.isIncludedSet()) {
			this.setIncluded(!adjShell.isIncluded());
			return null;
		}
	}
};
EdgeRing.prototype.setShell = function (shell) {
	this.shell = shell;
};
EdgeRing.prototype.setProcessed = function (isProcessed) {
	this.isProcessed = isProcessed;
};
EdgeRing.ptNotInList = function (testPts, pts) {
	for (var i = 0; i < testPts.length; i++) {
		var testPt = testPts[i];
		if (!EdgeRing.isInList(testPt, pts)) return testPt;
	}
	return null;
};
EdgeRing.findDirEdgesInRing = function (startDE) {
	var de = startDE;
	var edges = new ArrayList();
	do {
		edges.add(de);
		de = de.getNext();
		Assert.isTrue(de !== null, "found null DE in ring");
		Assert.isTrue(de === startDE || !de.isInRing(), "found DE already in ring");
	} while (de !== startDE);
	return edges;
};
EdgeRing.isInList = function (pt, pts) {
	for (var i = 0; i < pts.length; i++) {
		if (pt.equals(pts[i])) return true;
	}
	return false;
};
EdgeRing.addEdge = function (coords, isForward, coordList) {
	if (isForward) {
		for (var i = 0; i < coords.length; i++) {
			coordList.add(coords[i], false);
		}
	} else {
		for (var i = coords.length - 1; i >= 0; i--) {
			coordList.add(coords[i], false);
		}
	}
};
EdgeRing.findEdgeRingContaining = function (testEr, shellList) {
	var testRing = testEr.getRing();
	var testEnv = testRing.getEnvelopeInternal();
	var testPt = testRing.getCoordinateN(0);
	var minShell = null;
	var minShellEnv = null;
	for (var it = shellList.iterator(); it.hasNext(); ) {
		var tryShell = it.next();
		var tryShellRing = tryShell.getRing();
		var tryShellEnv = tryShellRing.getEnvelopeInternal();
		if (tryShellEnv.equals(testEnv)) continue;
		if (!tryShellEnv.contains(testEnv)) continue;
		testPt = CoordinateArrays.ptNotInList(testRing.getCoordinates(), tryShellRing.getCoordinates());
		var isContained = false;
		if (CGAlgorithms.isPointInRing(testPt, tryShellRing.getCoordinates())) isContained = true;
		if (isContained) {
			if (minShell === null || minShellEnv.contains(tryShellEnv)) {
				minShell = tryShell;
				minShellEnv = minShell.getRing().getEnvelopeInternal();
			}
		}
	}
	return minShell;
};
function EnvelopeComparator() {}
EnvelopeComparator.prototype.compare = function (obj0, obj1) {
	var r0 = obj0;
	var r1 = obj1;
	return r0.getRing().getEnvelope().compareTo(r1.getRing().getEnvelope());
};
EdgeRing.EnvelopeComparator = EnvelopeComparator;

