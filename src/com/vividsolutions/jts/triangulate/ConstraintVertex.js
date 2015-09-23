function ConstraintVertex(p) {
	this.isOnConstraint = null;
	this.constraint = null;
	if (arguments.length === 0) return;
	ConstraintVertex.super_.call(this, p);
}
module.exports = ConstraintVertex
var Vertex = require('com/vividsolutions/jts/triangulate/quadedge/Vertex');
var util = require('util');
util.inherits(ConstraintVertex, Vertex)
ConstraintVertex.prototype.getConstraint = function () {
	return this.constraint;
};
ConstraintVertex.prototype.setOnConstraint = function (isOnConstraint) {
	this.isOnConstraint = isOnConstraint;
};
ConstraintVertex.prototype.merge = function (other) {
	if (other.isOnConstraint) {
		this.isOnConstraint = true;
		this.constraint = other.constraint;
	}
};
ConstraintVertex.prototype.isOnConstraint = function () {
	return this.isOnConstraint;
};
ConstraintVertex.prototype.setConstraint = function (constraint) {
	this.isOnConstraint = true;
	this.constraint = constraint;
};

