function NodedSegmentString(pts, data) {
	this.nodeList = new SegmentNodeList(this);
	this.pts = null;
	this.data = null;
	if (arguments.length === 0) return;
	this.pts = pts;
	this.data = data;
}
module.exports = NodedSegmentString
var SegmentNodeList = require('com/vividsolutions/jts/noding/SegmentNodeList');
var WKTWriter = require('com/vividsolutions/jts/io/WKTWriter');
var CoordinateArraySequence = require('com/vividsolutions/jts/geom/impl/CoordinateArraySequence');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Octant = require('com/vividsolutions/jts/noding/Octant');
var ArrayList = require('java/util/ArrayList');
NodedSegmentString.prototype.getCoordinates = function () {
	return this.pts;
};
NodedSegmentString.prototype.size = function () {
	return this.pts.length;
};
NodedSegmentString.prototype.getCoordinate = function (i) {
	return this.pts[i];
};
NodedSegmentString.prototype.isClosed = function () {
	return this.pts[0].equals(this.pts[this.pts.length - 1]);
};
NodedSegmentString.prototype.getSegmentOctant = function (index) {
	if (index === this.pts.length - 1) return -1;
	return this.safeOctant(this.getCoordinate(index), this.getCoordinate(index + 1));
};
NodedSegmentString.prototype.setData = function (data) {
	this.data = data;
};
NodedSegmentString.prototype.safeOctant = function (p0, p1) {
	if (p0.equals2D(p1)) return 0;
	return Octant.octant(p0, p1);
};
NodedSegmentString.prototype.getData = function () {
	return this.data;
};
NodedSegmentString.prototype.addIntersection = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [intPt, segmentIndex] = args;
				this.addIntersectionNode(intPt, segmentIndex);
			})(...args);
		case 4:
			return ((...args) => {
				let [li, segmentIndex, geomIndex, intIndex] = args;
				var intPt = new Coordinate(li.getIntersection(intIndex));
				this.addIntersection(intPt, segmentIndex);
			})(...args);
	}
};
NodedSegmentString.prototype.toString = function () {
	return WKTWriter.toLineString(new CoordinateArraySequence(this.pts));
};
NodedSegmentString.prototype.getNodeList = function () {
	return this.nodeList;
};
NodedSegmentString.prototype.addIntersectionNode = function (intPt, segmentIndex) {
	var normalizedSegmentIndex = segmentIndex;
	var nextSegIndex = normalizedSegmentIndex + 1;
	if (nextSegIndex < this.pts.length) {
		var nextPt = this.pts[nextSegIndex];
		if (intPt.equals2D(nextPt)) {
			normalizedSegmentIndex = nextSegIndex;
		}
	}
	var ei = this.nodeList.add(intPt, normalizedSegmentIndex);
	return ei;
};
NodedSegmentString.prototype.addIntersections = function (li, segmentIndex, geomIndex) {
	for (var i = 0; i < li.getIntersectionNum(); i++) {
		this.addIntersection(li, segmentIndex, geomIndex, i);
	}
};
NodedSegmentString.getNodedSubstrings = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [segStrings, resultEdgelist] = args;
				for (var i = segStrings.iterator(); i.hasNext(); ) {
					var ss = i.next();
					ss.getNodeList().addSplitEdges(resultEdgelist);
				}
			})(...args);
		case 1:
			return ((...args) => {
				let [segStrings] = args;
				var resultEdgelist = new ArrayList();
				NodedSegmentString.getNodedSubstrings(segStrings, resultEdgelist);
				return resultEdgelist;
			})(...args);
	}
};

