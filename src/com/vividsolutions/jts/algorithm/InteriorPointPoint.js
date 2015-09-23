function InteriorPointPoint(g) {
	this.centroid = null;
	this.minDistance = Double.MAX_VALUE;
	this.interiorPoint = null;
	if (arguments.length === 0) return;
	this.centroid = g.getCentroid().getCoordinate();
	this.add(g);
}
module.exports = InteriorPointPoint
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Point = require('com/vividsolutions/jts/geom/Point');
var Double = require('java/lang/Double');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
InteriorPointPoint.prototype.getInteriorPoint = function () {
	return this.interiorPoint;
};
InteriorPointPoint.prototype.add = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geom] = args;
					if (geom instanceof Point) {
						this.add(geom.getCoordinate());
					} else if (geom instanceof GeometryCollection) {
						var gc = geom;
						for (var i = 0; i < gc.getNumGeometries(); i++) {
							this.add(gc.getGeometryN(i));
						}
					}
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [point] = args;
					var dist = point.distance(this.centroid);
					if (dist < this.minDistance) {
						this.interiorPoint = new Coordinate(point);
						this.minDistance = dist;
					}
				})(...args);
			}
	}
};

