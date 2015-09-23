function QuadEdge() {
	this.rot = null;
	this.vertex = null;
	this.next = null;
	this.data = null;
	if (arguments.length === 0) return;
}
module.exports = QuadEdge
var WKTWriter = require('com/vividsolutions/jts/io/WKTWriter');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
QuadEdge.prototype.equalsNonOriented = function (qe) {
	if (this.equalsOriented(qe)) return true;
	if (this.equalsOriented(qe.sym())) return true;
	return false;
};
QuadEdge.prototype.toLineSegment = function () {
	return new LineSegment(this.vertex.getCoordinate(), this.dest().getCoordinate());
};
QuadEdge.prototype.dest = function () {
	return this.sym().orig();
};
QuadEdge.prototype.oNext = function () {
	return this.next;
};
QuadEdge.prototype.equalsOriented = function (qe) {
	if (this.orig().getCoordinate().equals2D(qe.orig().getCoordinate()) && this.dest().getCoordinate().equals2D(qe.dest().getCoordinate())) return true;
	return false;
};
QuadEdge.prototype.dNext = function () {
	return this.sym().oNext().sym();
};
QuadEdge.prototype.lPrev = function () {
	return this.next.sym();
};
QuadEdge.prototype.rPrev = function () {
	return this.sym().oNext();
};
QuadEdge.prototype.rot = function () {
	return this.rot;
};
QuadEdge.prototype.oPrev = function () {
	return this.rot.next.rot;
};
QuadEdge.prototype.sym = function () {
	return this.rot.rot;
};
QuadEdge.prototype.setOrig = function (o) {
	this.vertex = o;
};
QuadEdge.prototype.lNext = function () {
	return this.invRot().oNext().rot();
};
QuadEdge.prototype.getLength = function () {
	return this.orig().getCoordinate().distance(this.dest().getCoordinate());
};
QuadEdge.prototype.invRot = function () {
	return this.rot.sym();
};
QuadEdge.prototype.setDest = function (d) {
	this.sym().setOrig(d);
};
QuadEdge.prototype.setData = function (data) {
	this.data = data;
};
QuadEdge.prototype.getData = function () {
	return this.data;
};
QuadEdge.prototype.delete = function () {
	this.rot = null;
};
QuadEdge.prototype.orig = function () {
	return this.vertex;
};
QuadEdge.prototype.rNext = function () {
	return this.rot.next.invRot();
};
QuadEdge.prototype.toString = function () {
	var p0 = this.vertex.getCoordinate();
	var p1 = this.dest().getCoordinate();
	return WKTWriter.toLineString(p0, p1);
};
QuadEdge.prototype.isLive = function () {
	return this.rot !== null;
};
QuadEdge.prototype.getPrimary = function () {
	if (this.orig().getCoordinate().compareTo(this.dest().getCoordinate()) <= 0) return this; else return this.sym();
};
QuadEdge.prototype.dPrev = function () {
	return this.invRot().oNext().invRot();
};
QuadEdge.prototype.setNext = function (next) {
	this.next = next;
};
QuadEdge.makeEdge = function (o, d) {
	var q0 = new QuadEdge();
	var q1 = new QuadEdge();
	var q2 = new QuadEdge();
	var q3 = new QuadEdge();
	q0.rot = q1;
	q1.rot = q2;
	q2.rot = q3;
	q3.rot = q0;
	q0.setNext(q0);
	q1.setNext(q3);
	q2.setNext(q2);
	q3.setNext(q1);
	var base = q0;
	base.setOrig(o);
	base.setDest(d);
	return base;
};
QuadEdge.swap = function (e) {
	var a = e.oPrev();
	var b = e.sym().oPrev();
	QuadEdge.splice(e, a);
	QuadEdge.splice(e.sym(), b);
	QuadEdge.splice(e, a.lNext());
	QuadEdge.splice(e.sym(), b.lNext());
	e.setOrig(a.dest());
	e.setDest(b.dest());
};
QuadEdge.splice = function (a, b) {
	var alpha = a.oNext().rot();
	var beta = b.oNext().rot();
	var t1 = b.oNext();
	var t2 = a.oNext();
	var t3 = beta.oNext();
	var t4 = alpha.oNext();
	a.setNext(t1);
	b.setNext(t2);
	alpha.setNext(t3);
	beta.setNext(t4);
};
QuadEdge.connect = function (a, b) {
	var e = QuadEdge.makeEdge(a.dest(), b.orig());
	QuadEdge.splice(e, a.lNext());
	QuadEdge.splice(e.sym(), b);
	return e;
};

