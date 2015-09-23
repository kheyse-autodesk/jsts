function SimplePointInAreaLocator(geom) {
	this.geom = null;
	if (arguments.length === 0) return;
	this.geom = geom;
}
module.exports = SimplePointInAreaLocator
var Location = require('com/vividsolutions/jts/geom/Location');
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var GeometryCollectionIterator = require('com/vividsolutions/jts/geom/GeometryCollectionIterator');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
SimplePointInAreaLocator.prototype.locate = function (p) {
	return SimplePointInAreaLocator.locate(p, this.geom);
};
SimplePointInAreaLocator.isPointInRing = function (p, ring) {
	if (!ring.getEnvelopeInternal().intersects(p)) return false;
	return CGAlgorithms.isPointInRing(p, ring.getCoordinates());
};
SimplePointInAreaLocator.containsPointInPolygon = function (p, poly) {
	if (poly.isEmpty()) return false;
	var shell = poly.getExteriorRing();
	if (!SimplePointInAreaLocator.isPointInRing(p, shell)) return false;
	for (var i = 0; i < poly.getNumInteriorRing(); i++) {
		var hole = poly.getInteriorRingN(i);
		if (SimplePointInAreaLocator.isPointInRing(p, hole)) return false;
	}
	return true;
};
SimplePointInAreaLocator.containsPoint = function (p, geom) {
	if (geom instanceof Polygon) {
		return SimplePointInAreaLocator.containsPointInPolygon(p, geom);
	} else if (geom instanceof GeometryCollection) {
		var geomi = new GeometryCollectionIterator(geom);
		while (geomi.hasNext()) {
			var g2 = geomi.next();
			if (g2 !== geom) if (SimplePointInAreaLocator.containsPoint(p, g2)) return true;
		}
	}
	return false;
};
SimplePointInAreaLocator.locate = function (p, geom) {
	if (geom.isEmpty()) return Location.EXTERIOR;
	if (SimplePointInAreaLocator.containsPoint(p, geom)) return Location.INTERIOR;
	return Location.EXTERIOR;
};

