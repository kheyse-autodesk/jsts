function LinearGeometryBuilder(geomFact) {
	this.geomFact = null;
	this.lines = new ArrayList();
	this.coordList = null;
	this.ignoreInvalidLines = false;
	this.fixInvalidLines = false;
	this.lastPt = null;
	if (arguments.length === 0) return;
	this.geomFact = geomFact;
}
module.exports = LinearGeometryBuilder
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var ArrayList = require('java/util/ArrayList');
LinearGeometryBuilder.prototype.getGeometry = function () {
	this.endLine();
	return this.geomFact.buildGeometry(this.lines);
};
LinearGeometryBuilder.prototype.getLastCoordinate = function () {
	return this.lastPt;
};
LinearGeometryBuilder.prototype.endLine = function () {
	if (this.coordList === null) {
		return null;
	}
	if (this.ignoreInvalidLines && this.coordList.size() < 2) {
		this.coordList = null;
		return null;
	}
	var rawPts = this.coordList.toCoordinateArray();
	var pts = rawPts;
	if (this.fixInvalidLines) pts = this.validCoordinateSequence(rawPts);
	this.coordList = null;
	var line = null;
	try {
		line = this.geomFact.createLineString(pts);
	} catch (e) {
		if (e instanceof IllegalArgumentException) {
			if (!this.ignoreInvalidLines) throw ex;
		}
	} finally {}
	if (line !== null) this.lines.add(line);
};
LinearGeometryBuilder.prototype.setFixInvalidLines = function (fixInvalidLines) {
	this.fixInvalidLines = fixInvalidLines;
};
LinearGeometryBuilder.prototype.add = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [pt, allowRepeatedPoints] = args;
				if (this.coordList === null) this.coordList = new CoordinateList();
				this.coordList.add(pt, allowRepeatedPoints);
				this.lastPt = pt;
			})(...args);
		case 1:
			return ((...args) => {
				let [pt] = args;
				this.add(pt, true);
			})(...args);
	}
};
LinearGeometryBuilder.prototype.setIgnoreInvalidLines = function (ignoreInvalidLines) {
	this.ignoreInvalidLines = ignoreInvalidLines;
};
LinearGeometryBuilder.prototype.validCoordinateSequence = function (pts) {
	if (pts.length >= 2) return pts;
	var validPts = [pts[0], pts[0]];
	return validPts;
};

