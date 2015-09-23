function FuzzyPointLocator(g, boundaryDistanceTolerance) {
	this.g = null;
	this.boundaryDistanceTolerance = null;
	this.linework = null;
	this.ptLocator = new PointLocator();
	this.seg = new LineSegment();
	if (arguments.length === 0) return;
	this.g = g;
	this.boundaryDistanceTolerance = boundaryDistanceTolerance;
	this.linework = this.extractLinework(g);
}
module.exports = FuzzyPointLocator
var PointLocator = require('com/vividsolutions/jts/algorithm/PointLocator');
var Location = require('com/vividsolutions/jts/geom/Location');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
var ArrayList = require('java/util/ArrayList');
FuzzyPointLocator.prototype.isWithinToleranceOfBoundary = function (pt) {
	for (var i = 0; i < this.linework.getNumGeometries(); i++) {
		var line = this.linework.getGeometryN(i);
		var seq = line.getCoordinateSequence();
		for (var j = 0; j < seq.size() - 1; j++) {
			seq.getCoordinate(j, this.seg.p0);
			seq.getCoordinate(j + 1, this.seg.p1);
			var dist = this.seg.distance(pt);
			if (dist <= this.boundaryDistanceTolerance) return true;
		}
	}
	return false;
};
FuzzyPointLocator.prototype.getLocation = function (pt) {
	if (this.isWithinToleranceOfBoundary(pt)) return Location.BOUNDARY;
	return this.ptLocator.locate(pt, this.g);
};
FuzzyPointLocator.prototype.extractLinework = function (g) {
	var extracter = new PolygonalLineworkExtracter();
	g.apply(extracter);
	var linework = extracter.getLinework();
	var lines = GeometryFactory.toLineStringArray(linework);
	return g.getFactory().createMultiLineString(lines);
};
function PolygonalLineworkExtracter() {
	this.linework = null;
	if (arguments.length === 0) return;
	this.linework = new ArrayList();
}
module.exports = PolygonalLineworkExtracter
PolygonalLineworkExtracter.prototype.getLinework = function () {
	return this.linework;
};
PolygonalLineworkExtracter.prototype.filter = function (g) {
	if (g instanceof Polygon) {
		var poly = g;
		this.linework.add(poly.getExteriorRing());
		for (var i = 0; i < poly.getNumInteriorRing(); i++) {
			this.linework.add(poly.getInteriorRingN(i));
		}
	}
};

