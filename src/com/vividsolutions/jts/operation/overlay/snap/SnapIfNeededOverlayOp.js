function SnapIfNeededOverlayOp(g1, g2) {
	this.geom = [];
	if (arguments.length === 0) return;
	this.geom[0] = g1;
	this.geom[1] = g2;
}
module.exports = SnapIfNeededOverlayOp
var SnapOverlayOp = require('com/vividsolutions/jts/operation/overlay/snap/SnapOverlayOp');
var RuntimeException = require('java/lang/RuntimeException');
var OverlayOp = require('com/vividsolutions/jts/operation/overlay/OverlayOp');
SnapIfNeededOverlayOp.prototype.getResultGeometry = function (opCode) {
	var result = null;
	var isSuccess = false;
	var savedException = null;
	try {
		result = OverlayOp.overlayOp(this.geom[0], this.geom[1], opCode);
		var isValid = true;
		if (isValid) isSuccess = true;
	} catch (e) {
		if (e instanceof RuntimeException) {
			savedException = ex;
		}
	} finally {}
	if (!isSuccess) {
		try {
			result = SnapOverlayOp.overlayOp(this.geom[0], this.geom[1], opCode);
		} catch (e) {
			if (e instanceof RuntimeException) {
				throw savedException;
			}
		} finally {}
	}
	return result;
};
SnapIfNeededOverlayOp.overlayOp = function (g0, g1, opCode) {
	var op = new SnapIfNeededOverlayOp(g0, g1);
	return op.getResultGeometry(opCode);
};
SnapIfNeededOverlayOp.union = function (g0, g1) {
	return SnapIfNeededOverlayOp.overlayOp(g0, g1, OverlayOp.UNION);
};
SnapIfNeededOverlayOp.intersection = function (g0, g1) {
	return SnapIfNeededOverlayOp.overlayOp(g0, g1, OverlayOp.INTERSECTION);
};
SnapIfNeededOverlayOp.symDifference = function (g0, g1) {
	return SnapIfNeededOverlayOp.overlayOp(g0, g1, OverlayOp.SYMDIFFERENCE);
};
SnapIfNeededOverlayOp.difference = function (g0, g1) {
	return SnapIfNeededOverlayOp.overlayOp(g0, g1, OverlayOp.DIFFERENCE);
};

