function MarkHalfEdge(orig) {
	this.isMarked = false;
	if (arguments.length === 0) return;
	MarkHalfEdge.super_.call(this, orig);
}
module.exports = MarkHalfEdge
var HalfEdge = require('com/vividsolutions/jts/edgegraph/HalfEdge');
var util = require('util');
util.inherits(MarkHalfEdge, HalfEdge)
MarkHalfEdge.prototype.mark = function () {
	this.isMarked = true;
};
MarkHalfEdge.prototype.setMark = function (isMarked) {
	this.isMarked = isMarked;
};
MarkHalfEdge.prototype.isMarked = function () {
	return this.isMarked;
};
MarkHalfEdge.setMarkBoth = function (e, isMarked) {
	e.setMark(isMarked);
	e.sym().setMark(isMarked);
};
MarkHalfEdge.isMarked = function (e) {
	return e.isMarked();
};
MarkHalfEdge.setMark = function (e, isMarked) {
	e.setMark(isMarked);
};
MarkHalfEdge.markBoth = function (e) {
	e.mark();
	e.sym().mark();
};
MarkHalfEdge.mark = function (e) {
	e.mark();
};

