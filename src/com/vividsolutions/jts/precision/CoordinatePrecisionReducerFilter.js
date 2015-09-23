function CoordinatePrecisionReducerFilter(precModel) {
	this.precModel = null;
	if (arguments.length === 0) return;
	this.precModel = precModel;
}
module.exports = CoordinatePrecisionReducerFilter
CoordinatePrecisionReducerFilter.prototype.filter = function (seq, i) {
	seq.setOrdinate(i, 0, this.precModel.makePrecise(seq.getOrdinate(i, 0)));
	seq.setOrdinate(i, 1, this.precModel.makePrecise(seq.getOrdinate(i, 1)));
};
CoordinatePrecisionReducerFilter.prototype.isDone = function () {
	return false;
};
CoordinatePrecisionReducerFilter.prototype.isGeometryChanged = function () {
	return true;
};

