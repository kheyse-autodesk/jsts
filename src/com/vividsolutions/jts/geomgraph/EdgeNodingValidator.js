function EdgeNodingValidator(edges) {
	this.nv = null;
	if (arguments.length === 0) return;
	this.nv = new FastNodingValidator(EdgeNodingValidator.toSegmentStrings(edges));
}
module.exports = EdgeNodingValidator
var BasicSegmentString = require('com/vividsolutions/jts/noding/BasicSegmentString');
var FastNodingValidator = require('com/vividsolutions/jts/noding/FastNodingValidator');
var ArrayList = require('java/util/ArrayList');
EdgeNodingValidator.prototype.checkValid = function () {
	this.nv.checkValid();
};
EdgeNodingValidator.toSegmentStrings = function (edges) {
	var segStrings = new ArrayList();
	for (var i = edges.iterator(); i.hasNext(); ) {
		var e = i.next();
		segStrings.add(new BasicSegmentString(e.getCoordinates(), e));
	}
	return segStrings;
};
EdgeNodingValidator.checkValid = function (edges) {
	var validator = new EdgeNodingValidator(edges);
	validator.checkValid();
};

