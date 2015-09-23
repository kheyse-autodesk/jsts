function SIRtree(...args) {
	this.comparator = new Comparator();
	this.intersectsOp = new IntersectsOp();
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [nodeCapacity] = args;
				SIRtree.super_.call(this, nodeCapacity);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				SIRtree.call(this, 10);
			})(...args);
	}
}
module.exports = SIRtree
var AbstractSTRtree = require('com/vividsolutions/jts/index/strtree/AbstractSTRtree');
var util = require('util');
util.inherits(SIRtree, AbstractSTRtree)
var AbstractNode = require('com/vividsolutions/jts/index/strtree/AbstractNode');
var Interval = require('com/vividsolutions/jts/index/strtree/Interval');
var Comparator = require('java/util/Comparator');
SIRtree.prototype.createNode = function (level) {
	return new AbstractNode(level);
};
SIRtree.prototype.insert = function (x1, x2, item) {
	SIRtree.super_.prototype.insert.call(this, new Interval(Math.min(x1, x2), Math.max(x1, x2)), item);
};
SIRtree.prototype.getIntersectsOp = function () {
	return this.intersectsOp;
};
SIRtree.prototype.query = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [x1, x2] = args;
				return SIRtree.super_.prototype.query.call(this, new Interval(Math.min(x1, x2), Math.max(x1, x2)));
			})(...args);
		case 1:
			return ((...args) => {
				let [x] = args;
				return this.query(x, x);
			})(...args);
	}
};
SIRtree.prototype.getComparator = function () {
	return this.comparator;
};

