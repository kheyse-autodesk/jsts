function Polygonizer(...args) {
	this.lineStringAdder = new LineStringAdder();
	this.graph = null;
	this.dangles = new ArrayList();
	this.cutEdges = new ArrayList();
	this.invalidRingLines = new ArrayList();
	this.holeList = null;
	this.shellList = null;
	this.polyList = null;
	this.isCheckingRingsValid = true;
	this.extractOnlyPolygonal = null;
	this.geomFactory = null;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [extractOnlyPolygonal] = args;
				this.extractOnlyPolygonal = extractOnlyPolygonal;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				Polygonizer.call(this, false);
			})(...args);
	}
}
module.exports = Polygonizer
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var PolygonizeGraph = require('com/vividsolutions/jts/operation/polygonize/PolygonizeGraph');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Collection = require('java/util/Collection');
var Collections = require('java/util/Collections');
var EdgeRing = require('com/vividsolutions/jts/operation/polygonize/EdgeRing');
var ArrayList = require('java/util/ArrayList');
Polygonizer.prototype.getGeometry = function () {
	if (this.geomFactory === null) this.geomFactory = new GeometryFactory();
	this.polygonize();
	if (this.extractOnlyPolygonal) {
		return this.geomFactory.buildGeometry(this.polyList);
	}
	return this.geomFactory.createGeometryCollection(GeometryFactory.toGeometryArray(this.polyList));
};
Polygonizer.prototype.getInvalidRingLines = function () {
	this.polygonize();
	return this.invalidRingLines;
};
Polygonizer.prototype.findValidRings = function (edgeRingList, validEdgeRingList, invalidRingList) {
	for (var i = edgeRingList.iterator(); i.hasNext(); ) {
		var er = i.next();
		if (er.isValid()) validEdgeRingList.add(er); else invalidRingList.add(er.getLineString());
	}
};
Polygonizer.prototype.polygonize = function () {
	if (this.polyList !== null) return null;
	this.polyList = new ArrayList();
	if (this.graph === null) return null;
	this.dangles = this.graph.deleteDangles();
	this.cutEdges = this.graph.deleteCutEdges();
	var edgeRingList = this.graph.getEdgeRings();
	var validEdgeRingList = new ArrayList();
	this.invalidRingLines = new ArrayList();
	if (this.isCheckingRingsValid) {
		this.findValidRings(edgeRingList, validEdgeRingList, this.invalidRingLines);
	} else {
		validEdgeRingList = edgeRingList;
	}
	this.findShellsAndHoles(validEdgeRingList);
	Polygonizer.assignHolesToShells(this.holeList, this.shellList);
	Collections.sort(this.shellList, new EdgeRing.EnvelopeComparator());
	var includeAll = true;
	if (this.extractOnlyPolygonal) {
		Polygonizer.findDisjointShells(this.shellList);
		includeAll = false;
	}
	this.polyList = Polygonizer.extractPolygons(this.shellList, includeAll);
};
Polygonizer.prototype.getDangles = function () {
	this.polygonize();
	return this.dangles;
};
Polygonizer.prototype.getCutEdges = function () {
	this.polygonize();
	return this.cutEdges;
};
Polygonizer.prototype.getPolygons = function () {
	this.polygonize();
	return this.polyList;
};
Polygonizer.prototype.add = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Collection) {
				return ((...args) => {
					let [geomList] = args;
					for (var i = geomList.iterator(); i.hasNext(); ) {
						var geometry = i.next();
						this.add(geometry);
					}
				})(...args);
			} else if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [g] = args;
					g.apply(this.lineStringAdder);
				})(...args);
			} else if (args[0] instanceof LineString) {
				return ((...args) => {
					let [line] = args;
					this.geomFactory = line.getFactory();
					if (this.graph === null) this.graph = new PolygonizeGraph(this.geomFactory);
					this.graph.addEdge(line);
				})(...args);
			}
	}
};
Polygonizer.prototype.setCheckRingsValid = function (isCheckingRingsValid) {
	this.isCheckingRingsValid = isCheckingRingsValid;
};
Polygonizer.prototype.findShellsAndHoles = function (edgeRingList) {
	this.holeList = new ArrayList();
	this.shellList = new ArrayList();
	for (var i = edgeRingList.iterator(); i.hasNext(); ) {
		var er = i.next();
		er.computeHole();
		if (er.isHole()) this.holeList.add(er); else this.shellList.add(er);
	}
};
Polygonizer.findOuterShells = function (shellList) {
	for (var i = shellList.iterator(); i.hasNext(); ) {
		var er = i.next();
		var outerHoleER = er.getOuterHole();
		if (outerHoleER !== null && !outerHoleER.isProcessed()) {
			er.setIncluded(true);
			outerHoleER.setProcessed(true);
		}
	}
};
Polygonizer.extractPolygons = function (shellList, includeAll) {
	var polyList = new ArrayList();
	for (var i = shellList.iterator(); i.hasNext(); ) {
		var er = i.next();
		if (includeAll || er.isIncluded()) {
			polyList.add(er.getPolygon());
		}
	}
	return polyList;
};
Polygonizer.assignHolesToShells = function (holeList, shellList) {
	for (var i = holeList.iterator(); i.hasNext(); ) {
		var holeER = i.next();
		Polygonizer.assignHoleToShell(holeER, shellList);
	}
};
Polygonizer.assignHoleToShell = function (holeER, shellList) {
	var shell = EdgeRing.findEdgeRingContaining(holeER, shellList);
	if (shell !== null) {
		shell.addHole(holeER);
	}
};
Polygonizer.findDisjointShells = function (shellList) {
	Polygonizer.findOuterShells(shellList);
	var isMoreToScan = null;
	do {
		isMoreToScan = false;
		for (var i = shellList.iterator(); i.hasNext(); ) {
			var er = i.next();
			if (er.isIncludedSet()) continue;
			er.updateIncluded();
			if (!er.isIncludedSet()) {
				isMoreToScan = true;
			}
		}
	} while (isMoreToScan);
};

