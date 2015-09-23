function PointExtracter(pts) {
	this.pts = null;
	if (arguments.length === 0) return;
	this.pts = pts;
}
module.exports = PointExtracter
var Point = require('com/vividsolutions/jts/geom/Point');
var Collections = require('java/util/Collections');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var ArrayList = require('java/util/ArrayList');
PointExtracter.prototype.filter = function (geom) {
	if (geom instanceof Point) this.pts.add(geom);
};
PointExtracter.getPoints = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geom, list] = args;
				if (geom instanceof Point) {
					list.add(geom);
				} else if (geom instanceof GeometryCollection) {
					geom.apply(new PointExtracter(list));
				}
				return list;
			})(...args);
		case 1:
			return ((...args) => {
				let [geom] = args;
				if (geom instanceof Point) {
					return Collections.singletonList(geom);
				}
				return PointExtracter.getPoints(geom, new ArrayList());
			})(...args);
	}
};

