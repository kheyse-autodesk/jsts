function UnaryUnionOp(...args) {
	this.polygons = new ArrayList();
	this.lines = new ArrayList();
	this.points = new ArrayList();
	this.geomFact = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geoms, geomFact] = args;
				this.geomFact = geomFact;
				this.extract(geoms);
			})(...args);
		case 1:
			if (args[0] instanceof Collection) {
				return ((...args) => {
					let [geoms] = args;
					this.extract(geoms);
				})(...args);
			} else if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geom] = args;
					this.extract(geom);
				})(...args);
			}
	}
}
module.exports = UnaryUnionOp
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var PointGeometryUnion = require('com/vividsolutions/jts/operation/union/PointGeometryUnion');
var Collection = require('java/util/Collection');
var Point = require('com/vividsolutions/jts/geom/Point');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var SnapIfNeededOverlayOp = require('com/vividsolutions/jts/operation/overlay/snap/SnapIfNeededOverlayOp');
var ArrayList = require('java/util/ArrayList');
var GeometryExtracter = require('com/vividsolutions/jts/geom/util/GeometryExtracter');
var OverlayOp = require('com/vividsolutions/jts/operation/overlay/OverlayOp');
var CascadedPolygonUnion = require('com/vividsolutions/jts/operation/union/CascadedPolygonUnion');
UnaryUnionOp.prototype.unionNoOpt = function (g0) {
	var empty = this.geomFact.createPoint(null);
	return SnapIfNeededOverlayOp.overlayOp(g0, empty, OverlayOp.UNION);
};
UnaryUnionOp.prototype.unionWithNull = function (g0, g1) {
	if (g0 === null && g1 === null) return null;
	if (g1 === null) return g0;
	if (g0 === null) return g1;
	return g0.union(g1);
};
UnaryUnionOp.prototype.extract = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Collection) {
				return ((...args) => {
					let [geoms] = args;
					for (var i = geoms.iterator(); i.hasNext(); ) {
						var geom = i.next();
						this.extract(geom);
					}
				})(...args);
			} else if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geom] = args;
					if (this.geomFact === null) this.geomFact = geom.getFactory();
					GeometryExtracter.extract(geom, Polygon, this.polygons);
					GeometryExtracter.extract(geom, LineString, this.lines);
					GeometryExtracter.extract(geom, Point, this.points);
				})(...args);
			}
	}
};
UnaryUnionOp.prototype.union = function () {
	if (this.geomFact === null) {
		return null;
	}
	var unionPoints = null;
	if (this.points.size() > 0) {
		var ptGeom = this.geomFact.buildGeometry(this.points);
		unionPoints = this.unionNoOpt(ptGeom);
	}
	var unionLines = null;
	if (this.lines.size() > 0) {
		var lineGeom = this.geomFact.buildGeometry(this.lines);
		unionLines = this.unionNoOpt(lineGeom);
	}
	var unionPolygons = null;
	if (this.polygons.size() > 0) {
		unionPolygons = CascadedPolygonUnion.union(this.polygons);
	}
	var unionLA = this.unionWithNull(unionLines, unionPolygons);
	var union = null;
	if (unionPoints === null) union = unionLA; else if (unionLA === null) union = unionPoints; else union = PointGeometryUnion.union(unionPoints, unionLA);
	if (union === null) return this.geomFact.createGeometryCollection(null);
	return union;
};
UnaryUnionOp.union = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geoms, geomFact] = args;
				var op = new UnaryUnionOp(geoms, geomFact);
				return op.union();
			})(...args);
		case 1:
			if (args[0] instanceof Collection) {
				return ((...args) => {
					let [geoms] = args;
					var op = new UnaryUnionOp(geoms);
					return op.union();
				})(...args);
			} else if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geom] = args;
					var op = new UnaryUnionOp(geom);
					return op.union();
				})(...args);
			}
	}
};

