function EdgeGraphBuilder() {
	this.graph = new EdgeGraph();
	if (arguments.length === 0) return;
}
module.exports = EdgeGraphBuilder
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Collection = require('java/util/Collection');
var EdgeGraph = require('com/vividsolutions/jts/edgegraph/EdgeGraph');
var GeometryComponentFilter = require('com/vividsolutions/jts/geom/GeometryComponentFilter');
EdgeGraphBuilder.prototype.add = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geometry] = args;
					geometry.apply(new GeometryComponentFilter());
				})(...args);
			} else if (args[0] instanceof Collection) {
				return ((...args) => {
					let [geometries] = args;
					for (var i = geometries.iterator(); i.hasNext(); ) {
						var geometry = i.next();
						this.add(geometry);
					}
				})(...args);
			} else if (args[0] instanceof LineString) {
				return ((...args) => {
					let [lineString] = args;
					var seq = lineString.getCoordinateSequence();
					for (var i = 1; i < seq.size(); i++) {
						this.graph.addEdge(seq.getCoordinate(i - 1), seq.getCoordinate(i));
					}
				})(...args);
			}
	}
};
EdgeGraphBuilder.prototype.getGraph = function () {
	return this.graph;
};
EdgeGraphBuilder.build = function (geoms) {
	var builder = new EdgeGraphBuilder();
	builder.add(geoms);
	return builder.getGraph();
};

