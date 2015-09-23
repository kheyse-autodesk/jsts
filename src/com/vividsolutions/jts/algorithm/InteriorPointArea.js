function InteriorPointArea(g) {
	this.factory = null;
	this.interiorPoint = null;
	this.maxWidth = 0.0;
	if (arguments.length === 0) return;
	this.factory = g.getFactory();
	this.add(g);
}
module.exports = InteriorPointArea
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var Double = require('java/lang/Double');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
InteriorPointArea.prototype.addPolygon = function (geometry) {
	if (geometry.isEmpty()) return null;
	var intPt = null;
	var width = 0;
	var bisector = this.horizontalBisector(geometry);
	if (bisector.getLength() === 0.0) {
		width = 0;
		intPt = bisector.getCoordinate();
	} else {
		var intersections = bisector.intersection(geometry);
		var widestIntersection = this.widestGeometry(intersections);
		width = widestIntersection.getEnvelopeInternal().getWidth();
		intPt = InteriorPointArea.centre(widestIntersection.getEnvelopeInternal());
	}
	if (this.interiorPoint === null || width > this.maxWidth) {
		this.interiorPoint = intPt;
		this.maxWidth = width;
	}
};
InteriorPointArea.prototype.getInteriorPoint = function () {
	return this.interiorPoint;
};
InteriorPointArea.prototype.widestGeometry = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geometry] = args;
					if (!(geometry instanceof GeometryCollection)) {
						return geometry;
					}
					return this.widestGeometry(geometry);
				})(...args);
			} else if (args[0] instanceof GeometryCollection) {
				return ((...args) => {
					let [gc] = args;
					if (gc.isEmpty()) {
						return gc;
					}
					var widestGeometry = gc.getGeometryN(0);
					for (var i = 1; i < gc.getNumGeometries(); i++) {
						if (gc.getGeometryN(i).getEnvelopeInternal().getWidth() > widestGeometry.getEnvelopeInternal().getWidth()) {
							widestGeometry = gc.getGeometryN(i);
						}
					}
					return widestGeometry;
				})(...args);
			}
	}
};
InteriorPointArea.prototype.horizontalBisector = function (geometry) {
	var envelope = geometry.getEnvelopeInternal();
	var bisectY = SafeBisectorFinder.getBisectorY(geometry);
	return this.factory.createLineString([new Coordinate(envelope.getMinX(), bisectY), new Coordinate(envelope.getMaxX(), bisectY)]);
};
InteriorPointArea.prototype.add = function (geom) {
	if (geom instanceof Polygon) {
		this.addPolygon(geom);
	} else if (geom instanceof GeometryCollection) {
		var gc = geom;
		for (var i = 0; i < gc.getNumGeometries(); i++) {
			this.add(gc.getGeometryN(i));
		}
	}
};
InteriorPointArea.centre = function (envelope) {
	return new Coordinate(InteriorPointArea.avg(envelope.getMinX(), envelope.getMaxX()), InteriorPointArea.avg(envelope.getMinY(), envelope.getMaxY()));
};
InteriorPointArea.avg = function (a, b) {
	return (a + b) / 2.0;
};
function SafeBisectorFinder(poly) {
	this.poly = null;
	this.centreY = null;
	this.hiY = Double.MAX_VALUE;
	this.loY = -Double.MAX_VALUE;
	if (arguments.length === 0) return;
	this.poly = poly;
	this.hiY = poly.getEnvelopeInternal().getMaxY();
	this.loY = poly.getEnvelopeInternal().getMinY();
	this.centreY = SafeBisectorFinder.avg(this.loY, this.hiY);
}
SafeBisectorFinder.prototype.updateInterval = function (y) {
	if (y <= this.centreY) {
		if (y > this.loY) this.loY = y;
	} else if (y > this.centreY) {
		if (y < this.hiY) {
			this.hiY = y;
		}
	}
};
SafeBisectorFinder.prototype.getBisectorY = function () {
	this.process(this.poly.getExteriorRing());
	for (var i = 0; i < this.poly.getNumInteriorRing(); i++) {
		this.process(this.poly.getInteriorRingN(i));
	}
	var bisectY = SafeBisectorFinder.avg(this.hiY, this.loY);
	return bisectY;
};
SafeBisectorFinder.prototype.process = function (line) {
	var seq = line.getCoordinateSequence();
	for (var i = 0; i < seq.size(); i++) {
		var y = seq.getY(i);
		this.updateInterval(y);
	}
};
SafeBisectorFinder.getBisectorY = function (poly) {
	var finder = new SafeBisectorFinder(poly);
	return finder.getBisectorY();
};
InteriorPointArea.SafeBisectorFinder = SafeBisectorFinder;

