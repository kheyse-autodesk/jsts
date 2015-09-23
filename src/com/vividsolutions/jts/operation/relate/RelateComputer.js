function RelateComputer(arg) {
	this.li = new RobustLineIntersector();
	this.ptLocator = new PointLocator();
	this.arg = null;
	this.nodes = new NodeMap(new RelateNodeFactory());
	this.im = null;
	this.isolatedEdges = new ArrayList();
	this.invalidPoint = null;
	if (arguments.length === 0) return;
	this.arg = arg;
}
module.exports = RelateComputer
var PointLocator = require('com/vividsolutions/jts/algorithm/PointLocator');
var Location = require('com/vividsolutions/jts/geom/Location');
var IntersectionMatrix = require('com/vividsolutions/jts/geom/IntersectionMatrix');
var EdgeEndBuilder = require('com/vividsolutions/jts/operation/relate/EdgeEndBuilder');
var NodeMap = require('com/vividsolutions/jts/geomgraph/NodeMap');
var RelateNodeFactory = require('com/vividsolutions/jts/operation/relate/RelateNodeFactory');
var ArrayList = require('java/util/ArrayList');
var RobustLineIntersector = require('com/vividsolutions/jts/algorithm/RobustLineIntersector');
var Assert = require('com/vividsolutions/jts/util/Assert');
RelateComputer.prototype.insertEdgeEnds = function (ee) {
	for (var i = ee.iterator(); i.hasNext(); ) {
		var e = i.next();
		this.nodes.add(e);
	}
};
RelateComputer.prototype.computeProperIntersectionIM = function (intersector, im) {
	var dimA = this.arg[0].getGeometry().getDimension();
	var dimB = this.arg[1].getGeometry().getDimension();
	var hasProper = intersector.hasProperIntersection();
	var hasProperInterior = intersector.hasProperInteriorIntersection();
	if (dimA === 2 && dimB === 2) {
		if (hasProper) im.setAtLeast("212101212");
	} else if (dimA === 2 && dimB === 1) {
		if (hasProper) im.setAtLeast("FFF0FFFF2");
		if (hasProperInterior) im.setAtLeast("1FFFFF1FF");
	} else if (dimA === 1 && dimB === 2) {
		if (hasProper) im.setAtLeast("F0FFFFFF2");
		if (hasProperInterior) im.setAtLeast("1F1FFFFFF");
	} else if (dimA === 1 && dimB === 1) {
		if (hasProperInterior) im.setAtLeast("0FFFFFFFF");
	}
};
RelateComputer.prototype.labelIsolatedEdges = function (thisIndex, targetIndex) {
	for (var ei = this.arg[thisIndex].getEdgeIterator(); ei.hasNext(); ) {
		var e = ei.next();
		if (e.isIsolated()) {
			this.labelIsolatedEdge(e, targetIndex, this.arg[targetIndex].getGeometry());
			this.isolatedEdges.add(e);
		}
	}
};
RelateComputer.prototype.labelIsolatedEdge = function (e, targetIndex, target) {
	if (target.getDimension() > 0) {
		var loc = this.ptLocator.locate(e.getCoordinate(), target);
		e.getLabel().setAllLocations(targetIndex, loc);
	} else {
		e.getLabel().setAllLocations(targetIndex, Location.EXTERIOR);
	}
};
RelateComputer.prototype.computeIM = function () {
	var im = new IntersectionMatrix();
	im.set(Location.EXTERIOR, Location.EXTERIOR, 2);
	if (!this.arg[0].getGeometry().getEnvelopeInternal().intersects(this.arg[1].getGeometry().getEnvelopeInternal())) {
		this.computeDisjointIM(im);
		return im;
	}
	this.arg[0].computeSelfNodes(this.li, false);
	this.arg[1].computeSelfNodes(this.li, false);
	var intersector = this.arg[0].computeEdgeIntersections(this.arg[1], this.li, false);
	this.computeIntersectionNodes(0);
	this.computeIntersectionNodes(1);
	this.copyNodesAndLabels(0);
	this.copyNodesAndLabels(1);
	this.labelIsolatedNodes();
	this.computeProperIntersectionIM(intersector, im);
	var eeBuilder = new EdgeEndBuilder();
	var ee0 = eeBuilder.computeEdgeEnds(this.arg[0].getEdgeIterator());
	this.insertEdgeEnds(ee0);
	var ee1 = eeBuilder.computeEdgeEnds(this.arg[1].getEdgeIterator());
	this.insertEdgeEnds(ee1);
	this.labelNodeEdges();
	this.labelIsolatedEdges(0, 1);
	this.labelIsolatedEdges(1, 0);
	this.updateIM(im);
	return im;
};
RelateComputer.prototype.labelNodeEdges = function () {
	for (var ni = this.nodes.iterator(); ni.hasNext(); ) {
		var node = ni.next();
		node.getEdges().computeLabelling(this.arg);
	}
};
RelateComputer.prototype.copyNodesAndLabels = function (argIndex) {
	for (var i = this.arg[argIndex].getNodeIterator(); i.hasNext(); ) {
		var graphNode = i.next();
		var newNode = this.nodes.addNode(graphNode.getCoordinate());
		newNode.setLabel(argIndex, graphNode.getLabel().getLocation(argIndex));
	}
};
RelateComputer.prototype.labelIntersectionNodes = function (argIndex) {
	for (var i = this.arg[argIndex].getEdgeIterator(); i.hasNext(); ) {
		var e = i.next();
		var eLoc = e.getLabel().getLocation(argIndex);
		for (var eiIt = e.getEdgeIntersectionList().iterator(); eiIt.hasNext(); ) {
			var ei = eiIt.next();
			var n = this.nodes.find(ei.coord);
			if (n.getLabel().isNull(argIndex)) {
				if (eLoc === Location.BOUNDARY) n.setLabelBoundary(argIndex); else n.setLabel(argIndex, Location.INTERIOR);
			}
		}
	}
};
RelateComputer.prototype.labelIsolatedNode = function (n, targetIndex) {
	var loc = this.ptLocator.locate(n.getCoordinate(), this.arg[targetIndex].getGeometry());
	n.getLabel().setAllLocations(targetIndex, loc);
};
RelateComputer.prototype.computeIntersectionNodes = function (argIndex) {
	for (var i = this.arg[argIndex].getEdgeIterator(); i.hasNext(); ) {
		var e = i.next();
		var eLoc = e.getLabel().getLocation(argIndex);
		for (var eiIt = e.getEdgeIntersectionList().iterator(); eiIt.hasNext(); ) {
			var ei = eiIt.next();
			var n = this.nodes.addNode(ei.coord);
			if (eLoc === Location.BOUNDARY) n.setLabelBoundary(argIndex); else {
				if (n.getLabel().isNull(argIndex)) n.setLabel(argIndex, Location.INTERIOR);
			}
		}
	}
};
RelateComputer.prototype.labelIsolatedNodes = function () {
	for (var ni = this.nodes.iterator(); ni.hasNext(); ) {
		var n = ni.next();
		var label = n.getLabel();
		Assert.isTrue(label.getGeometryCount() > 0, "node with empty label found");
		if (n.isIsolated()) {
			if (label.isNull(0)) this.labelIsolatedNode(n, 0); else this.labelIsolatedNode(n, 1);
		}
	}
};
RelateComputer.prototype.updateIM = function (im) {
	for (var ei = this.isolatedEdges.iterator(); ei.hasNext(); ) {
		var e = ei.next();
		e.updateIM(im);
	}
	for (var ni = this.nodes.iterator(); ni.hasNext(); ) {
		var node = ni.next();
		node.updateIM(im);
		node.updateIMFromEdges(im);
	}
};
RelateComputer.prototype.computeDisjointIM = function (im) {
	var ga = this.arg[0].getGeometry();
	if (!ga.isEmpty()) {
		im.set(Location.INTERIOR, Location.EXTERIOR, ga.getDimension());
		im.set(Location.BOUNDARY, Location.EXTERIOR, ga.getBoundaryDimension());
	}
	var gb = this.arg[1].getGeometry();
	if (!gb.isEmpty()) {
		im.set(Location.EXTERIOR, Location.INTERIOR, gb.getDimension());
		im.set(Location.EXTERIOR, Location.BOUNDARY, gb.getBoundaryDimension());
	}
};

