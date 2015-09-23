function DouglasPeuckerSimplifier(inputGeom) {
	this.inputGeom = null;
	this.distanceTolerance = null;
	this.isEnsureValidTopology = true;
	if (arguments.length === 0) return;
	this.inputGeom = inputGeom;
}
module.exports = DouglasPeuckerSimplifier
DouglasPeuckerSimplifier.prototype.setEnsureValid = function (isEnsureValidTopology) {
	this.isEnsureValidTopology = isEnsureValidTopology;
};
DouglasPeuckerSimplifier.prototype.getResultGeometry = function () {
	if (this.inputGeom.isEmpty()) return this.inputGeom.clone();
	return new DPTransformer(this.isEnsureValidTopology).transform(this.inputGeom);
};
DouglasPeuckerSimplifier.prototype.setDistanceTolerance = function (distanceTolerance) {
	if (distanceTolerance < 0.0) throw new IllegalArgumentException("Tolerance must be non-negative");
	this.distanceTolerance = distanceTolerance;
};
DouglasPeuckerSimplifier.simplify = function (geom, distanceTolerance) {
	var tss = new DouglasPeuckerSimplifier(geom);
	tss.setDistanceTolerance(distanceTolerance);
	return tss.getResultGeometry();
};

