function IntervalRTreeLeafNode(min, max, item) {
	this.item = null;
	if (arguments.length === 0) return;
	this.min = min;
	this.max = max;
	this.item = item;
}
module.exports = IntervalRTreeLeafNode
var IntervalRTreeNode = require('com/vividsolutions/jts/index/intervalrtree/IntervalRTreeNode');
var util = require('util');
util.inherits(IntervalRTreeLeafNode, IntervalRTreeNode)
IntervalRTreeLeafNode.prototype.query = function (queryMin, queryMax, visitor) {
	if (!this.intersects(queryMin, queryMax)) return null;
	visitor.visitItem(this.item);
};

