function TopologyPreservingSimplifier(inputGeom) {
	this.inputGeom = null;
	this.lineSimplifier = new TaggedLinesSimplifier();
	this.linestringMap = null;
	if (arguments.length === 0) return;
	this.inputGeom = inputGeom;
}
module.exports = TopologyPreservingSimplifier
var HashMap = require('java/util/HashMap');
var TaggedLinesSimplifier = require('com/vividsolutions/jts/simplify/TaggedLinesSimplifier');
TopologyPreservingSimplifier.prototype.getResultGeometry = function () {
	if (this.inputGeom.isEmpty()) return this.inputGeom.clone();
	this.linestringMap = new HashMap();
	this.inputGeom.apply(new LineStringMapBuilderFilter());
	this.lineSimplifier.simplify(this.linestringMap.values());
	var result = new LineStringTransformer().transform(this.inputGeom);
	return result;
};
TopologyPreservingSimplifier.prototype.setDistanceTolerance = function (distanceTolerance) {
	if (distanceTolerance < 0.0) throw new IllegalArgumentException("Tolerance must be non-negative");
	this.lineSimplifier.setDistanceTolerance(distanceTolerance);
};
TopologyPreservingSimplifier.simplify = function (geom, distanceTolerance) {
	var tss = new TopologyPreservingSimplifier(geom);
	tss.setDistanceTolerance(distanceTolerance);
	return tss.getResultGeometry();
};

