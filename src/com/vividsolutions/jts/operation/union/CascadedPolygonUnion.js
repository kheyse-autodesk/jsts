function CascadedPolygonUnion(polys) {
	this.inputPolys = null;
	this.geomFactory = null;
	if (arguments.length === 0) return;
	this.inputPolys = polys;
	if (this.inputPolys === null) this.inputPolys = new ArrayList();
}
module.exports = CascadedPolygonUnion
var PolygonExtracter = require('com/vividsolutions/jts/geom/util/PolygonExtracter');
var STRtree = require('com/vividsolutions/jts/index/strtree/STRtree');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var GeometryCombiner = require('com/vividsolutions/jts/geom/util/GeometryCombiner');
var Polygonal = require('com/vividsolutions/jts/geom/Polygonal');
var ArrayList = require('java/util/ArrayList');
var List = require('java/util/List');
CascadedPolygonUnion.prototype.reduceToGeometries = function (geomTree) {
	var geoms = new ArrayList();
	for (var i = geomTree.iterator(); i.hasNext(); ) {
		var o = i.next();
		var geom = null;
		if (o instanceof List) {
			geom = this.unionTree(o);
		} else if (o instanceof Geometry) {
			geom = o;
		}
		geoms.add(geom);
	}
	return geoms;
};
CascadedPolygonUnion.prototype.extractByEnvelope = function (env, geom, disjointGeoms) {
	var intersectingGeoms = new ArrayList();
	for (var i = 0; i < geom.getNumGeometries(); i++) {
		var elem = geom.getGeometryN(i);
		if (elem.getEnvelopeInternal().intersects(env)) intersectingGeoms.add(elem); else disjointGeoms.add(elem);
	}
	return this.geomFactory.buildGeometry(intersectingGeoms);
};
CascadedPolygonUnion.prototype.unionOptimized = function (g0, g1) {
	var g0Env = g0.getEnvelopeInternal();
	var g1Env = g1.getEnvelopeInternal();
	if (!g0Env.intersects(g1Env)) {
		var combo = GeometryCombiner.combine(g0, g1);
		return combo;
	}
	if (g0.getNumGeometries() <= 1 && g1.getNumGeometries() <= 1) return this.unionActual(g0, g1);
	var commonEnv = g0Env.intersection(g1Env);
	return this.unionUsingEnvelopeIntersection(g0, g1, commonEnv);
};
CascadedPolygonUnion.prototype.union = function () {
	if (this.inputPolys === null) throw new IllegalStateException("union() method cannot be called twice");
	if (this.inputPolys.isEmpty()) return null;
	this.geomFactory = this.inputPolys.iterator().next().getFactory();
	var index = new STRtree(CascadedPolygonUnion.STRTREE_NODE_CAPACITY);
	for (var i = this.inputPolys.iterator(); i.hasNext(); ) {
		var item = i.next();
		index.insert(item.getEnvelopeInternal(), item);
	}
	this.inputPolys = null;
	var itemTree = index.itemsTree();
	var unionAll = this.unionTree(itemTree);
	return unionAll;
};
CascadedPolygonUnion.prototype.binaryUnion = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [geoms] = args;
				return this.binaryUnion(geoms, 0, geoms.size());
			})(...args);
		case 3:
			return ((...args) => {
				let [geoms, start, end] = args;
				if (end - start <= 1) {
					var g0 = CascadedPolygonUnion.getGeometry(geoms, start);
					return this.unionSafe(g0, null);
				} else if (end - start === 2) {
					return this.unionSafe(CascadedPolygonUnion.getGeometry(geoms, start), CascadedPolygonUnion.getGeometry(geoms, start + 1));
				} else {
					var mid = (end + start) / 2;
					var g0 = this.binaryUnion(geoms, start, mid);
					var g1 = this.binaryUnion(geoms, mid, end);
					return this.unionSafe(g0, g1);
				}
			})(...args);
	}
};
CascadedPolygonUnion.prototype.repeatedUnion = function (geoms) {
	var union = null;
	for (var i = geoms.iterator(); i.hasNext(); ) {
		var g = i.next();
		if (union === null) union = g.clone(); else union = union.union(g);
	}
	return union;
};
CascadedPolygonUnion.prototype.unionSafe = function (g0, g1) {
	if (g0 === null && g1 === null) return null;
	if (g0 === null) return g1.clone();
	if (g1 === null) return g0.clone();
	return this.unionOptimized(g0, g1);
};
CascadedPolygonUnion.prototype.unionActual = function (g0, g1) {
	return CascadedPolygonUnion.restrictToPolygons(g0.union(g1));
};
CascadedPolygonUnion.prototype.unionTree = function (geomTree) {
	var geoms = this.reduceToGeometries(geomTree);
	var union = this.binaryUnion(geoms);
	return union;
};
CascadedPolygonUnion.prototype.unionUsingEnvelopeIntersection = function (g0, g1, common) {
	var disjointPolys = new ArrayList();
	var g0Int = this.extractByEnvelope(common, g0, disjointPolys);
	var g1Int = this.extractByEnvelope(common, g1, disjointPolys);
	var union = this.unionActual(g0Int, g1Int);
	disjointPolys.add(union);
	var overallUnion = GeometryCombiner.combine(disjointPolys);
	return overallUnion;
};
CascadedPolygonUnion.prototype.bufferUnion = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [g0, g1] = args;
				var factory = g0.getFactory();
				var gColl = factory.createGeometryCollection([g0, g1]);
				var unionAll = gColl.buffer(0.0);
				return unionAll;
			})(...args);
		case 1:
			return ((...args) => {
				let [geoms] = args;
				var factory = geoms.get(0).getFactory();
				var gColl = factory.buildGeometry(geoms);
				var unionAll = gColl.buffer(0.0);
				return unionAll;
			})(...args);
	}
};
CascadedPolygonUnion.restrictToPolygons = function (g) {
	if (g instanceof Polygonal) {
		return g;
	}
	var polygons = PolygonExtracter.getPolygons(g);
	if (polygons.size() === 1) return polygons.get(0);
	return g.getFactory().createMultiPolygon(GeometryFactory.toPolygonArray(polygons));
};
CascadedPolygonUnion.getGeometry = function (list, index) {
	if (index >= list.size()) return null;
	return list.get(index);
};
CascadedPolygonUnion.union = function (polys) {
	var op = new CascadedPolygonUnion(polys);
	return op.union();
};
CascadedPolygonUnion.STRTREE_NODE_CAPACITY = 4;

