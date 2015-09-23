function CoordinateArrayFilter(size) {
	this.pts = null;
	this.n = 0;
	if (arguments.length === 0) return;
	this.pts = [];
}
module.exports = CoordinateArrayFilter
CoordinateArrayFilter.prototype.filter = function (coord) {
	this.pts[this.n++] = coord;
};
CoordinateArrayFilter.prototype.getCoordinates = function () {
	return this.pts;
};

