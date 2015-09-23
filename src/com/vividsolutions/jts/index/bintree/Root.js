function Root() {
	if (arguments.length === 0) return;
}
module.exports = Root
var NodeBase = require('com/vividsolutions/jts/index/bintree/NodeBase');
var util = require('util');
util.inherits(Root, NodeBase)
var Node = require('com/vividsolutions/jts/index/bintree/Node');
var IntervalSize = require('com/vividsolutions/jts/index/quadtree/IntervalSize');
var Assert = require('com/vividsolutions/jts/util/Assert');
Root.prototype.insert = function (itemInterval, item) {
	var index = Root.getSubnodeIndex(itemInterval, Root.origin);
	if (index === -1) {
		this.add(item);
		return null;
	}
	var node = this.subnode[index];
	if (node === null || !node.getInterval().contains(itemInterval)) {
		var largerNode = Node.createExpanded(node, itemInterval);
		this.subnode[index] = largerNode;
	}
	this.insertContained(this.subnode[index], itemInterval, item);
};
Root.prototype.isSearchMatch = function (interval) {
	return true;
};
Root.prototype.insertContained = function (tree, itemInterval, item) {
	Assert.isTrue(tree.getInterval().contains(itemInterval));
	var isZeroArea = IntervalSize.isZeroWidth(itemInterval.getMin(), itemInterval.getMax());
	var node = null;
	if (isZeroArea) node = tree.find(itemInterval); else node = tree.getNode(itemInterval);
	node.add(item);
};
Root.origin = 0.0;

