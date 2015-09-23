function FastNodingValidator(segStrings) {
	this.li = new RobustLineIntersector();
	this.segStrings = null;
	this.findAllIntersections = false;
	this.segInt = null;
	this.isValid = true;
	if (arguments.length === 0) return;
	this.segStrings = segStrings;
}
module.exports = FastNodingValidator
var WKTWriter = require('com/vividsolutions/jts/io/WKTWriter');
var MCIndexNoder = require('com/vividsolutions/jts/noding/MCIndexNoder');
var TopologyException = require('com/vividsolutions/jts/geom/TopologyException');
var RobustLineIntersector = require('com/vividsolutions/jts/algorithm/RobustLineIntersector');
var InteriorIntersectionFinder = require('com/vividsolutions/jts/noding/InteriorIntersectionFinder');
FastNodingValidator.prototype.execute = function () {
	if (this.segInt !== null) return null;
	this.checkInteriorIntersections();
};
FastNodingValidator.prototype.getIntersections = function () {
	return this.segInt.getIntersections();
};
FastNodingValidator.prototype.isValid = function () {
	this.execute();
	return this.isValid;
};
FastNodingValidator.prototype.setFindAllIntersections = function (findAllIntersections) {
	this.findAllIntersections = findAllIntersections;
};
FastNodingValidator.prototype.checkInteriorIntersections = function () {
	this.isValid = true;
	this.segInt = new InteriorIntersectionFinder(this.li);
	this.segInt.setFindAllIntersections(this.findAllIntersections);
	var noder = new MCIndexNoder();
	noder.setSegmentIntersector(this.segInt);
	noder.computeNodes(this.segStrings);
	if (this.segInt.hasIntersection()) {
		this.isValid = false;
		return null;
	}
};
FastNodingValidator.prototype.checkValid = function () {
	this.execute();
	if (!this.isValid) throw new TopologyException(this.getErrorMessage(), this.segInt.getInteriorIntersection());
};
FastNodingValidator.prototype.getErrorMessage = function () {
	if (this.isValid) return "no intersections found";
	var intSegs = this.segInt.getIntersectionSegments();
	return "found non-noded intersection between " + WKTWriter.toLineString(intSegs[0], intSegs[1]) + " and " + WKTWriter.toLineString(intSegs[2], intSegs[3]);
};
FastNodingValidator.computeIntersections = function (segStrings) {
	var nv = new FastNodingValidator(segStrings);
	nv.setFindAllIntersections(true);
	nv.isValid();
	return nv.getIntersections();
};

