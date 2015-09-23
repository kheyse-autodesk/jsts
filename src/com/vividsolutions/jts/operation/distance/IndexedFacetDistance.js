function IndexedFacetDistance(g1) {
	this.cachedTree = null;
	if (arguments.length === 0) return;
	this.cachedTree = FacetSequenceTreeBuilder.build(g1);
}
module.exports = IndexedFacetDistance
var FacetSequenceTreeBuilder = require('com/vividsolutions/jts/operation/distance/FacetSequenceTreeBuilder');
IndexedFacetDistance.prototype.getDistance = function (g) {
	var tree2 = FacetSequenceTreeBuilder.build(g);
	var obj = this.cachedTree.nearestNeighbour(tree2, new FacetSequenceDistance());
	return IndexedFacetDistance.facetDistance(obj);
};
IndexedFacetDistance.distance = function (g1, g2) {
	var dist = new IndexedFacetDistance(g1);
	return dist.getDistance(g2);
};
IndexedFacetDistance.facetDistance = function (obj) {
	var o1 = obj[0];
	var o2 = obj[1];
	return o1.distance(o2);
};
function FacetSequenceDistance() {}
FacetSequenceDistance.prototype.distance = function (item1, item2) {
	var fs1 = item1.getItem();
	var fs2 = item2.getItem();
	return fs1.distance(fs2);
};
IndexedFacetDistance.FacetSequenceDistance = FacetSequenceDistance;

