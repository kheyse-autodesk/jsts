function SimpleSnapRounder(pm) {
	this.pm = null;
	this.li = null;
	this.scaleFactor = null;
	this.nodedSegStrings = null;
	if (arguments.length === 0) return;
	this.pm = pm;
	this.li = new RobustLineIntersector();
	this.li.setPrecisionModel(pm);
	this.scaleFactor = pm.getScale();
}
module.exports = SimpleSnapRounder
var NodingValidator = require('com/vividsolutions/jts/noding/NodingValidator');
var Collection = require('java/util/Collection');
var MCIndexNoder = require('com/vividsolutions/jts/noding/MCIndexNoder');
var NodedSegmentString = require('com/vividsolutions/jts/noding/NodedSegmentString');
var HotPixel = require('com/vividsolutions/jts/noding/snapround/HotPixel');
var Exception = require('java/lang/Exception');
var RobustLineIntersector = require('com/vividsolutions/jts/algorithm/RobustLineIntersector');
var InteriorIntersectionFinderAdder = require('com/vividsolutions/jts/noding/InteriorIntersectionFinderAdder');
SimpleSnapRounder.prototype.checkCorrectness = function (inputSegmentStrings) {
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
SimpleSnapRounder.prototype.getNodedSubstrings = function () {
	return NodedSegmentString.getNodedSubstrings(this.nodedSegStrings);
};
SimpleSnapRounder.prototype.snapRound = function (segStrings, li) {
	var intersections = this.findInteriorIntersections(segStrings, li);
	this.computeSnaps(segStrings, intersections);
	this.computeVertexSnaps(segStrings);
};
SimpleSnapRounder.prototype.findInteriorIntersections = function (segStrings, li) {
	var intFinderAdder = new InteriorIntersectionFinderAdder(li);
	var noder = new MCIndexNoder();
	noder.setSegmentIntersector(intFinderAdder);
	noder.computeNodes(segStrings);
	return intFinderAdder.getInteriorIntersections();
};
SimpleSnapRounder.prototype.computeVertexSnaps = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [e0, e1] = args;
				var pts0 = e0.getCoordinates();
				var pts1 = e1.getCoordinates();
				for (var i0 = 0; i0 < pts0.length - 1; i0++) {
					var hotPixel = new HotPixel(pts0[i0], this.scaleFactor, this.li);
					for (var i1 = 0; i1 < pts1.length - 1; i1++) {
						if (e0 === e1) {
							if (i0 === i1) continue;
						}
						var isNodeAdded = hotPixel.addSnappedNode(e1, i1);
						if (isNodeAdded) {
							e0.addIntersection(pts0[i0], i0);
						}
					}
				}
			})(...args);
		case 1:
			return ((...args) => {
				let [edges] = args;
				for (var i0 = edges.iterator(); i0.hasNext(); ) {
					var edge0 = i0.next();
					for (var i1 = edges.iterator(); i1.hasNext(); ) {
						var edge1 = i1.next();
						this.computeVertexSnaps(edge0, edge1);
					}
				}
			})(...args);
	}
};
SimpleSnapRounder.prototype.computeNodes = function (inputSegmentStrings) {
	this.nodedSegStrings = inputSegmentStrings;
	this.snapRound(inputSegmentStrings, this.li);
};
SimpleSnapRounder.prototype.computeSnaps = function (...args) {
	switch (args.length) {
		case 2:
			if (args[0] instanceof Collection && args[1] instanceof Collection) {
				return ((...args) => {
					let [segStrings, snapPts] = args;
					for (var i0 = segStrings.iterator(); i0.hasNext(); ) {
						var ss = i0.next();
						this.computeSnaps(ss, snapPts);
					}
				})(...args);
			} else if (args[0] instanceof NodedSegmentString && args[1] instanceof Collection) {
				return ((...args) => {
					let [ss, snapPts] = args;
					for (var it = snapPts.iterator(); it.hasNext(); ) {
						var snapPt = it.next();
						var hotPixel = new HotPixel(snapPt, this.scaleFactor, this.li);
						for (var i = 0; i < ss.size() - 1; i++) {
							hotPixel.addSnappedNode(ss, i);
						}
					}
				})(...args);
			}
	}
};

