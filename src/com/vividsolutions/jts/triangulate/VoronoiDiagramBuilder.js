function VoronoiDiagramBuilder() {
	this.siteCoords = null;
	this.tolerance = 0.0;
	this.subdiv = null;
	this.clipEnv = null;
	this.diagramEnv = null;
	if (arguments.length === 0) return;
}
module.exports = VoronoiDiagramBuilder
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Collection = require('java/util/Collection');
var IncrementalDelaunayTriangulator = require('com/vividsolutions/jts/triangulate/IncrementalDelaunayTriangulator');
var QuadEdgeSubdivision = require('com/vividsolutions/jts/triangulate/quadedge/QuadEdgeSubdivision');
var DelaunayTriangulationBuilder = require('com/vividsolutions/jts/triangulate/DelaunayTriangulationBuilder');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var ArrayList = require('java/util/ArrayList');
VoronoiDiagramBuilder.prototype.create = function () {
	if (this.subdiv !== null) return null;
	var siteEnv = DelaunayTriangulationBuilder.envelope(this.siteCoords);
	this.diagramEnv = siteEnv;
	var expandBy = Math.max(this.diagramEnv.getWidth(), this.diagramEnv.getHeight());
	this.diagramEnv.expandBy(expandBy);
	if (this.clipEnv !== null) this.diagramEnv.expandToInclude(this.clipEnv);
	var vertices = DelaunayTriangulationBuilder.toVertices(this.siteCoords);
	this.subdiv = new QuadEdgeSubdivision(siteEnv, this.tolerance);
	var triangulator = new IncrementalDelaunayTriangulator(this.subdiv);
	triangulator.insertSites(vertices);
};
VoronoiDiagramBuilder.prototype.getDiagram = function (geomFact) {
	this.create();
	var polys = this.subdiv.getVoronoiDiagram(geomFact);
	return VoronoiDiagramBuilder.clipGeometryCollection(polys, this.diagramEnv);
};
VoronoiDiagramBuilder.prototype.setTolerance = function (tolerance) {
	this.tolerance = tolerance;
};
VoronoiDiagramBuilder.prototype.setSites = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geom] = args;
					this.siteCoords = DelaunayTriangulationBuilder.extractUniqueCoordinates(geom);
				})(...args);
			} else if (args[0] instanceof Collection) {
				return ((...args) => {
					let [coords] = args;
					this.siteCoords = DelaunayTriangulationBuilder.unique(CoordinateArrays.toCoordinateArray(coords));
				})(...args);
			}
	}
};
VoronoiDiagramBuilder.prototype.setClipEnvelope = function (clipEnv) {
	this.clipEnv = clipEnv;
};
VoronoiDiagramBuilder.prototype.getSubdivision = function () {
	this.create();
	return this.subdiv;
};
VoronoiDiagramBuilder.clipGeometryCollection = function (geom, clipEnv) {
	var clipPoly = geom.getFactory().toGeometry(clipEnv);
	var clipped = new ArrayList();
	for (var i = 0; i < geom.getNumGeometries(); i++) {
		var g = geom.getGeometryN(i);
		var result = null;
		if (clipEnv.contains(g.getEnvelopeInternal())) result = g; else if (clipEnv.intersects(g.getEnvelopeInternal())) {
			result = clipPoly.intersection(g);
			result.setUserData(g.getUserData());
		}
		if (result !== null && !result.isEmpty()) {
			clipped.add(result);
		}
	}
	return geom.getFactory().createGeometryCollection(GeometryFactory.toGeometryArray(clipped));
};

