function GeometryCombiner(geoms) {
	this.geomFactory = null;
	this.skipEmpty = false;
	this.inputGeoms = null;
	if (arguments.length === 0) return;
	this.geomFactory = GeometryCombiner.extractFactory(geoms);
	this.inputGeoms = geoms;
}
module.exports = GeometryCombiner
var ArrayList = require('java/util/ArrayList');
GeometryCombiner.prototype.extractElements = function (geom, elems) {
	if (geom === null) return null;
	for (var i = 0; i < geom.getNumGeometries(); i++) {
		var elemGeom = geom.getGeometryN(i);
		if (this.skipEmpty && elemGeom.isEmpty()) continue;
		elems.add(elemGeom);
	}
};
GeometryCombiner.prototype.combine = function () {
	var elems = new ArrayList();
	for (var i = this.inputGeoms.iterator(); i.hasNext(); ) {
		var g = i.next();
		this.extractElements(g, elems);
	}
	if (elems.size() === 0) {
		if (this.geomFactory !== null) {
			return this.geomFactory.createGeometryCollection(null);
		}
		return null;
	}
	return this.geomFactory.buildGeometry(elems);
};
GeometryCombiner.combine = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [g0, g1] = args;
				var combiner = new GeometryCombiner(GeometryCombiner.createList(g0, g1));
				return combiner.combine();
			})(...args);
		case 1:
			return ((...args) => {
				let [geoms] = args;
				var combiner = new GeometryCombiner(geoms);
				return combiner.combine();
			})(...args);
		case 3:
			return ((...args) => {
				let [g0, g1, g2] = args;
				var combiner = new GeometryCombiner(GeometryCombiner.createList(g0, g1, g2));
				return combiner.combine();
			})(...args);
	}
};
GeometryCombiner.extractFactory = function (geoms) {
	if (geoms.isEmpty()) return null;
	return geoms.iterator().next().getFactory();
};
GeometryCombiner.createList = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [obj0, obj1] = args;
				var list = new ArrayList();
				list.add(obj0);
				list.add(obj1);
				return list;
			})(...args);
		case 3:
			return ((...args) => {
				let [obj0, obj1, obj2] = args;
				var list = new ArrayList();
				list.add(obj0);
				list.add(obj1);
				list.add(obj2);
				return list;
			})(...args);
	}
};

