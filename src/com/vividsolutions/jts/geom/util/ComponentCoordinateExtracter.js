function ComponentCoordinateExtracter(coords) {
	this.coords = null;
	if (arguments.length === 0) return;
	this.coords = coords;
}
module.exports = ComponentCoordinateExtracter
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Point = require('com/vividsolutions/jts/geom/Point');
var ArrayList = require('java/util/ArrayList');
ComponentCoordinateExtracter.prototype.filter = function (geom) {
	if (geom instanceof LineString || geom instanceof Point) this.coords.add(geom.getCoordinate());
};
ComponentCoordinateExtracter.getCoordinates = function (geom) {
	var coords = new ArrayList();
	geom.apply(new ComponentCoordinateExtracter(coords));
	return coords;
};

