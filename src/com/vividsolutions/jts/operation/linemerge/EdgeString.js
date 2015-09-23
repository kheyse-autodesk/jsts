function EdgeString(factory) {
	this.factory = null;
	this.directedEdges = new ArrayList();
	this.coordinates = null;
	if (arguments.length === 0) return;
	this.factory = factory;
}
module.exports = EdgeString
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var ArrayList = require('java/util/ArrayList');
EdgeString.prototype.getCoordinates = function () {
	if (this.coordinates === null) {
		var forwardDirectedEdges = 0;
		var reverseDirectedEdges = 0;
		var coordinateList = new CoordinateList();
		for (var i = this.directedEdges.iterator(); i.hasNext(); ) {
			var directedEdge = i.next();
			if (directedEdge.getEdgeDirection()) {
				forwardDirectedEdges++;
			} else {
				reverseDirectedEdges++;
			}
			coordinateList.add(directedEdge.getEdge().getLine().getCoordinates(), false, directedEdge.getEdgeDirection());
		}
		this.coordinates = coordinateList.toCoordinateArray();
		if (reverseDirectedEdges > forwardDirectedEdges) {
			CoordinateArrays.reverse(this.coordinates);
		}
	}
	return this.coordinates;
};
EdgeString.prototype.toLineString = function () {
	return this.factory.createLineString(this.getCoordinates());
};
EdgeString.prototype.add = function (directedEdge) {
	this.directedEdges.add(directedEdge);
};

