function ConnectedElementLocationFilter(locations) {
	this.locations = null;
	if (arguments.length === 0) return;
	this.locations = locations;
}
module.exports = ConnectedElementLocationFilter
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Point = require('com/vividsolutions/jts/geom/Point');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var GeometryLocation = require('com/vividsolutions/jts/operation/distance/GeometryLocation');
var ArrayList = require('java/util/ArrayList');
ConnectedElementLocationFilter.prototype.filter = function (geom) {
	if (geom instanceof Point || geom instanceof LineString || geom instanceof Polygon) this.locations.add(new GeometryLocation(geom, 0, geom.getCoordinate()));
};
ConnectedElementLocationFilter.getLocations = function (geom) {
	var locations = new ArrayList();
	geom.apply(new ConnectedElementLocationFilter(locations));
	return locations;
};

