function DissolveHalfEdge(orig) {
	this.isStart = false;
	if (arguments.length === 0) return;
	DissolveHalfEdge.super_.call(this, orig);
}
module.exports = DissolveHalfEdge
var MarkHalfEdge = require('com/vividsolutions/jts/edgegraph/MarkHalfEdge');
var util = require('util');
util.inherits(DissolveHalfEdge, MarkHalfEdge)
DissolveHalfEdge.prototype.setStart = function () {
	this.isStart = true;
};
DissolveHalfEdge.prototype.isStart = function () {
	return this.isStart;
};

