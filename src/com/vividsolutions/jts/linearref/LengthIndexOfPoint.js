function LengthIndexOfPoint(linearGeom) {
	this.linearGeom = null;
	if (arguments.length === 0) return;
	this.linearGeom = linearGeom;
}
module.exports = LengthIndexOfPoint
var LinearIterator = require('com/vividsolutions/jts/linearref/LinearIterator');
var Double = require('java/lang/Double');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
var Assert = require('com/vividsolutions/jts/util/Assert');
LengthIndexOfPoint.prototype.indexOf = function (inputPt) {
	return this.indexOfFromStart(inputPt, -1.0);
};
LengthIndexOfPoint.prototype.indexOfFromStart = function (inputPt, minIndex) {
	var minDistance = Double.MAX_VALUE;
	var ptMeasure = minIndex;
	var segmentStartMeasure = 0.0;
	var seg = new LineSegment();
	var it = new LinearIterator(this.linearGeom);
	while (it.hasNext()) {
		if (!it.isEndOfLine()) {
			seg.p0 = it.getSegmentStart();
			seg.p1 = it.getSegmentEnd();
			var segDistance = seg.distance(inputPt);
			var segMeasureToPt = this.segmentNearestMeasure(seg, inputPt, segmentStartMeasure);
			if (segDistance < minDistance && segMeasureToPt > minIndex) {
				ptMeasure = segMeasureToPt;
				minDistance = segDistance;
			}
			segmentStartMeasure += seg.getLength();
		}
		it.next();
	}
	return ptMeasure;
};
LengthIndexOfPoint.prototype.indexOfAfter = function (inputPt, minIndex) {
	if (minIndex < 0.0) return this.indexOf(inputPt);
	var endIndex = this.linearGeom.getLength();
	if (endIndex < minIndex) return endIndex;
	var closestAfter = this.indexOfFromStart(inputPt, minIndex);
	Assert.isTrue(closestAfter >= minIndex, "computed index is before specified minimum index");
	return closestAfter;
};
LengthIndexOfPoint.prototype.segmentNearestMeasure = function (seg, inputPt, segmentStartMeasure) {
	var projFactor = seg.projectionFactor(inputPt);
	if (projFactor <= 0.0) return segmentStartMeasure;
	if (projFactor <= 1.0) return segmentStartMeasure + projFactor * seg.getLength();
	return segmentStartMeasure + seg.getLength();
};
LengthIndexOfPoint.indexOf = function (linearGeom, inputPt) {
	var locater = new LengthIndexOfPoint(linearGeom);
	return locater.indexOf(inputPt);
};
LengthIndexOfPoint.indexOfAfter = function (linearGeom, inputPt, minIndex) {
	var locater = new LengthIndexOfPoint(linearGeom);
	return locater.indexOfAfter(inputPt, minIndex);
};

