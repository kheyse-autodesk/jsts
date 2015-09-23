function ConnectedElementPointFilter(pts) {
	this.pts = null;
	if (arguments.length === 0) return;
	this.pts = pts;
}
module.exports = ConnectedElementPointFilter
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Point = require('com/vividsolutions/jts/geom/Point');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var ArrayList = require('java/util/ArrayList');
ConnectedElementPointFilter.prototype.filter = function (geom) {
	if (geom instanceof Point || geom instanceof LineString || geom instanceof Polygon) this.pts.add(geom.getCoordinate());
};
ConnectedElementPointFilter.getCoordinates = function (geom) {
	var pts = new ArrayList();
	geom.apply(new ConnectedElementPointFilter(pts));
	return pts;
};

