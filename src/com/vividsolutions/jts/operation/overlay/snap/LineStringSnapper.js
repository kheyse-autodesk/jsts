function LineStringSnapper(...args) {
	this.snapTolerance = 0.0;
	this.srcPts = null;
	this.seg = new LineSegment();
	this.allowSnappingToSourceVertices = false;
	this.isClosed = false;
	switch (args.length) {
		case 2:
			if (args[0] instanceof LineString && !Number.isInteger(args[1])) {
				return ((...args) => {
					let [srcLine, snapTolerance] = args;
					LineStringSnapper.call(this, srcLine.getCoordinates(), snapTolerance);
				})(...args);
			} else if (args[0] instanceof Array && !Number.isInteger(args[1])) {
				return ((...args) => {
					let [srcPts, snapTolerance] = args;
					this.srcPts = srcPts;
					this.isClosed = LineStringSnapper.isClosed(srcPts);
					this.snapTolerance = snapTolerance;
				})(...args);
			}
	}
}
module.exports = LineStringSnapper
var LineString = require('com/vividsolutions/jts/geom/LineString');
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Double = require('java/lang/Double');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
LineStringSnapper.prototype.snapVertices = function (srcCoords, snapPts) {
	var end = this.isClosed ? srcCoords.size() - 1 : srcCoords.size();
	for (var i = 0; i < end; i++) {
		var srcPt = srcCoords.get(i);
		var snapVert = this.findSnapForVertex(srcPt, snapPts);
		if (snapVert !== null) {
			srcCoords.set(i, new Coordinate(snapVert));
			if (i === 0 && this.isClosed) srcCoords.set(srcCoords.size() - 1, new Coordinate(snapVert));
		}
	}
};
LineStringSnapper.prototype.findSnapForVertex = function (pt, snapPts) {
	for (var i = 0; i < snapPts.length; i++) {
		if (pt.equals2D(snapPts[i])) return null;
		if (pt.distance(snapPts[i]) < this.snapTolerance) return snapPts[i];
	}
	return null;
};
LineStringSnapper.prototype.snapTo = function (snapPts) {
	var coordList = new CoordinateList(this.srcPts);
	this.snapVertices(coordList, snapPts);
	this.snapSegments(coordList, snapPts);
	var newPts = coordList.toCoordinateArray();
	return newPts;
};
LineStringSnapper.prototype.snapSegments = function (srcCoords, snapPts) {
	if (snapPts.length === 0) return null;
	var distinctPtCount = snapPts.length;
	if (snapPts[0].equals2D(snapPts[snapPts.length - 1])) distinctPtCount = snapPts.length - 1;
	for (var i = 0; i < distinctPtCount; i++) {
		var snapPt = snapPts[i];
		var index = this.findSegmentIndexToSnap(snapPt, srcCoords);
		if (index >= 0) {
			srcCoords.add(index + 1, new Coordinate(snapPt), false);
		}
	}
};
LineStringSnapper.prototype.findSegmentIndexToSnap = function (snapPt, srcCoords) {
	var minDist = Double.MAX_VALUE;
	var snapIndex = -1;
	for (var i = 0; i < srcCoords.size() - 1; i++) {
		this.seg.p0 = srcCoords.get(i);
		this.seg.p1 = srcCoords.get(i + 1);
		if (this.seg.p0.equals2D(snapPt) || this.seg.p1.equals2D(snapPt)) {
			if (this.allowSnappingToSourceVertices) continue; else return -1;
		}
		var dist = this.seg.distance(snapPt);
		if (dist < this.snapTolerance && dist < minDist) {
			minDist = dist;
			snapIndex = i;
		}
	}
	return snapIndex;
};
LineStringSnapper.prototype.setAllowSnappingToSourceVertices = function (allowSnappingToSourceVertices) {
	this.allowSnappingToSourceVertices = allowSnappingToSourceVertices;
};
LineStringSnapper.isClosed = function (pts) {
	if (pts.length <= 1) return false;
	return pts[0].equals2D(pts[pts.length - 1]);
};

