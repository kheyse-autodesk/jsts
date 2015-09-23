function AreaSimilarityMeasure() {
	if (arguments.length === 0) return;
}
module.exports = AreaSimilarityMeasure
AreaSimilarityMeasure.prototype.measure = function (g1, g2) {
	var areaInt = g1.intersection(g2).getArea();
	var areaUnion = g1.union(g2).getArea();
	return areaInt / areaUnion;
};

