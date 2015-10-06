import CGAlgorithms from 'com/vividsolutions/jts/algorithm/CGAlgorithms';
import CoordinateList from 'com/vividsolutions/jts/geom/CoordinateList';
import WKTWriter from 'com/vividsolutions/jts/io/WKTWriter';
import CoordinateArraySequence from 'com/vividsolutions/jts/geom/impl/CoordinateArraySequence';
import IsValidOp from 'com/vividsolutions/jts/operation/valid/IsValidOp';
import LinearRing from 'com/vividsolutions/jts/geom/LinearRing';
import Exception from 'java/lang/Exception';
import CoordinateArrays from 'com/vividsolutions/jts/geom/CoordinateArrays';
import ArrayList from 'java/util/ArrayList';
import Comparator from 'java/util/Comparator';
import Assert from 'com/vividsolutions/jts/util/Assert';
export default class EdgeRing {
	constructor(...args) {
		(() => {
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
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [factory] = args;
						this.factory = factory;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get EnvelopeComparator() {
		return EnvelopeComparator;
	}
	static ptNotInList(testPts, pts) {
		for (var i = 0; i < testPts.length; i++) {
			var testPt = testPts[i];
			if (!EdgeRing.isInList(testPt, pts)) return testPt;
		}
		return null;
	}
	static findDirEdgesInRing(startDE) {
		var de = startDE;
		var edges = new ArrayList();
		do {
			edges.add(de);
			de = de.getNext();
			Assert.isTrue(de !== null, "found null DE in ring");
			Assert.isTrue(de === startDE || !de.isInRing(), "found DE already in ring");
		} while (de !== startDE);
		return edges;
	}
	static isInList(pt, pts) {
		for (var i = 0; i < pts.length; i++) {
			if (pt.equals(pts[i])) return true;
		}
		return false;
	}
	static addEdge(coords, isForward, coordList) {
		if (isForward) {
			for (var i = 0; i < coords.length; i++) {
				coordList.add(coords[i], false);
			}
		} else {
			for (var i = coords.length - 1; i >= 0; i--) {
				coordList.add(coords[i], false);
			}
		}
	}
	static findEdgeRingContaining(testEr, shellList) {
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
	}
	isIncluded() {
		return this.isIncluded;
	}
	getCoordinates() {
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
	}
	isIncludedSet() {
		return this.isIncludedSet;
	}
	isValid() {
		this.getCoordinates();
		if (this.ringPts.length <= 3) return false;
		this.getRing();
		return IsValidOp.isValid(this.ring);
	}
	build(startDE) {
		var de = startDE;
		do {
			this.add(de);
			de.setRing(this);
			de = de.getNext();
			Assert.isTrue(de !== null, "found null DE in ring");
			Assert.isTrue(de === startDE || !de.isInRing(), "found DE already in ring");
		} while (de !== startDE);
	}
	isOuterHole() {
		if (!this.isHole) return false;
		return !this.hasShell();
	}
	getPolygon() {
		var holeLR = null;
		if (this.holes !== null) {
			holeLR = new Array(this.holes.size());
			for (var i = 0; i < this.holes.size(); i++) {
				holeLR[i] = this.holes.get(i);
			}
		}
		var poly = this.factory.createPolygon(this.ring, holeLR);
		return poly;
	}
	isHole() {
		return this.isHole;
	}
	isProcessed() {
		return this.isProcessed;
	}
	addHole(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof EdgeRing) {
						return ((...args) => {
							let [holeER] = args;
							holeER.setShell(this);
							var hole = holeER.getRing();
							if (this.holes === null) this.holes = new ArrayList();
							this.holes.add(hole);
						})(...args);
					} else if (args[0] instanceof LinearRing) {
						return ((...args) => {
							let [hole] = args;
							if (this.holes === null) this.holes = new ArrayList();
							this.holes.add(hole);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	setIncluded(isIncluded) {
		this.isIncluded = isIncluded;
		this.isIncludedSet = true;
	}
	getOuterHole() {
		if (this.isHole()) return null;
		for (var i = 0; i < this.deList.size(); i++) {
			var de = this.deList.get(i);
			var adjRing = de.getSym().getRing();
			if (adjRing.isOuterHole()) return adjRing;
		}
		return null;
	}
	computeHole() {
		var ring = this.getRing();
		this.isHole = CGAlgorithms.isCCW(ring.getCoordinates());
	}
	hasShell() {
		return this.shell !== null;
	}
	isOuterShell() {
		return this.getOuterHole() !== null;
	}
	getLineString() {
		this.getCoordinates();
		return this.factory.createLineString(this.ringPts);
	}
	toString() {
		return WKTWriter.toLineString(new CoordinateArraySequence(this.getCoordinates()));
	}
	getShell() {
		if (this.isHole()) return this.shell;
		return this;
	}
	add(de) {
		this.deList.add(de);
	}
	getRing() {
		if (this.ring !== null) return this.ring;
		this.getCoordinates();
		if (this.ringPts.length < 3) System.out.println(this.ringPts);
		try {
			this.ring = this.factory.createLinearRing(this.ringPts);
		} catch (ex) {
			if (ex instanceof Exception) {
				System.out.println(this.ringPts);
			} else throw ex;
		} finally {}
		return this.ring;
	}
	updateIncluded() {
		if (this.isHole()) return null;
		for (var i = 0; i < this.deList.size(); i++) {
			var de = this.deList.get(i);
			var adjShell = de.getSym().getRing().getShell();
			if (adjShell !== null && adjShell.isIncludedSet()) {
				this.setIncluded(!adjShell.isIncluded());
				return null;
			}
		}
	}
	setShell(shell) {
		this.shell = shell;
	}
	setProcessed(isProcessed) {
		this.isProcessed = isProcessed;
	}
	getClass() {
		return EdgeRing;
	}
}
class EnvelopeComparator {
	get interfaces_() {
		return [Comparator];
	}
	compare(obj0, obj1) {
		var r0 = obj0;
		var r1 = obj1;
		return r0.getRing().getEnvelopeInternal().compareTo(r1.getRing().getEnvelopeInternal());
	}
	getClass() {
		return EnvelopeComparator;
	}
}

