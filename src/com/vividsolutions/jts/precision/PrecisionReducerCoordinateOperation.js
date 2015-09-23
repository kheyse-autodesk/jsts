function PrecisionReducerCoordinateOperation(targetPM, removeCollapsed) {
	this.targetPM = null;
	this.removeCollapsed = true;
	if (arguments.length === 0) return;
	this.targetPM = targetPM;
	this.removeCollapsed = removeCollapsed;
}
module.exports = PrecisionReducerCoordinateOperation
var util = require('util');
util.inherits(PrecisionReducerCoordinateOperation, CoordinateOperation)
var LineString = require('com/vividsolutions/jts/geom/LineString');
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var LinearRing = require('com/vividsolutions/jts/geom/LinearRing');
PrecisionReducerCoordinateOperation.prototype.edit = function (coordinates, geom) {
	if (coordinates.length === 0) return null;
	var reducedCoords = [];
	for (var i = 0; i < coordinates.length; i++) {
		var coord = new Coordinate(coordinates[i]);
		this.targetPM.makePrecise(coord);
		reducedCoords[i] = coord;
	}
	var noRepeatedCoordList = new CoordinateList(reducedCoords, false);
	var noRepeatedCoords = noRepeatedCoordList.toCoordinateArray();
	var minLength = 0;
	if (geom instanceof LineString) minLength = 2;
	if (geom instanceof LinearRing) minLength = 4;
	var collapsedCoords = reducedCoords;
	if (this.removeCollapsed) collapsedCoords = null;
	if (noRepeatedCoords.length < minLength) {
		return collapsedCoords;
	}
	return noRepeatedCoords;
};

