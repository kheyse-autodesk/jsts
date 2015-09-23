function GeometryExtracter(clz, comps) {
	this.clz = null;
	this.comps = null;
	if (arguments.length === 0) return;
	this.clz = clz;
	this.comps = comps;
}
module.exports = GeometryExtracter
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var ArrayList = require('java/util/ArrayList');
GeometryExtracter.prototype.filter = function (geom) {
	if (this.clz === null || GeometryExtracter.isOfClass(geom, this.clz)) this.comps.add(geom);
};
GeometryExtracter.isOfClass = function (o, clz) {
	return clz.isAssignableFrom(o.getClass());
};
GeometryExtracter.extract = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geom, clz] = args;
				return GeometryExtracter.extract(geom, clz, new ArrayList());
			})(...args);
		case 3:
			return ((...args) => {
				let [geom, clz, list] = args;
				if (GeometryExtracter.isOfClass(geom, clz)) {
					list.add(geom);
				} else if (geom instanceof GeometryCollection) {
					geom.apply(new GeometryExtracter(clz, list));
				}
				return list;
			})(...args);
	}
};

