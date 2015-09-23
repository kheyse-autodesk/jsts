function PolygonizeEdge(line) {
	this.line = null;
	if (arguments.length === 0) return;
	this.line = line;
}
module.exports = PolygonizeEdge
var Edge = require('com/vividsolutions/jts/planargraph/Edge');
var util = require('util');
util.inherits(PolygonizeEdge, Edge)
PolygonizeEdge.prototype.getLine = function () {
	return this.line;
};

