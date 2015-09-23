function OverlayNodeFactory() {}
module.exports = OverlayNodeFactory
var NodeFactory = require('com/vividsolutions/jts/geomgraph/NodeFactory');
var util = require('util');
util.inherits(OverlayNodeFactory, NodeFactory)
var DirectedEdgeStar = require('com/vividsolutions/jts/geomgraph/DirectedEdgeStar');
var Node = require('com/vividsolutions/jts/geomgraph/Node');
OverlayNodeFactory.prototype.createNode = function (coord) {
	return new Node(coord, new DirectedEdgeStar());
};

