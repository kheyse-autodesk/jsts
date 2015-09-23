function RelateNodeFactory() {}
module.exports = RelateNodeFactory
var NodeFactory = require('com/vividsolutions/jts/geomgraph/NodeFactory');
var util = require('util');
util.inherits(RelateNodeFactory, NodeFactory)
var EdgeEndBundleStar = require('com/vividsolutions/jts/operation/relate/EdgeEndBundleStar');
var RelateNode = require('com/vividsolutions/jts/operation/relate/RelateNode');
RelateNodeFactory.prototype.createNode = function (coord) {
	return new RelateNode(coord, new EdgeEndBundleStar());
};

