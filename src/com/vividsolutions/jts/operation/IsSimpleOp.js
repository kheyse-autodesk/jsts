function IsSimpleOp(...args) {
	this.inputGeom = null;
	this.isClosedEndpointsInInterior = true;
	this.nonSimpleLocation = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geom, boundaryNodeRule] = args;
				this.inputGeom = geom;
				this.isClosedEndpointsInInterior = !boundaryNodeRule.isInBoundary(2);
			})(...args);
		case 1:
			return ((...args) => {
				let [geom] = args;
				this.inputGeom = geom;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
			})(...args);
	}
}
module.exports = IsSimpleOp
var TreeSet = require('java/util/TreeSet');
var LineString = require('com/vividsolutions/jts/geom/LineString');
var MultiPoint = require('com/vividsolutions/jts/geom/MultiPoint');
var GeometryGraph = require('com/vividsolutions/jts/geomgraph/GeometryGraph');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var Polygonal = require('com/vividsolutions/jts/geom/Polygonal');
var RobustLineIntersector = require('com/vividsolutions/jts/algorithm/RobustLineIntersector');
var LinearComponentExtracter = require('com/vividsolutions/jts/geom/util/LinearComponentExtracter');
var TreeMap = require('java/util/TreeMap');
var MultiLineString = require('com/vividsolutions/jts/geom/MultiLineString');
IsSimpleOp.prototype.isSimpleMultiPoint = function (mp) {
	if (mp.isEmpty()) return true;
	var points = new TreeSet();
	for (var i = 0; i < mp.getNumGeometries(); i++) {
		var pt = mp.getGeometryN(i);
		var p = pt.getCoordinate();
		if (points.contains(p)) {
			this.nonSimpleLocation = p;
			return false;
		}
		points.add(p);
	}
	return true;
};
IsSimpleOp.prototype.isSimplePolygonal = function (geom) {
	var rings = LinearComponentExtracter.getLines(geom);
	for (var i = rings.iterator(); i.hasNext(); ) {
		var ring = i.next();
		if (!this.isSimpleLinearGeometry(ring)) return false;
	}
	return true;
};
IsSimpleOp.prototype.hasClosedEndpointIntersection = function (graph) {
	var endPoints = new TreeMap();
	for (var i = graph.getEdgeIterator(); i.hasNext(); ) {
		var e = i.next();
		var maxSegmentIndex = e.getMaximumSegmentIndex();
		var isClosed = e.isClosed();
		var p0 = e.getCoordinate(0);
		this.addEndpoint(endPoints, p0, isClosed);
		var p1 = e.getCoordinate(e.getNumPoints() - 1);
		this.addEndpoint(endPoints, p1, isClosed);
	}
	for (var i = endPoints.values().iterator(); i.hasNext(); ) {
		var eiInfo = i.next();
		if (eiInfo.isClosed && eiInfo.degree !== 2) {
			this.nonSimpleLocation = eiInfo.getCoordinate();
			return true;
		}
	}
	return false;
};
IsSimpleOp.prototype.getNonSimpleLocation = function () {
	return this.nonSimpleLocation;
};
IsSimpleOp.prototype.isSimpleLinearGeometry = function (geom) {
	if (geom.isEmpty()) return true;
	var graph = new GeometryGraph(0, geom);
	var li = new RobustLineIntersector();
	var si = graph.computeSelfNodes(li, true);
	if (!si.hasIntersection()) return true;
	if (si.hasProperIntersection()) {
		this.nonSimpleLocation = si.getProperIntersectionPoint();
		return false;
	}
	if (this.hasNonEndpointIntersection(graph)) return false;
	if (this.isClosedEndpointsInInterior) {
		if (this.hasClosedEndpointIntersection(graph)) return false;
	}
	return true;
};
IsSimpleOp.prototype.hasNonEndpointIntersection = function (graph) {
	for (var i = graph.getEdgeIterator(); i.hasNext(); ) {
		var e = i.next();
		var maxSegmentIndex = e.getMaximumSegmentIndex();
		for (var eiIt = e.getEdgeIntersectionList().iterator(); eiIt.hasNext(); ) {
			var ei = eiIt.next();
			if (!ei.isEndPoint(maxSegmentIndex)) {
				this.nonSimpleLocation = ei.getCoordinate();
				return true;
			}
		}
	}
	return false;
};
IsSimpleOp.prototype.addEndpoint = function (endPoints, p, isClosed) {
	var eiInfo = endPoints.get(p);
	if (eiInfo === null) {
		eiInfo = new EndpointInfo(p);
		endPoints.put(p, eiInfo);
	}
	eiInfo.addEndpoint(isClosed);
};
IsSimpleOp.prototype.computeSimple = function (geom) {
	this.nonSimpleLocation = null;
	if (geom.isEmpty()) return true;
	if (geom instanceof LineString) return this.isSimpleLinearGeometry(geom);
	if (geom instanceof MultiLineString) return this.isSimpleLinearGeometry(geom);
	if (geom instanceof MultiPoint) return this.isSimpleMultiPoint(geom);
	if (geom instanceof Polygonal) return this.isSimplePolygonal(geom);
	if (geom instanceof GeometryCollection) return this.isSimpleGeometryCollection(geom);
	return true;
};
IsSimpleOp.prototype.isSimple = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof LineString) {
				return ((...args) => {
					let [geom] = args;
					return this.isSimpleLinearGeometry(geom);
				})(...args);
			} else if (args[0] instanceof MultiLineString) {
				return ((...args) => {
					let [geom] = args;
					return this.isSimpleLinearGeometry(geom);
				})(...args);
			} else if (args[0] instanceof MultiPoint) {
				return ((...args) => {
					let [mp] = args;
					return this.isSimpleMultiPoint(mp);
				})(...args);
			}
		case 0:
			return ((...args) => {
				let [] = args;
				this.nonSimpleLocation = null;
				return this.computeSimple(this.inputGeom);
			})(...args);
	}
};
IsSimpleOp.prototype.isSimpleGeometryCollection = function (geom) {
	for (var i = 0; i < geom.getNumGeometries(); i++) {
		var comp = geom.getGeometryN(i);
		if (!this.computeSimple(comp)) return false;
	}
	return true;
};
function EndpointInfo(pt) {
	this.pt = null;
	this.isClosed = null;
	this.degree = null;
	if (arguments.length === 0) return;
	this.pt = pt;
	this.isClosed = false;
	this.degree = 0;
}
EndpointInfo.prototype.addEndpoint = function (isClosed) {
	this.degree++;
	this.isClosed |= isClosed;
};
EndpointInfo.prototype.getCoordinate = function () {
	return this.pt;
};
IsSimpleOp.EndpointInfo = EndpointInfo;

