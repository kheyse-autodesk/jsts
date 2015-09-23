function HalfEdge(orig) {
	this.orig = null;
	this.sym = null;
	this.next = null;
	if (arguments.length === 0) return;
	this.orig = orig;
}
module.exports = HalfEdge
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Quadrant = require('com/vividsolutions/jts/geomgraph/Quadrant');
var Assert = require('com/vividsolutions/jts/util/Assert');
HalfEdge.prototype.find = function (dest) {
	var oNext = this;
	do {
		if (oNext === null) return null;
		if (oNext.dest().equals2D(dest)) return oNext;
		oNext = oNext.oNext();
	} while (oNext !== this);
	return null;
};
HalfEdge.prototype.dest = function () {
	return this.sym.orig;
};
HalfEdge.prototype.oNext = function () {
	return this.sym.next;
};
HalfEdge.prototype.insert = function (e) {
	if (this.oNext() === this) {
		this.insertAfter(e);
		return null;
	}
	var ecmp = this.compareTo(e);
	var ePrev = this;
	do {
		var oNext = ePrev.oNext();
		var cmp = oNext.compareTo(e);
		if (cmp !== ecmp || oNext === this) {
			ePrev.insertAfter(e);
			return null;
		}
		ePrev = oNext;
	} while (ePrev !== this);
	Assert.shouldNeverReachHere();
};
HalfEdge.prototype.insertAfter = function (e) {
	Assert.equals(this.orig, e.orig());
	var save = this.oNext();
	this.sym.setNext(e);
	e.sym().setNext(save);
};
HalfEdge.prototype.degree = function () {
	var degree = 0;
	var e = this;
	do {
		degree++;
		e = e.oNext();
	} while (e !== this);
	return degree;
};
HalfEdge.prototype.equals = function (p0, p1) {
	return this.orig.equals2D(p0) && this.sym.orig.equals(p1);
};
HalfEdge.prototype.deltaY = function () {
	return this.sym.orig.y - this.orig.y;
};
HalfEdge.prototype.sym = function () {
	return this.sym;
};
HalfEdge.prototype.prev = function () {
	return this.sym;
};
HalfEdge.prototype.compareAngularDirection = function (e) {
	var dx = this.deltaX();
	var dy = this.deltaY();
	var dx2 = e.deltaX();
	var dy2 = e.deltaY();
	if (dx === dx2 && dy === dy2) return 0;
	var quadrant = Quadrant.quadrant(dx, dy);
	var quadrant2 = Quadrant.quadrant(dx2, dy2);
	if (quadrant > quadrant2) return 1;
	if (quadrant < quadrant2) return -1;
	return CGAlgorithms.computeOrientation(e.orig, e.dest(), this.dest());
};
HalfEdge.prototype.prevNode = function () {
	var e = this;
	while (e.degree() === 2) {
		e = e.prev();
		if (e === this) return null;
	}
	return e;
};
HalfEdge.prototype.compareTo = function (obj) {
	var e = obj;
	var comp = this.compareAngularDirection(e);
	return comp;
};
HalfEdge.prototype.next = function () {
	return this.next;
};
HalfEdge.prototype.setSym = function (e) {
	this.sym = e;
};
HalfEdge.prototype.orig = function () {
	return this.orig;
};
HalfEdge.prototype.toString = function () {
	return "HE(" + this.orig.x + " " + this.orig.y + ", " + this.sym.orig.x + " " + this.sym.orig.y + ")";
};
HalfEdge.prototype.setNext = function (e) {
	this.next = e;
};
HalfEdge.prototype.init = function (e) {
	this.setSym(e);
	e.setSym(this);
	this.setNext(e);
	e.setNext(this);
};
HalfEdge.prototype.deltaX = function () {
	return this.sym.orig.x - this.orig.x;
};
HalfEdge.init = function (e0, e1) {
	if (e0.sym !== null || e1.sym !== null || e0.next !== null || e1.next !== null) throw new IllegalStateException("Edges are already initialized");
	e0.init(e1);
	return e0;
};
HalfEdge.create = function (p0, p1) {
	var e0 = new HalfEdge(p0);
	var e1 = new HalfEdge(p1);
	e0.init(e1);
	return e0;
};

