function InteriorPointLine(g) {
	this.centroid = null;
	this.minDistance = Double.MAX_VALUE;
	this.interiorPoint = null;
	if (arguments.length === 0) return;
	this.centroid = g.getCentroid().getCoordinate();
	this.addInterior(g);
	if (this.interiorPoint === null) this.addEndpoints(g);
}
module.exports = InteriorPointLine
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Double = require('java/lang/Double');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
InteriorPointLine.prototype.addEndpoints = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geom] = args;
					if (geom instanceof LineString) {
						this.addEndpoints(geom.getCoordinates());
					} else if (geom instanceof GeometryCollection) {
						var gc = geom;
						for (var i = 0; i < gc.getNumGeometries(); i++) {
							this.addEndpoints(gc.getGeometryN(i));
						}
					}
				})(...args);
			} else if (args[0] instanceof Array) {
				return ((...args) => {
					let [pts] = args;
					this.add(pts[0]);
					this.add(pts[pts.length - 1]);
				})(...args);
			}
	}
};
InteriorPointLine.prototype.getInteriorPoint = function () {
	return this.interiorPoint;
};
InteriorPointLine.prototype.addInterior = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geom] = args;
					if (geom instanceof LineString) {
						this.addInterior(geom.getCoordinates());
					} else if (geom instanceof GeometryCollection) {
						var gc = geom;
						for (var i = 0; i < gc.getNumGeometries(); i++) {
							this.addInterior(gc.getGeometryN(i));
						}
					}
				})(...args);
			} else if (args[0] instanceof Array) {
				return ((...args) => {
					let [pts] = args;
					for (var i = 1; i < pts.length - 1; i++) {
						this.add(pts[i]);
					}
				})(...args);
			}
	}
};
InteriorPointLine.prototype.add = function (point) {
	var dist = point.distance(this.centroid);
	if (dist < this.minDistance) {
		this.interiorPoint = new Coordinate(point);
		this.minDistance = dist;
	}
};

