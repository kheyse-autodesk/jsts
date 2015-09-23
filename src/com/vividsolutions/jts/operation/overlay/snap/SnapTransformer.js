function SnapTransformer(...args) {
	this.snapTolerance = null;
	this.snapPts = null;
	this.isSelfSnap = false;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [snapTolerance, snapPts] = args;
				this.snapTolerance = snapTolerance;
				this.snapPts = snapPts;
			})(...args);
		case 3:
			return ((...args) => {
				let [snapTolerance, snapPts, isSelfSnap] = args;
				this.snapTolerance = snapTolerance;
				this.snapPts = snapPts;
				this.isSelfSnap = isSelfSnap;
			})(...args);
	}
}
module.exports = SnapTransformer
var GeometryTransformer = require('com/vividsolutions/jts/geom/util/GeometryTransformer');
var util = require('util');
util.inherits(SnapTransformer, GeometryTransformer)
var LineStringSnapper = require('com/vividsolutions/jts/operation/overlay/snap/LineStringSnapper');
SnapTransformer.prototype.snapLine = function (srcPts, snapPts) {
	var snapper = new LineStringSnapper(srcPts, this.snapTolerance);
	snapper.setAllowSnappingToSourceVertices(this.isSelfSnap);
	return snapper.snapTo(snapPts);
};
SnapTransformer.prototype.transformCoordinates = function (coords, parent) {
	var srcPts = coords.toCoordinateArray();
	var newPts = this.snapLine(srcPts, this.snapPts);
	return this.factory.getCoordinateSequenceFactory().create(newPts);
};

