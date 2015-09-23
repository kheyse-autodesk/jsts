function Root() {
	if (arguments.length === 0) return;
}
module.exports = Root
var NodeBase = require('com/vividsolutions/jts/index/quadtree/NodeBase');
var util = require('util');
util.inherits(Root, NodeBase)
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Node = require('com/vividsolutions/jts/index/quadtree/Node');
var IntervalSize = require('com/vividsolutions/jts/index/quadtree/IntervalSize');
var Assert = require('com/vividsolutions/jts/util/Assert');
Root.prototype.insert = function (itemEnv, item) {
	var index = Root.getSubnodeIndex(itemEnv, Root.origin.x, Root.origin.y);
	if (index === -1) {
		this.add(item);
		return null;
	}
	var node = this.subnode[index];
	if (node === null || !node.getEnvelope().contains(itemEnv)) {
		var largerNode = Node.createExpanded(node, itemEnv);
		this.subnode[index] = largerNode;
	}
	this.insertContained(this.subnode[index], itemEnv, item);
};
Root.prototype.isSearchMatch = function (searchEnv) {
	return true;
};
Root.prototype.insertContained = function (tree, itemEnv, item) {
	Assert.isTrue(tree.getEnvelope().contains(itemEnv));
	var isZeroX = IntervalSize.isZeroWidth(itemEnv.getMinX(), itemEnv.getMaxX());
	var isZeroY = IntervalSize.isZeroWidth(itemEnv.getMinY(), itemEnv.getMaxY());
	var node = null;
	if (isZeroX || isZeroY) node = tree.find(itemEnv); else node = tree.getNode(itemEnv);
	node.add(item);
};
Root.origin = new Coordinate(0.0, 0.0);

