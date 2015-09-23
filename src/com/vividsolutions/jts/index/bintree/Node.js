function Node(interval, level) {
	this.interval = null;
	this.centre = null;
	this.level = null;
	if (arguments.length === 0) return;
	this.interval = interval;
	this.level = level;
	this.centre = (interval.getMin() + interval.getMax()) / 2;
}
module.exports = Node
var NodeBase = require('com/vividsolutions/jts/index/bintree/NodeBase');
var util = require('util');
util.inherits(Node, NodeBase)
var Interval = require('com/vividsolutions/jts/index/bintree/Interval');
var Assert = require('com/vividsolutions/jts/util/Assert');
var Key = require('com/vividsolutions/jts/index/bintree/Key');
Node.prototype.getInterval = function () {
	return this.interval;
};
Node.prototype.find = function (searchInterval) {
	var subnodeIndex = Node.getSubnodeIndex(searchInterval, this.centre);
	if (subnodeIndex === -1) return this;
	if (this.subnode[subnodeIndex] !== null) {
		var node = this.subnode[subnodeIndex];
		return node.find(searchInterval);
	}
	return this;
};
Node.prototype.insert = function (node) {
	Assert.isTrue(this.interval === null || this.interval.contains(node.interval));
	var index = Node.getSubnodeIndex(node.interval, this.centre);
	if (node.level === this.level - 1) {
		this.subnode[index] = node;
	} else {
		var childNode = this.createSubnode(index);
		childNode.insert(node);
		this.subnode[index] = childNode;
	}
};
Node.prototype.isSearchMatch = function (itemInterval) {
	return itemInterval.overlaps(this.interval);
};
Node.prototype.getSubnode = function (index) {
	if (this.subnode[index] === null) {
		this.subnode[index] = this.createSubnode(index);
	}
	return this.subnode[index];
};
Node.prototype.getNode = function (searchInterval) {
	var subnodeIndex = Node.getSubnodeIndex(searchInterval, this.centre);
	if (subnodeIndex !== -1) {
		var node = this.getSubnode(subnodeIndex);
		return node.getNode(searchInterval);
	} else {
		return this;
	}
};
Node.prototype.createSubnode = function (index) {
	var min = 0.0;
	var max = 0.0;
	switch (index) {
		case 0:
			min = this.interval.getMin();
			max = this.centre;
			break;
		case 1:
			min = this.centre;
			max = this.interval.getMax();
			break;
	}
	var subInt = new Interval(min, max);
	var node = new Node(subInt, this.level - 1);
	return node;
};
Node.createNode = function (itemInterval) {
	var key = new Key(itemInterval);
	var node = new Node(key.getInterval(), key.getLevel());
	return node;
};
Node.createExpanded = function (node, addInterval) {
	var expandInt = new Interval(addInterval);
	if (node !== null) expandInt.expandToInclude(node.interval);
	var largerNode = Node.createNode(expandInt);
	if (node !== null) largerNode.insert(node);
	return largerNode;
};

