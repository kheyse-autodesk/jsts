function GeometryItemDistance() {}
module.exports = GeometryItemDistance
GeometryItemDistance.prototype.distance = function (item1, item2) {
	var g1 = item1.getItem();
	var g2 = item2.getItem();
	return g1.distance(g2);
};

