function Densifier(inputGeom) {
	this.inputGeom = null;
	this.distanceTolerance = null;
	if (arguments.length === 0) return;
	this.inputGeom = inputGeom;
}
module.exports = Densifier
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
Densifier.prototype.getResultGeometry = function () {
	return new DensifyTransformer().transform(this.inputGeom);
};
Densifier.prototype.setDistanceTolerance = function (distanceTolerance) {
	if (distanceTolerance <= 0.0) throw new IllegalArgumentException("Tolerance must be positive");
	this.distanceTolerance = distanceTolerance;
};
Densifier.densifyPoints = function (pts, distanceTolerance, precModel) {
	var seg = new LineSegment();
	var coordList = new CoordinateList();
	for (var i = 0; i < pts.length - 1; i++) {
		seg.p0 = pts[i];
		seg.p1 = pts[i + 1];
		coordList.add(seg.p0, false);
		var len = seg.getLength();
		var densifiedSegCount = len / distanceTolerance + 1;
		if (densifiedSegCount > 1) {
			var densifiedSegLen = len / densifiedSegCount;
			for (var j = 1; j < densifiedSegCount; j++) {
				var segFract = j * densifiedSegLen / len;
				var p = seg.pointAlong(segFract);
				precModel.makePrecise(p);
				coordList.add(p, false);
			}
		}
	}
	coordList.add(pts[pts.length - 1], false);
	return coordList.toCoordinateArray();
};
Densifier.densify = function (geom, distanceTolerance) {
	var densifier = new Densifier(geom);
	densifier.setDistanceTolerance(distanceTolerance);
	return densifier.getResultGeometry();
};

