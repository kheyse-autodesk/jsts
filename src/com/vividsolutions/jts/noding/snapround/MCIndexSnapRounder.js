function MCIndexSnapRounder(pm) {
	this.pm = null;
	this.li = null;
	this.scaleFactor = null;
	this.noder = null;
	this.pointSnapper = null;
	this.nodedSegStrings = null;
	if (arguments.length === 0) return;
	this.pm = pm;
	this.li = new RobustLineIntersector();
	this.li.setPrecisionModel(pm);
	this.scaleFactor = pm.getScale();
}
module.exports = MCIndexSnapRounder
var NodingValidator = require('com/vividsolutions/jts/noding/NodingValidator');
var Collection = require('java/util/Collection');
var MCIndexNoder = require('com/vividsolutions/jts/noding/MCIndexNoder');
var NodedSegmentString = require('com/vividsolutions/jts/noding/NodedSegmentString');
var HotPixel = require('com/vividsolutions/jts/noding/snapround/HotPixel');
var Exception = require('java/lang/Exception');
var MCIndexPointSnapper = require('com/vividsolutions/jts/noding/snapround/MCIndexPointSnapper');
var RobustLineIntersector = require('com/vividsolutions/jts/algorithm/RobustLineIntersector');
var InteriorIntersectionFinderAdder = require('com/vividsolutions/jts/noding/InteriorIntersectionFinderAdder');
MCIndexSnapRounder.prototype.checkCorrectness = function (inputSegmentStrings) {
	var resultSegStrings = NodedSegmentString.getNodedSubstrings(inputSegmentStrings);
	var nv = new NodingValidator(resultSegStrings);
	try {
		nv.checkValid();
	} catch (e) {
		if (e instanceof Exception) {
			ex.printStackTrace();
		}
	} finally {}
};
MCIndexSnapRounder.prototype.getNodedSubstrings = function () {
	return NodedSegmentString.getNodedSubstrings(this.nodedSegStrings);
};
MCIndexSnapRounder.prototype.snapRound = function (segStrings, li) {
	var intersections = this.findInteriorIntersections(segStrings, li);
	this.computeIntersectionSnaps(intersections);
	this.computeVertexSnaps(segStrings);
};
MCIndexSnapRounder.prototype.findInteriorIntersections = function (segStrings, li) {
	var intFinderAdder = new InteriorIntersectionFinderAdder(li);
	this.noder.setSegmentIntersector(intFinderAdder);
	this.noder.computeNodes(segStrings);
	return intFinderAdder.getInteriorIntersections();
};
MCIndexSnapRounder.prototype.computeVertexSnaps = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Collection) {
				return ((...args) => {
					let [edges] = args;
					for (var i0 = edges.iterator(); i0.hasNext(); ) {
						var edge0 = i0.next();
						this.computeVertexSnaps(edge0);
					}
				})(...args);
			} else if (args[0] instanceof NodedSegmentString) {
				return ((...args) => {
					let [e] = args;
					var pts0 = e.getCoordinates();
					for (var i = 0; i < pts0.length; i++) {
						var hotPixel = new HotPixel(pts0[i], this.scaleFactor, this.li);
						var isNodeAdded = this.pointSnapper.snap(hotPixel, e, i);
						if (isNodeAdded) {
							e.addIntersection(pts0[i], i);
						}
					}
				})(...args);
			}
	}
};
MCIndexSnapRounder.prototype.computeNodes = function (inputSegmentStrings) {
	this.nodedSegStrings = inputSegmentStrings;
	this.noder = new MCIndexNoder();
	this.pointSnapper = new MCIndexPointSnapper(this.noder.getIndex());
	this.snapRound(inputSegmentStrings, this.li);
};
MCIndexSnapRounder.prototype.computeIntersectionSnaps = function (snapPts) {
	for (var it = snapPts.iterator(); it.hasNext(); ) {
		var snapPt = it.next();
		var hotPixel = new HotPixel(snapPt, this.scaleFactor, this.li);
		this.pointSnapper.snap(hotPixel);
	}
};

