function LocationIndexOfLine(linearGeom) {
	this.linearGeom = null;
	if (arguments.length === 0) return;
	this.linearGeom = linearGeom;
}
module.exports = LocationIndexOfLine
var LocationIndexOfPoint = require('com/vividsolutions/jts/linearref/LocationIndexOfPoint');
LocationIndexOfLine.prototype.indicesOf = function (subLine) {
	var startPt = subLine.getGeometryN(0).getCoordinateN(0);
	var lastLine = subLine.getGeometryN(subLine.getNumGeometries() - 1);
	var endPt = lastLine.getCoordinateN(lastLine.getNumPoints() - 1);
	var locPt = new LocationIndexOfPoint(this.linearGeom);
	var subLineLoc = [];
	subLineLoc[0] = locPt.indexOf(startPt);
	if (subLine.getLength() === 0.0) {
		subLineLoc[1] = subLineLoc[0].clone();
	} else {
		subLineLoc[1] = locPt.indexOfAfter(endPt, subLineLoc[0]);
	}
	return subLineLoc;
};
LocationIndexOfLine.indicesOf = function (linearGeom, subLine) {
	var locater = new LocationIndexOfLine(linearGeom);
	return locater.indicesOf(subLine);
};

