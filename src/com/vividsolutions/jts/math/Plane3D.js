function Plane3D(normal, basePt) {
	this.normal = null;
	this.basePt = null;
	if (arguments.length === 0) return;
	this.normal = normal;
	this.basePt = basePt;
}
module.exports = Plane3D
var Double = require('java/lang/Double');
var Vector3D = require('com/vividsolutions/jts/math/Vector3D');
Plane3D.prototype.closestAxisPlane = function () {
	var xmag = Math.abs(this.normal.getX());
	var ymag = Math.abs(this.normal.getY());
	var zmag = Math.abs(this.normal.getZ());
	if (xmag > ymag) {
		if (xmag > zmag) return Plane3D.YZ_PLANE; else return Plane3D.XY_PLANE;
	} else if (zmag > ymag) {
		return Plane3D.XY_PLANE;
	}
	return Plane3D.XZ_PLANE;
};
Plane3D.prototype.orientedDistance = function (p) {
	var pb = new Vector3D(p, this.basePt);
	var pbdDotNormal = pb.dot(this.normal);
	if (Double.isNaN(pbdDotNormal)) throw new IllegalArgumentException("3D Coordinate has NaN ordinate");
	var d = pbdDotNormal / this.normal.length();
	return d;
};
Plane3D.XY_PLANE = 1;
Plane3D.YZ_PLANE = 2;
Plane3D.XZ_PLANE = 3;

