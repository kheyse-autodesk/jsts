function PolygonExtracter(comps) {
	this.comps = null;
	if (arguments.length === 0) return;
	this.comps = comps;
}
module.exports = PolygonExtracter
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var ArrayList = require('java/util/ArrayList');
PolygonExtracter.prototype.filter = function (geom) {
	if (geom instanceof Polygon) this.comps.add(geom);
};
PolygonExtracter.getPolygons = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geom, list] = args;
				if (geom instanceof Polygon) {
					list.add(geom);
				} else if (geom instanceof GeometryCollection) {
					geom.apply(new PolygonExtracter(list));
				}
				return list;
			})(...args);
		case 1:
			return ((...args) => {
				let [geom] = args;
				return PolygonExtracter.getPolygons(geom, new ArrayList());
			})(...args);
	}
};

