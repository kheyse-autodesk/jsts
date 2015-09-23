function LineMergeEdge(line) {
	this.line = null;
	if (arguments.length === 0) return;
	this.line = line;
}
module.exports = LineMergeEdge
var Edge = require('com/vividsolutions/jts/planargraph/Edge');
var util = require('util');
util.inherits(LineMergeEdge, Edge)
LineMergeEdge.prototype.getLine = function () {
	return this.line;
};

