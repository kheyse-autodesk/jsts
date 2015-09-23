function SimilarityMeasureCombiner() {}
module.exports = SimilarityMeasureCombiner
SimilarityMeasureCombiner.combine = function (measure1, measure2) {
	return Math.min(measure1, measure2);
};

