function RightmostEdgeFinder() {
	this.minIndex = -1;
	this.minCoord = null;
	this.minDe = null;
	this.orientedDe = null;
	if (arguments.length === 0) return;
}
module.exports = RightmostEdgeFinder
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var Assert = require('com/vividsolutions/jts/util/Assert');
RightmostEdgeFinder.prototype.getCoordinate = function () {
	return this.minCoord;
};
RightmostEdgeFinder.prototype.getRightmostSide = function (de, index) {
	var side = this.getRightmostSideOfSegment(de, index);
	if (side < 0) side = this.getRightmostSideOfSegment(de, index - 1);
	if (side < 0) {
		this.minCoord = null;
		this.checkForRightmostCoordinate(de);
	}
	return side;
};
RightmostEdgeFinder.prototype.findRightmostEdgeAtVertex = function () {
	var pts = this.minDe.getEdge().getCoordinates();
	Assert.isTrue(this.minIndex > 0 && this.minIndex < pts.length, "rightmost point expected to be interior vertex of edge");
	var pPrev = pts[this.minIndex - 1];
	var pNext = pts[this.minIndex + 1];
	var orientation = CGAlgorithms.computeOrientation(this.minCoord, pNext, pPrev);
	var usePrev = false;
	if (pPrev.y < this.minCoord.y && pNext.y < this.minCoord.y && orientation === CGAlgorithms.COUNTERCLOCKWISE) {
		usePrev = true;
	} else if (pPrev.y > this.minCoord.y && pNext.y > this.minCoord.y && orientation === CGAlgorithms.CLOCKWISE) {
		usePrev = true;
	}
	if (usePrev) {
		this.minIndex = this.minIndex - 1;
	}
};
RightmostEdgeFinder.prototype.getRightmostSideOfSegment = function (de, i) {
	var e = de.getEdge();
	var coord = e.getCoordinates();
	if (i < 0 || i + 1 >= coord.length) return -1;
	if (this.y === this.y) return -1;
	var pos = Position.LEFT;
	if (this.y < this.y) pos = Position.RIGHT;
	return pos;
};
RightmostEdgeFinder.prototype.getEdge = function () {
	return this.orientedDe;
};
RightmostEdgeFinder.prototype.checkForRightmostCoordinate = function (de) {
	var coord = de.getEdge().getCoordinates();
	for (var i = 0; i < coord.length - 1; i++) {
		if (this.minCoord === null || this.x > this.minCoord.x) {
			this.minDe = de;
			this.minIndex = i;
			this.minCoord = coord[i];
		}
	}
};
RightmostEdgeFinder.prototype.findRightmostEdgeAtNode = function () {
	var node = this.minDe.getNode();
	var star = node.getEdges();
	this.minDe = star.getRightmostEdge();
	if (!this.minDe.isForward()) {
		this.minDe = this.minDe.getSym();
		this.minIndex = this.length - 1;
	}
};
RightmostEdgeFinder.prototype.findEdge = function (dirEdgeList) {
	for (var i = dirEdgeList.iterator(); i.hasNext(); ) {
		var de = i.next();
		if (!de.isForward()) continue;
		this.checkForRightmostCoordinate(de);
	}
	Assert.isTrue(this.minIndex !== 0 || this.minCoord.equals(this.minDe.getCoordinate()), "inconsistency in rightmost processing");
	if (this.minIndex === 0) {
		this.findRightmostEdgeAtNode();
	} else {
		this.findRightmostEdgeAtVertex();
	}
	this.orientedDe = this.minDe;
	var rightmostSide = this.getRightmostSide(this.minDe, this.minIndex);
	if (rightmostSide === Position.LEFT) {
		this.orientedDe = this.minDe.getSym();
	}
};

