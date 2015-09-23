function CoordinateCountFilter() {
	this.n = 0;
	if (arguments.length === 0) return;
}
module.exports = CoordinateCountFilter
CoordinateCountFilter.prototype.filter = function (coord) {
	this.n++;
};
CoordinateCountFilter.prototype.getCount = function () {
	return this.n;
};

