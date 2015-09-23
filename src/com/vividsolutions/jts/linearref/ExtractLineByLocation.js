function ExtractLineByLocation(line) {
	this.line = null;
	if (arguments.length === 0) return;
	this.line = line;
}
module.exports = ExtractLineByLocation
var LineString = require('com/vividsolutions/jts/geom/LineString');
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var LinearIterator = require('com/vividsolutions/jts/linearref/LinearIterator');
var Assert = require('com/vividsolutions/jts/util/Assert');
var LinearGeometryBuilder = require('com/vividsolutions/jts/linearref/LinearGeometryBuilder');
var MultiLineString = require('com/vividsolutions/jts/geom/MultiLineString');
ExtractLineByLocation.prototype.computeLinear = function (start, end) {
	var builder = new LinearGeometryBuilder(this.line.getFactory());
	builder.setFixInvalidLines(true);
	if (!start.isVertex()) builder.add(start.getCoordinate(this.line));
	for (var it = new LinearIterator(this.line, start); it.hasNext(); it.next()) {
		if (end.compareLocationValues(it.getComponentIndex(), it.getVertexIndex(), 0.0) < 0) break;
		var pt = it.getSegmentStart();
		builder.add(pt);
		if (it.isEndOfLine()) builder.endLine();
	}
	if (!end.isVertex()) builder.add(end.getCoordinate(this.line));
	return builder.getGeometry();
};
ExtractLineByLocation.prototype.computeLine = function (start, end) {
	var coordinates = this.line.getCoordinates();
	var newCoordinates = new CoordinateList();
	var startSegmentIndex = start.getSegmentIndex();
	if (start.getSegmentFraction() > 0.0) startSegmentIndex += 1;
	var lastSegmentIndex = end.getSegmentIndex();
	if (end.getSegmentFraction() === 1.0) lastSegmentIndex += 1;
	if (lastSegmentIndex >= coordinates.length) lastSegmentIndex = coordinates.length - 1;
	if (!start.isVertex()) newCoordinates.add(start.getCoordinate(this.line));
	for (var i = startSegmentIndex; i <= lastSegmentIndex; i++) {
		newCoordinates.add(coordinates[i]);
	}
	if (!end.isVertex()) newCoordinates.add(end.getCoordinate(this.line));
	if (newCoordinates.size() <= 0) newCoordinates.add(start.getCoordinate(this.line));
	var newCoordinateArray = newCoordinates.toCoordinateArray();
	if (newCoordinateArray.length <= 1) {
		newCoordinateArray = [newCoordinateArray[0], newCoordinateArray[0]];
	}
	return this.line.getFactory().createLineString(newCoordinateArray);
};
ExtractLineByLocation.prototype.extract = function (start, end) {
	if (end.compareTo(start) < 0) {
		return this.reverse(this.computeLinear(end, start));
	}
	return this.computeLinear(start, end);
};
ExtractLineByLocation.prototype.reverse = function (linear) {
	if (linear instanceof LineString) return linear.reverse();
	if (linear instanceof MultiLineString) return linear.reverse();
	Assert.shouldNeverReachHere("non-linear geometry encountered");
	return null;
};
ExtractLineByLocation.extract = function (line, start, end) {
	var ls = new ExtractLineByLocation(line);
	return ls.extract(start, end);
};

