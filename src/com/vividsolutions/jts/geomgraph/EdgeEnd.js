function EdgeEnd(...args) {
	this.edge = null;
	this.label = null;
	this.node = null;
	this.p0 = null;
	this.p1 = null;
	this.dx = null;
	this.dy = null;
	this.quadrant = null;
	switch (args.length) {
		case 4:
			return ((...args) => {
				let [edge, p0, p1, label] = args;
				EdgeEnd.call(this, edge);
				this.init(p0, p1);
				this.label = label;
			})(...args);
		case 1:
			return ((...args) => {
				let [edge] = args;
				this.edge = edge;
			})(...args);
		case 3:
			return ((...args) => {
				let [edge, p0, p1] = args;
				EdgeEnd.call(this, edge, p0, p1, null);
			})(...args);
	}
}
module.exports = EdgeEnd
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Quadrant = require('com/vividsolutions/jts/geomgraph/Quadrant');
var Assert = require('com/vividsolutions/jts/util/Assert');
EdgeEnd.prototype.compareDirection = function (e) {
	if (this.dx === e.dx && this.dy === e.dy) return 0;
	if (this.quadrant > e.quadrant) return 1;
	if (this.quadrant < e.quadrant) return -1;
	return CGAlgorithms.computeOrientation(e.p0, e.p1, this.p1);
};
EdgeEnd.prototype.getDy = function () {
	return this.dy;
};
EdgeEnd.prototype.getCoordinate = function () {
	return this.p0;
};
EdgeEnd.prototype.setNode = function (node) {
	this.node = node;
};
EdgeEnd.prototype.print = function (out) {
	var angle = Math.atan2(this.dy, this.dx);
	var className = this.getClass().getName();
	var lastDotPos = className.lastIndexOf('.');
	var name = className.substring(lastDotPos + 1);
	out.print("  " + name + ": " + this.p0 + " - " + this.p1 + " " + this.quadrant + ":" + angle + "   " + this.label);
};
EdgeEnd.prototype.compareTo = function (obj) {
	var e = obj;
	return this.compareDirection(e);
};
EdgeEnd.prototype.getDirectedCoordinate = function () {
	return this.p1;
};
EdgeEnd.prototype.getDx = function () {
	return this.dx;
};
EdgeEnd.prototype.getLabel = function () {
	return this.label;
};
EdgeEnd.prototype.getEdge = function () {
	return this.edge;
};
EdgeEnd.prototype.getQuadrant = function () {
	return this.quadrant;
};
EdgeEnd.prototype.getNode = function () {
	return this.node;
};
EdgeEnd.prototype.toString = function () {
	var angle = Math.atan2(this.dy, this.dx);
	var className = this.getClass().getName();
	var lastDotPos = className.lastIndexOf('.');
	var name = className.substring(lastDotPos + 1);
	return "  " + name + ": " + this.p0 + " - " + this.p1 + " " + this.quadrant + ":" + angle + "   " + this.label;
};
EdgeEnd.prototype.computeLabel = function (boundaryNodeRule) {};
EdgeEnd.prototype.init = function (p0, p1) {
	this.p0 = p0;
	this.p1 = p1;
	this.dx = p1.x - p0.x;
	this.dy = p1.y - p0.y;
	this.quadrant = Quadrant.quadrant(this.dx, this.dy);
	Assert.isTrue(!(this.dx === 0 && this.dy === 0), "EdgeEnd with identical endpoints found");
};

