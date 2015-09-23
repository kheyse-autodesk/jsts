function RelateNode(coord, edges) {
	if (arguments.length === 0) return;
	RelateNode.super_.call(this, coord, edges);
}
module.exports = RelateNode
var Node = require('com/vividsolutions/jts/geomgraph/Node');
var util = require('util');
util.inherits(RelateNode, Node)
RelateNode.prototype.updateIMFromEdges = function (im) {
	this.edges.updateIM(im);
};
RelateNode.prototype.computeIM = function (im) {
	im.setAtLeastIfValid(this.label.getLocation(0), this.label.getLocation(1), 0);
};

