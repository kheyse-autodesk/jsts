function GeometryNoder(pm) {
	this.geomFact = null;
	this.pm = null;
	this.isValidityChecked = false;
	if (arguments.length === 0) return;
	this.pm = pm;
}
module.exports = GeometryNoder
var NodingValidator = require('com/vividsolutions/jts/noding/NodingValidator');
var NodedSegmentString = require('com/vividsolutions/jts/noding/NodedSegmentString');
var ArrayList = require('java/util/ArrayList');
var LinearComponentExtracter = require('com/vividsolutions/jts/geom/util/LinearComponentExtracter');
var MCIndexSnapRounder = require('com/vividsolutions/jts/noding/snapround/MCIndexSnapRounder');
GeometryNoder.prototype.extractLines = function (geoms) {
	var lines = new ArrayList();
	var lce = new LinearComponentExtracter(lines);
	for (var it = geoms.iterator(); it.hasNext(); ) {
		var geom = it.next();
		geom.apply(lce);
	}
	return lines;
};
GeometryNoder.prototype.setValidate = function (isValidityChecked) {
	this.isValidityChecked = isValidityChecked;
};
GeometryNoder.prototype.node = function (geoms) {
	var geom0 = geoms.iterator().next();
	this.geomFact = geom0.getFactory();
	var segStrings = this.toSegmentStrings(this.extractLines(geoms));
	var sr = new MCIndexSnapRounder(this.pm);
	sr.computeNodes(segStrings);
	var nodedLines = sr.getNodedSubstrings();
	if (this.isValidityChecked) {
		var nv = new NodingValidator(nodedLines);
		nv.checkValid();
	}
	return this.toLineStrings(nodedLines);
};
GeometryNoder.prototype.toSegmentStrings = function (lines) {
	var segStrings = new ArrayList();
	for (var it = lines.iterator(); it.hasNext(); ) {
		var line = it.next();
		segStrings.add(new NodedSegmentString(line.getCoordinates(), null));
	}
	return segStrings;
};
GeometryNoder.prototype.toLineStrings = function (segStrings) {
	var lines = new ArrayList();
	for (var it = segStrings.iterator(); it.hasNext(); ) {
		var ss = it.next();
		if (ss.size() < 2) continue;
		lines.add(this.geomFact.createLineString(ss.getCoordinates()));
	}
	return lines;
};

