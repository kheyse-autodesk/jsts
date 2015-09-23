function Edge(...args) {
	this.pts = null;
	this.env = null;
	this.eiList = new EdgeIntersectionList(this);
	this.name = null;
	this.mce = null;
	this.isIsolated = true;
	this.depth = new Depth();
	this.depthDelta = 0;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [pts, label] = args;
				this.pts = pts;
				this.label = label;
			})(...args);
		case 1:
			return ((...args) => {
				let [pts] = args;
				Edge.call(this, pts, null);
			})(...args);
	}
}
module.exports = Edge
var GraphComponent = require('com/vividsolutions/jts/geomgraph/GraphComponent');
var util = require('util');
util.inherits(Edge, GraphComponent)
var EdgeIntersectionList = require('com/vividsolutions/jts/geomgraph/EdgeIntersectionList');
var MonotoneChainEdge = require('com/vividsolutions/jts/geomgraph/index/MonotoneChainEdge');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Label = require('com/vividsolutions/jts/geomgraph/Label');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
var Depth = require('com/vividsolutions/jts/geomgraph/Depth');
Edge.prototype.getDepth = function () {
	return this.depth;
};
Edge.prototype.getCollapsedEdge = function () {
	var newPts = [];
	newPts[0] = this.pts[0];
	newPts[1] = this.pts[1];
	var newe = new Edge(newPts, Label.toLineLabel(this.label));
	return newe;
};
Edge.prototype.isIsolated = function () {
	return this.isIsolated;
};
Edge.prototype.getCoordinates = function () {
	return this.pts;
};
Edge.prototype.setIsolated = function (isIsolated) {
	this.isIsolated = isIsolated;
};
Edge.prototype.setName = function (name) {
	this.name = name;
};
Edge.prototype.equals = function (o) {
	if (!(o instanceof Edge)) return false;
	var e = o;
	if (this.pts.length !== e.pts.length) return false;
	var isEqualForward = true;
	var isEqualReverse = true;
	var iRev = this.pts.length;
	for (var i = 0; i < this.pts.length; i++) {
		if (!this.pts[i].equals2D(e.pts[i])) {
			isEqualForward = false;
		}
		if (!this.pts[i].equals2D(e.pts[-- iRev])) {
			isEqualReverse = false;
		}
		if (!isEqualForward && !isEqualReverse) return false;
	}
	return true;
};
Edge.prototype.getCoordinate = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [i] = args;
				return this.pts[i];
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				if (this.pts.length > 0) return this.pts[0];
				return null;
			})(...args);
	}
};
Edge.prototype.print = function (out) {
	out.print("edge " + this.name + ": ");
	out.print("LINESTRING (");
	for (var i = 0; i < this.pts.length; i++) {
		if (i > 0) out.print(",");
		out.print(this.x + " " + this.y);
	}
	out.print(")  " + this.label + " " + this.depthDelta);
};
Edge.prototype.computeIM = function (im) {
	Edge.updateIM(this.label, im);
};
Edge.prototype.isCollapsed = function () {
	if (!this.label.isArea()) return false;
	if (this.pts.length !== 3) return false;
	if (this.pts[0].equals(this.pts[2])) return true;
	return false;
};
Edge.prototype.isClosed = function () {
	return this.pts[0].equals(this.pts[this.pts.length - 1]);
};
Edge.prototype.getMaximumSegmentIndex = function () {
	return this.pts.length - 1;
};
Edge.prototype.getDepthDelta = function () {
	return this.depthDelta;
};
Edge.prototype.getNumPoints = function () {
	return this.pts.length;
};
Edge.prototype.printReverse = function (out) {
	out.print("edge " + this.name + ": ");
	for (var i = this.pts.length - 1; i >= 0; i--) {
		out.print(this.pts[i] + " ");
	}
	out.println("");
};
Edge.prototype.getMonotoneChainEdge = function () {
	if (this.mce === null) this.mce = new MonotoneChainEdge(this);
	return this.mce;
};
Edge.prototype.getEnvelope = function () {
	if (this.env === null) {
		this.env = new Envelope();
		for (var i = 0; i < this.pts.length; i++) {
			this.env.expandToInclude(this.pts[i]);
		}
	}
	return this.env;
};
Edge.prototype.addIntersection = function (li, segmentIndex, geomIndex, intIndex) {
	var intPt = new Coordinate(li.getIntersection(intIndex));
	var normalizedSegmentIndex = segmentIndex;
	var dist = li.getEdgeDistance(geomIndex, intIndex);
	var nextSegIndex = normalizedSegmentIndex + 1;
	if (nextSegIndex < this.pts.length) {
		var nextPt = this.pts[nextSegIndex];
		if (intPt.equals2D(nextPt)) {
			normalizedSegmentIndex = nextSegIndex;
			dist = 0.0;
		}
	}
	var ei = this.eiList.add(intPt, normalizedSegmentIndex, dist);
};
Edge.prototype.toString = function () {
	var buf = new StringBuffer();
	buf.append("edge " + this.name + ": ");
	buf.append("LINESTRING (");
	for (var i = 0; i < this.pts.length; i++) {
		if (i > 0) buf.append(",");
		buf.append(this.x + " " + this.y);
	}
	buf.append(")  " + this.label + " " + this.depthDelta);
	return buf.toString();
};
Edge.prototype.isPointwiseEqual = function (e) {
	if (this.pts.length !== e.pts.length) return false;
	for (var i = 0; i < this.pts.length; i++) {
		if (!this.pts[i].equals2D(e.pts[i])) {
			return false;
		}
	}
	return true;
};
Edge.prototype.setDepthDelta = function (depthDelta) {
	this.depthDelta = depthDelta;
};
Edge.prototype.getEdgeIntersectionList = function () {
	return this.eiList;
};
Edge.prototype.addIntersections = function (li, segmentIndex, geomIndex) {
	for (var i = 0; i < li.getIntersectionNum(); i++) {
		this.addIntersection(li, segmentIndex, geomIndex, i);
	}
};
Edge.updateIM = function (label, im) {
	im.setAtLeastIfValid(label.getLocation(0, Position.ON), label.getLocation(1, Position.ON), 1);
	if (label.isArea()) {
		im.setAtLeastIfValid(label.getLocation(0, Position.LEFT), label.getLocation(1, Position.LEFT), 2);
		im.setAtLeastIfValid(label.getLocation(0, Position.RIGHT), label.getLocation(1, Position.RIGHT), 2);
	}
};

