function DelaunayTriangulationBuilder() {
	this.siteCoords = null;
	this.tolerance = 0.0;
	this.subdiv = null;
	if (arguments.length === 0) return;
}
module.exports = DelaunayTriangulationBuilder
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Arrays = require('java/util/Arrays');
var Collection = require('java/util/Collection');
var IncrementalDelaunayTriangulator = require('com/vividsolutions/jts/triangulate/IncrementalDelaunayTriangulator');
var QuadEdgeSubdivision = require('com/vividsolutions/jts/triangulate/quadedge/QuadEdgeSubdivision');
var Vertex = require('com/vividsolutions/jts/triangulate/quadedge/Vertex');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var ArrayList = require('java/util/ArrayList');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
DelaunayTriangulationBuilder.prototype.create = function () {
	if (this.subdiv !== null) return null;
	var siteEnv = DelaunayTriangulationBuilder.envelope(this.siteCoords);
	var vertices = DelaunayTriangulationBuilder.toVertices(this.siteCoords);
	this.subdiv = new QuadEdgeSubdivision(siteEnv, this.tolerance);
	var triangulator = new IncrementalDelaunayTriangulator(this.subdiv);
	triangulator.insertSites(vertices);
};
DelaunayTriangulationBuilder.prototype.setTolerance = function (tolerance) {
	this.tolerance = tolerance;
};
DelaunayTriangulationBuilder.prototype.setSites = function (...args) {
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
DelaunayTriangulationBuilder.prototype.getEdges = function (geomFact) {
	this.create();
	return this.subdiv.getEdges(geomFact);
};
DelaunayTriangulationBuilder.prototype.getSubdivision = function () {
	this.create();
	return this.subdiv;
};
DelaunayTriangulationBuilder.prototype.getTriangles = function (geomFact) {
	this.create();
	return this.subdiv.getTriangles(geomFact);
};
DelaunayTriangulationBuilder.extractUniqueCoordinates = function (geom) {
	if (geom === null) return new CoordinateList();
	var coords = geom.getCoordinates();
	return DelaunayTriangulationBuilder.unique(coords);
};
DelaunayTriangulationBuilder.envelope = function (coords) {
	var env = new Envelope();
	for (var i = coords.iterator(); i.hasNext(); ) {
		var coord = i.next();
		env.expandToInclude(coord);
	}
	return env;
};
DelaunayTriangulationBuilder.unique = function (coords) {
	var coordsCopy = CoordinateArrays.copyDeep(coords);
	Arrays.sort(coordsCopy);
	var coordList = new CoordinateList(coordsCopy, false);
	return coordList;
};
DelaunayTriangulationBuilder.toVertices = function (coords) {
	var verts = new ArrayList();
	for (var i = coords.iterator(); i.hasNext(); ) {
		var coord = i.next();
		verts.add(new Vertex(coord));
	}
	return verts;
};

