function RelateOp(...args) {
	this.relate = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [g0, g1] = args;
				RelateOp.super_.call(this, g0, g1);
				this.relate = new RelateComputer(this.arg);
			})(...args);
		case 3:
			return ((...args) => {
				let [g0, g1, boundaryNodeRule] = args;
				RelateOp.super_.call(this, g0, g1, boundaryNodeRule);
				this.relate = new RelateComputer(this.arg);
			})(...args);
	}
}
module.exports = RelateOp
var GeometryGraphOperation = require('com/vividsolutions/jts/operation/GeometryGraphOperation');
var util = require('util');
util.inherits(RelateOp, GeometryGraphOperation)
var RelateComputer = require('com/vividsolutions/jts/operation/relate/RelateComputer');
RelateOp.prototype.getIntersectionMatrix = function () {
	return this.relate.computeIM();
};
RelateOp.relate = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [a, b] = args;
				var relOp = new RelateOp(a, b);
				var im = relOp.getIntersectionMatrix();
				return im;
			})(...args);
		case 3:
			return ((...args) => {
				let [a, b, boundaryNodeRule] = args;
				var relOp = new RelateOp(a, b, boundaryNodeRule);
				var im = relOp.getIntersectionMatrix();
				return im;
			})(...args);
	}
};

