function NodeFactory() {}
module.exports = NodeFactory
var Node = require('com/vividsolutions/jts/geomgraph/Node');
NodeFactory.prototype.createNode = function (coord) {
	return new Node(coord, null);
};

