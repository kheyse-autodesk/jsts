function VWSimplifier(inputGeom) {
	this.inputGeom = null;
	this.distanceTolerance = null;
	this.isEnsureValidTopology = true;
	if (arguments.length === 0) return;
	this.inputGeom = inputGeom;
}
module.exports = VWSimplifier
VWSimplifier.prototype.setEnsureValid = function (isEnsureValidTopology) {
	this.isEnsureValidTopology = isEnsureValidTopology;
};
VWSimplifier.prototype.getResultGeometry = function () {
	if (this.inputGeom.isEmpty()) return this.inputGeom.clone();
	return new VWTransformer(this.isEnsureValidTopology).transform(this.inputGeom);
};
VWSimplifier.prototype.setDistanceTolerance = function (distanceTolerance) {
	if (distanceTolerance < 0.0) throw new IllegalArgumentException("Tolerance must be non-negative");
	this.distanceTolerance = distanceTolerance;
};
VWSimplifier.simplify = function (geom, distanceTolerance) {
	var simp = new VWSimplifier(geom);
	simp.setDistanceTolerance(distanceTolerance);
	return simp.getResultGeometry();
};

