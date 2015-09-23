function LocationIndexedLine(linearGeom) {
	this.linearGeom = null;
	if (arguments.length === 0) return;
	this.linearGeom = linearGeom;
	this.checkGeometryType();
}
module.exports = LocationIndexedLine
var LineString = require('com/vividsolutions/jts/geom/LineString');
var LinearLocation = require('com/vividsolutions/jts/linearref/LinearLocation');
var LocationIndexOfPoint = require('com/vividsolutions/jts/linearref/LocationIndexOfPoint');
var LocationIndexOfLine = require('com/vividsolutions/jts/linearref/LocationIndexOfLine');
var ExtractLineByLocation = require('com/vividsolutions/jts/linearref/ExtractLineByLocation');
var MultiLineString = require('com/vividsolutions/jts/geom/MultiLineString');
LocationIndexedLine.prototype.clampIndex = function (index) {
	var loc = index.clone();
	loc.clamp(this.linearGeom);
	return loc;
};
LocationIndexedLine.prototype.project = function (pt) {
	return LocationIndexOfPoint.indexOf(this.linearGeom, pt);
};
LocationIndexedLine.prototype.checkGeometryType = function () {
	if (!(this.linearGeom instanceof LineString || this.linearGeom instanceof MultiLineString)) throw new IllegalArgumentException("Input geometry must be linear");
};
LocationIndexedLine.prototype.extractPoint = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [index, offsetDistance] = args;
				var indexLow = index.toLowest(this.linearGeom);
				return indexLow.getSegment(this.linearGeom).pointAlongOffset(indexLow.getSegmentFraction(), offsetDistance);
			})(...args);
		case 1:
			return ((...args) => {
				let [index] = args;
				return index.getCoordinate(this.linearGeom);
			})(...args);
	}
};
LocationIndexedLine.prototype.isValidIndex = function (index) {
	return index.isValid(this.linearGeom);
};
LocationIndexedLine.prototype.getEndIndex = function () {
	return LinearLocation.getEndLocation(this.linearGeom);
};
LocationIndexedLine.prototype.getStartIndex = function () {
	return new LinearLocation();
};
LocationIndexedLine.prototype.indexOfAfter = function (pt, minIndex) {
	return LocationIndexOfPoint.indexOfAfter(this.linearGeom, pt, minIndex);
};
LocationIndexedLine.prototype.extractLine = function (startIndex, endIndex) {
	return ExtractLineByLocation.extract(this.linearGeom, startIndex, endIndex);
};
LocationIndexedLine.prototype.indexOf = function (pt) {
	return LocationIndexOfPoint.indexOf(this.linearGeom, pt);
};
LocationIndexedLine.prototype.indicesOf = function (subLine) {
	return LocationIndexOfLine.indicesOf(this.linearGeom, subLine);
};

