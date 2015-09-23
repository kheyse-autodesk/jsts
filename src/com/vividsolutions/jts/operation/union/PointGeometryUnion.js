function PointGeometryUnion(pointGeom, otherGeom) {
	this.pointGeom = null;
	this.otherGeom = null;
	this.geomFact = null;
	if (arguments.length === 0) return;
	this.pointGeom = pointGeom;
	this.otherGeom = otherGeom;
	this.geomFact = otherGeom.getFactory();
}
module.exports = PointGeometryUnion
var PointLocator = require('com/vividsolutions/jts/algorithm/PointLocator');
var Location = require('com/vividsolutions/jts/geom/Location');
var TreeSet = require('java/util/TreeSet');
var GeometryCombiner = require('com/vividsolutions/jts/geom/util/GeometryCombiner');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
PointGeometryUnion.prototype.union = function () {
	var locater = new PointLocator();
	var exteriorCoords = new TreeSet();
	for (var i = 0; i < this.pointGeom.getNumGeometries(); i++) {
		var point = this.pointGeom.getGeometryN(i);
		var coord = point.getCoordinate();
		var loc = locater.locate(coord, this.otherGeom);
		if (loc === Location.EXTERIOR) exteriorCoords.add(coord);
	}
	if (exteriorCoords.size() === 0) return this.otherGeom;
	var ptComp = null;
	var coords = CoordinateArrays.toCoordinateArray(exteriorCoords);
	if (coords.length === 1) {
		ptComp = this.geomFact.createPoint(coords[0]);
	} else {
		ptComp = this.geomFact.createMultiPoint(coords);
	}
	return GeometryCombiner.combine(ptComp, this.otherGeom);
};
PointGeometryUnion.union = function (pointGeom, otherGeom) {
	var unioner = new PointGeometryUnion(pointGeom, otherGeom);
	return unioner.union();
};

