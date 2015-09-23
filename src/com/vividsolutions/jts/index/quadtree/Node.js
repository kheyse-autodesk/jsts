function Node(env, level) {
	this.env = null;
	this.centrex = null;
	this.centrey = null;
	this.level = null;
	if (arguments.length === 0) return;
	this.env = env;
	this.level = level;
	this.centrex = (env.getMinX() + env.getMaxX()) / 2;
	this.centrey = (env.getMinY() + env.getMaxY()) / 2;
}
module.exports = Node
var NodeBase = require('com/vividsolutions/jts/index/quadtree/NodeBase');
var util = require('util');
util.inherits(Node, NodeBase)
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
var Assert = require('com/vividsolutions/jts/util/Assert');
var Key = require('com/vividsolutions/jts/index/quadtree/Key');
Node.prototype.find = function (searchEnv) {
	var subnodeIndex = Node.getSubnodeIndex(searchEnv, this.centrex, this.centrey);
	if (subnodeIndex === -1) return this;
	if (this.subnode[subnodeIndex] !== null) {
		var node = this.subnode[subnodeIndex];
		return node.find(searchEnv);
	}
	return this;
};
Node.prototype.isSearchMatch = function (searchEnv) {
	return this.env.intersects(searchEnv);
};
Node.prototype.getSubnode = function (index) {
	if (this.subnode[index] === null) {
		this.subnode[index] = this.createSubnode(index);
	}
	return this.subnode[index];
};
Node.prototype.getEnvelope = function () {
	return this.env;
};
Node.prototype.getNode = function (searchEnv) {
	var subnodeIndex = Node.getSubnodeIndex(searchEnv, this.centrex, this.centrey);
	if (subnodeIndex !== -1) {
		var node = this.getSubnode(subnodeIndex);
		return node.getNode(searchEnv);
	} else {
		return this;
	}
};
Node.prototype.createSubnode = function (index) {
	var minx = 0.0;
	var maxx = 0.0;
	var miny = 0.0;
	var maxy = 0.0;
	switch (index) {
		case 0:
			minx = this.env.getMinX();
			maxx = this.centrex;
			miny = this.env.getMinY();
			maxy = this.centrey;
			break;
		case 1:
			minx = this.centrex;
			maxx = this.env.getMaxX();
			miny = this.env.getMinY();
			maxy = this.centrey;
			break;
		case 2:
			minx = this.env.getMinX();
			maxx = this.centrex;
			miny = this.centrey;
			maxy = this.env.getMaxY();
			break;
		case 3:
			minx = this.centrex;
			maxx = this.env.getMaxX();
			miny = this.centrey;
			maxy = this.env.getMaxY();
			break;
	}
	var sqEnv = new Envelope(minx, maxx, miny, maxy);
	var node = new Node(sqEnv, this.level - 1);
	return node;
};
Node.prototype.insertNode = function (node) {
	Assert.isTrue(this.env === null || this.env.contains(node.env));
	var index = Node.getSubnodeIndex(node.env, this.centrex, this.centrey);
	if (node.level === this.level - 1) {
		this.subnode[index] = node;
	} else {
		var childNode = this.createSubnode(index);
		childNode.insertNode(node);
		this.subnode[index] = childNode;
	}
};
Node.createNode = function (env) {
	var key = new Key(env);
	var node = new Node(key.getEnvelope(), key.getLevel());
	return node;
};
Node.createExpanded = function (node, addEnv) {
	var expandEnv = new Envelope(addEnv);
	if (node !== null) expandEnv.expandToInclude(node.env);
	var largerNode = Node.createNode(expandEnv);
	if (node !== null) largerNode.insertNode(node);
	return largerNode;
};

