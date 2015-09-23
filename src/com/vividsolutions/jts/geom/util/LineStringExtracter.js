function LineStringExtracter(comps) {
	this.comps = null;
	if (arguments.length === 0) return;
	this.comps = comps;
}
module.exports = LineStringExtracter
var LineString = require('com/vividsolutions/jts/geom/LineString');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var ArrayList = require('java/util/ArrayList');
LineStringExtracter.prototype.filter = function (geom) {
	if (geom instanceof LineString) this.comps.add(geom);
};
LineStringExtracter.getGeometry = function (geom) {
	return geom.getFactory().buildGeometry(LineStringExtracter.getLines(geom));
};
LineStringExtracter.getLines = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geom, lines] = args;
				if (geom instanceof LineString) {
					lines.add(geom);
				} else if (geom instanceof GeometryCollection) {
					geom.apply(new LineStringExtracter(lines));
				}
				return lines;
			})(...args);
		case 1:
			return ((...args) => {
				let [geom] = args;
				return LineStringExtracter.getLines(geom, new ArrayList());
			})(...args);
	}
};

