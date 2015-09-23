function GeometrySnapper(srcGeom) {
	this.srcGeom = null;
	if (arguments.length === 0) return;
	this.srcGeom = srcGeom;
}
module.exports = GeometrySnapper
var TreeSet = require('java/util/TreeSet');
var SnapTransformer = require('com/vividsolutions/jts/operation/overlay/snap/SnapTransformer');
var Double = require('java/lang/Double');
var PrecisionModel = require('com/vividsolutions/jts/geom/PrecisionModel');
var Polygonal = require('com/vividsolutions/jts/geom/Polygonal');
GeometrySnapper.prototype.snapTo = function (snapGeom, snapTolerance) {
	var snapPts = this.extractTargetCoordinates(snapGeom);
	var snapTrans = new SnapTransformer(snapTolerance, snapPts);
	return snapTrans.transform(this.srcGeom);
};
GeometrySnapper.prototype.snapToSelf = function (snapTolerance, cleanResult) {
	var snapPts = this.extractTargetCoordinates(this.srcGeom);
	var snapTrans = new SnapTransformer(snapTolerance, snapPts, true);
	var snappedGeom = snapTrans.transform(this.srcGeom);
	var result = snappedGeom;
	if (cleanResult && result instanceof Polygonal) {
		result = snappedGeom.buffer(0);
	}
	return result;
};
GeometrySnapper.prototype.computeSnapTolerance = function (ringPts) {
	var minSegLen = this.computeMinimumSegmentLength(ringPts);
	var snapTol = minSegLen / 10;
	return snapTol;
};
GeometrySnapper.prototype.extractTargetCoordinates = function (g) {
	var ptSet = new TreeSet();
	var pts = g.getCoordinates();
	for (var i = 0; i < pts.length; i++) {
		ptSet.add(pts[i]);
	}
	return ptSet.toArray([]);
};
GeometrySnapper.prototype.computeMinimumSegmentLength = function (pts) {
	var minSegLen = Double.MAX_VALUE;
	for (var i = 0; i < pts.length - 1; i++) {
		var segLen = pts[i].distance(pts[i + 1]);
		if (segLen < minSegLen) minSegLen = segLen;
	}
	return minSegLen;
};
GeometrySnapper.snap = function (g0, g1, snapTolerance) {
	var snapGeom = [];
	var snapper0 = new GeometrySnapper(g0);
	snapGeom[0] = snapper0.snapTo(g1, snapTolerance);
	var snapper1 = new GeometrySnapper(g1);
	snapGeom[1] = snapper1.snapTo(snapGeom[0], snapTolerance);
	return snapGeom;
};
GeometrySnapper.computeOverlaySnapTolerance = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [g0, g1] = args;
				return Math.min(GeometrySnapper.computeOverlaySnapTolerance(g0), GeometrySnapper.computeOverlaySnapTolerance(g1));
			})(...args);
		case 1:
			return ((...args) => {
				let [g] = args;
				var snapTolerance = GeometrySnapper.computeSizeBasedSnapTolerance(g);
				var pm = g.getPrecisionModel();
				if (pm.getType() === PrecisionModel.FIXED) {
					var fixedSnapTol = 1 / pm.getScale() * 2 / 1.415;
					if (fixedSnapTol > snapTolerance) snapTolerance = fixedSnapTol;
				}
				return snapTolerance;
			})(...args);
	}
};
GeometrySnapper.computeSizeBasedSnapTolerance = function (g) {
	var env = g.getEnvelopeInternal();
	var minDimension = Math.min(env.getHeight(), env.getWidth());
	var snapTol = minDimension * GeometrySnapper.SNAP_PRECISION_FACTOR;
	return snapTol;
};
GeometrySnapper.snapToSelf = function (geom, snapTolerance, cleanResult) {
	var snapper0 = new GeometrySnapper(geom);
	return snapper0.snapToSelf(snapTolerance, cleanResult);
};
GeometrySnapper.SNAP_PRECISION_FACTOR = 1e-9;

