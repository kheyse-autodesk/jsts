function IntervalRTreeBranchNode(n1, n2) {
	this.node1 = null;
	this.node2 = null;
	if (arguments.length === 0) return;
	this.node1 = n1;
	this.node2 = n2;
	this.buildExtent(this.node1, this.node2);
}
module.exports = IntervalRTreeBranchNode
var IntervalRTreeNode = require('com/vividsolutions/jts/index/intervalrtree/IntervalRTreeNode');
var util = require('util');
util.inherits(IntervalRTreeBranchNode, IntervalRTreeNode)
IntervalRTreeBranchNode.prototype.buildExtent = function (n1, n2) {
	this.min = Math.min(n1.min, n2.min);
	this.max = Math.max(n1.max, n2.max);
};
IntervalRTreeBranchNode.prototype.query = function (queryMin, queryMax, visitor) {
	if (!this.intersects(queryMin, queryMax)) {
		return null;
	}
	if (this.node1 !== null) this.node1.query(queryMin, queryMax, visitor);
	if (this.node2 !== null) this.node2.query(queryMin, queryMax, visitor);
};

