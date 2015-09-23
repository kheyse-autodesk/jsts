function UniqueCoordinateArrayFilter() {
	this.treeSet = new TreeSet();
	this.list = new ArrayList();
	if (arguments.length === 0) return;
}
module.exports = UniqueCoordinateArrayFilter
var TreeSet = require('java/util/TreeSet');
var ArrayList = require('java/util/ArrayList');
UniqueCoordinateArrayFilter.prototype.filter = function (coord) {
	if (!this.treeSet.contains(coord)) {
		this.list.add(coord);
		this.treeSet.add(coord);
	}
};
UniqueCoordinateArrayFilter.prototype.getCoordinates = function () {
	var coordinates = [];
	return this.list.toArray(coordinates);
};
UniqueCoordinateArrayFilter.filterCoordinates = function (coords) {
	var filter = new UniqueCoordinateArrayFilter();
	for (var i = 0; i < coords.length; i++) {
		filter.filter(coords[i]);
	}
	return filter.getCoordinates();
};

