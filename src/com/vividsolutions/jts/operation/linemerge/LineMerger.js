function LineMerger() {
	this.graph = new LineMergeGraph();
	this.mergedLineStrings = null;
	this.factory = null;
	this.edgeStrings = null;
	if (arguments.length === 0) return;
}
module.exports = LineMerger
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Collection = require('java/util/Collection');
var EdgeString = require('com/vividsolutions/jts/operation/linemerge/EdgeString');
var LineMergeGraph = require('com/vividsolutions/jts/operation/linemerge/LineMergeGraph');
var GeometryComponentFilter = require('com/vividsolutions/jts/geom/GeometryComponentFilter');
var ArrayList = require('java/util/ArrayList');
var Assert = require('com/vividsolutions/jts/util/Assert');
var GraphComponent = require('com/vividsolutions/jts/planargraph/GraphComponent');
LineMerger.prototype.buildEdgeStringsForUnprocessedNodes = function () {
	for (var i = this.graph.getNodes().iterator(); i.hasNext(); ) {
		var node = i.next();
		if (!node.isMarked()) {
			Assert.isTrue(node.getDegree() === 2);
			this.buildEdgeStringsStartingAt(node);
			node.setMarked(true);
		}
	}
};
LineMerger.prototype.buildEdgeStringsForNonDegree2Nodes = function () {
	for (var i = this.graph.getNodes().iterator(); i.hasNext(); ) {
		var node = i.next();
		if (node.getDegree() !== 2) {
			this.buildEdgeStringsStartingAt(node);
			node.setMarked(true);
		}
	}
};
LineMerger.prototype.buildEdgeStringsForObviousStartNodes = function () {
	this.buildEdgeStringsForNonDegree2Nodes();
};
LineMerger.prototype.getMergedLineStrings = function () {
	this.merge();
	return this.mergedLineStrings;
};
LineMerger.prototype.buildEdgeStringsStartingAt = function (node) {
	for (var i = node.getOutEdges().iterator(); i.hasNext(); ) {
		var directedEdge = i.next();
		if (directedEdge.getEdge().isMarked()) {
			continue;
		}
		this.edgeStrings.add(this.buildEdgeStringStartingWith(directedEdge));
	}
};
LineMerger.prototype.merge = function () {
	if (this.mergedLineStrings !== null) {
		return null;
	}
	GraphComponent.setMarked(this.graph.nodeIterator(), false);
	GraphComponent.setMarked(this.graph.edgeIterator(), false);
	this.edgeStrings = new ArrayList();
	this.buildEdgeStringsForObviousStartNodes();
	this.buildEdgeStringsForIsolatedLoops();
	this.mergedLineStrings = new ArrayList();
	for (var i = this.edgeStrings.iterator(); i.hasNext(); ) {
		var edgeString = i.next();
		this.mergedLineStrings.add(edgeString.toLineString());
	}
};
LineMerger.prototype.buildEdgeStringStartingWith = function (start) {
	var edgeString = new EdgeString(this.factory);
	var current = start;
	do {
		edgeString.add(current);
		current.getEdge().setMarked(true);
		current = current.getNext();
	} while (current !== null && current !== start);
	return edgeString;
};
LineMerger.prototype.add = function (...args) {
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
					this.mergedLineStrings = null;
					for (var i = geometries.iterator(); i.hasNext(); ) {
						var geometry = i.next();
						this.add(geometry);
					}
				})(...args);
			} else if (args[0] instanceof LineString) {
				return ((...args) => {
					let [lineString] = args;
					if (this.factory === null) {
						this.factory = lineString.getFactory();
					}
					this.graph.addEdge(lineString);
				})(...args);
			}
	}
};
LineMerger.prototype.buildEdgeStringsForIsolatedLoops = function () {
	this.buildEdgeStringsForUnprocessedNodes();
};

