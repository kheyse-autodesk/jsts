function GeometryCollectionMapper(mapOp) {
	this.mapOp = null;
	if (arguments.length === 0) return;
	this.mapOp = mapOp;
}
module.exports = GeometryCollectionMapper
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var ArrayList = require('java/util/ArrayList');
GeometryCollectionMapper.prototype.map = function (gc) {
	var mapped = new ArrayList();
	for (var i = 0; i < gc.getNumGeometries(); i++) {
		var g = this.mapOp.map(gc.getGeometryN(i));
		if (!g.isEmpty()) mapped.add(g);
	}
	return gc.getFactory().createGeometryCollection(GeometryFactory.toGeometryArray(mapped));
};
GeometryCollectionMapper.map = function (gc, op) {
	var mapper = new GeometryCollectionMapper(op);
	return mapper.map(gc);
};

