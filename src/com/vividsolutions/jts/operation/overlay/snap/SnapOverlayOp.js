function SnapOverlayOp(g1, g2) {
	this.geom = [];
	this.snapTolerance = null;
	this.cbr = null;
	if (arguments.length === 0) return;
	this.geom[0] = g1;
	this.geom[1] = g2;
	this.computeSnapTolerance();
}
module.exports = SnapOverlayOp
var GeometrySnapper = require('com/vividsolutions/jts/operation/overlay/snap/GeometrySnapper');
var CommonBitsRemover = require('com/vividsolutions/jts/precision/CommonBitsRemover');
var OverlayOp = require('com/vividsolutions/jts/operation/overlay/OverlayOp');
SnapOverlayOp.prototype.selfSnap = function (geom) {
	var snapper0 = new GeometrySnapper(geom);
	var snapGeom = snapper0.snapTo(geom, this.snapTolerance);
	return snapGeom;
};
SnapOverlayOp.prototype.removeCommonBits = function (geom) {
	this.cbr = new CommonBitsRemover();
	this.cbr.add(geom[0]);
	this.cbr.add(geom[1]);
	var remGeom = [];
	remGeom[0] = this.cbr.removeCommonBits(geom[0].clone());
	remGeom[1] = this.cbr.removeCommonBits(geom[1].clone());
	return remGeom;
};
SnapOverlayOp.prototype.prepareResult = function (geom) {
	this.cbr.addCommonBits(geom);
	return geom;
};
SnapOverlayOp.prototype.getResultGeometry = function (opCode) {
	var prepGeom = this.snap(this.geom);
	var result = OverlayOp.overlayOp(prepGeom[0], prepGeom[1], opCode);
	return this.prepareResult(result);
};
SnapOverlayOp.prototype.checkValid = function (g) {
	if (!g.isValid()) {
		System.out.println("Snapped geometry is invalid");
	}
};
SnapOverlayOp.prototype.computeSnapTolerance = function () {
	this.snapTolerance = GeometrySnapper.computeOverlaySnapTolerance(this.geom[0], this.geom[1]);
};
SnapOverlayOp.prototype.snap = function (geom) {
	var remGeom = this.removeCommonBits(geom);
	var snapGeom = GeometrySnapper.snap(remGeom[0], remGeom[1], this.snapTolerance);
	return snapGeom;
};
SnapOverlayOp.overlayOp = function (g0, g1, opCode) {
	var op = new SnapOverlayOp(g0, g1);
	return op.getResultGeometry(opCode);
};
SnapOverlayOp.union = function (g0, g1) {
	return SnapOverlayOp.overlayOp(g0, g1, OverlayOp.UNION);
};
SnapOverlayOp.intersection = function (g0, g1) {
	return SnapOverlayOp.overlayOp(g0, g1, OverlayOp.INTERSECTION);
};
SnapOverlayOp.symDifference = function (g0, g1) {
	return SnapOverlayOp.overlayOp(g0, g1, OverlayOp.SYMDIFFERENCE);
};
SnapOverlayOp.difference = function (g0, g1) {
	return SnapOverlayOp.overlayOp(g0, g1, OverlayOp.DIFFERENCE);
};

