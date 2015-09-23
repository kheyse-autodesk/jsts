function VertexTaggedGeometryDataMapper() {
	this.coordDataMap = new TreeMap();
	if (arguments.length === 0) return;
}
module.exports = VertexTaggedGeometryDataMapper
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Collection = require('java/util/Collection');
var ArrayList = require('java/util/ArrayList');
var TreeMap = require('java/util/TreeMap');
VertexTaggedGeometryDataMapper.prototype.loadSourceGeometries = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Collection) {
				return ((...args) => {
					let [geoms] = args;
					for (var i = geoms.iterator(); i.hasNext(); ) {
						var geom = i.next();
						this.loadVertices(geom.getCoordinates(), geom.getUserData());
					}
				})(...args);
			} else if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geomColl] = args;
					for (var i = 0; i < geomColl.getNumGeometries(); i++) {
						var geom = geomColl.getGeometryN(i);
						this.loadVertices(geom.getCoordinates(), geom.getUserData());
					}
				})(...args);
			}
	}
};
VertexTaggedGeometryDataMapper.prototype.getCoordinates = function () {
	return new ArrayList(this.coordDataMap.keySet());
};
VertexTaggedGeometryDataMapper.prototype.transferData = function (targetGeom) {
	for (var i = 0; i < targetGeom.getNumGeometries(); i++) {
		var geom = targetGeom.getGeometryN(i);
		var vertexKey = geom.getUserData();
		if (vertexKey === null) continue;
		geom.setUserData(this.coordDataMap.get(vertexKey));
	}
};
VertexTaggedGeometryDataMapper.prototype.loadVertices = function (pts, data) {
	for (var i = 0; i < pts.length; i++) {
		this.coordDataMap.put(pts[i], data);
	}
};

