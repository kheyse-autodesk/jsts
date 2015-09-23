function LengthIndexedLine(linearGeom) {
	this.linearGeom = null;
	if (arguments.length === 0) return;
	this.linearGeom = linearGeom;
}
module.exports = LengthIndexedLine
var LocationIndexedLine = require('com/vividsolutions/jts/linearref/LocationIndexedLine');
var LengthIndexOfPoint = require('com/vividsolutions/jts/linearref/LengthIndexOfPoint');
var LocationIndexOfLine = require('com/vividsolutions/jts/linearref/LocationIndexOfLine');
var LengthLocationMap = require('com/vividsolutions/jts/linearref/LengthLocationMap');
var ExtractLineByLocation = require('com/vividsolutions/jts/linearref/ExtractLineByLocation');
LengthIndexedLine.prototype.clampIndex = function (index) {
	var posIndex = this.positiveIndex(index);
	var startIndex = this.getStartIndex();
	if (posIndex < startIndex) return startIndex;
	var endIndex = this.getEndIndex();
	if (posIndex > endIndex) return endIndex;
	return posIndex;
};
LengthIndexedLine.prototype.locationOf = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [index, resolveLower] = args;
				return LengthLocationMap.getLocation(this.linearGeom, index, resolveLower);
			})(...args);
		case 1:
			return ((...args) => {
				let [index] = args;
				return LengthLocationMap.getLocation(this.linearGeom, index);
			})(...args);
	}
};
LengthIndexedLine.prototype.project = function (pt) {
	return LengthIndexOfPoint.indexOf(this.linearGeom, pt);
};
LengthIndexedLine.prototype.positiveIndex = function (index) {
	if (index >= 0.0) return index;
	return this.linearGeom.getLength() + index;
};
LengthIndexedLine.prototype.extractPoint = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [index, offsetDistance] = args;
				var loc = LengthLocationMap.getLocation(this.linearGeom, index);
				var locLow = loc.toLowest(this.linearGeom);
				return locLow.getSegment(this.linearGeom).pointAlongOffset(locLow.getSegmentFraction(), offsetDistance);
			})(...args);
		case 1:
			return ((...args) => {
				let [index] = args;
				var loc = LengthLocationMap.getLocation(this.linearGeom, index);
				return loc.getCoordinate(this.linearGeom);
			})(...args);
	}
};
LengthIndexedLine.prototype.isValidIndex = function (index) {
	return index >= this.getStartIndex() && index <= this.getEndIndex();
};
LengthIndexedLine.prototype.getEndIndex = function () {
	return this.linearGeom.getLength();
};
LengthIndexedLine.prototype.getStartIndex = function () {
	return 0.0;
};
LengthIndexedLine.prototype.indexOfAfter = function (pt, minIndex) {
	return LengthIndexOfPoint.indexOfAfter(this.linearGeom, pt, minIndex);
};
LengthIndexedLine.prototype.extractLine = function (startIndex, endIndex) {
	var lil = new LocationIndexedLine(this.linearGeom);
	var startIndex2 = this.clampIndex(startIndex);
	var endIndex2 = this.clampIndex(endIndex);
	var resolveStartLower = startIndex2 === endIndex2;
	var startLoc = this.locationOf(startIndex2, resolveStartLower);
	var endLoc = this.locationOf(endIndex2);
	return ExtractLineByLocation.extract(this.linearGeom, startLoc, endLoc);
};
LengthIndexedLine.prototype.indexOf = function (pt) {
	return LengthIndexOfPoint.indexOf(this.linearGeom, pt);
};
LengthIndexedLine.prototype.indicesOf = function (subLine) {
	var locIndex = LocationIndexOfLine.indicesOf(this.linearGeom, subLine);
	var index = [LengthLocationMap.getLength(this.linearGeom, locIndex[0]), LengthLocationMap.getLength(this.linearGeom, locIndex[1])];
	return index;
};

