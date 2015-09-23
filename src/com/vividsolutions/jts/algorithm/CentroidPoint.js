function CentroidPoint() {
	this.ptCount = 0;
	this.centSum = new Coordinate();
	if (arguments.length === 0) return;
}
module.exports = CentroidPoint
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Point = require('com/vividsolutions/jts/geom/Point');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
CentroidPoint.prototype.getCentroid = function () {
	var cent = new Coordinate();
	cent.x = this.centSum.x / this.ptCount;
	cent.y = this.centSum.y / this.ptCount;
	return cent;
};
CentroidPoint.prototype.add = function (...args) {
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
					let [pt] = args;
					this.ptCount += 1;
					this.centSum.x += pt.x;
					this.centSum.y += pt.y;
				})(...args);
			}
	}
};

