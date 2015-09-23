function BufferBuilder(bufParams) {
	this.bufParams = null;
	this.workingPrecisionModel = null;
	this.workingNoder = null;
	this.geomFact = null;
	this.graph = null;
	this.edgeList = new EdgeList();
	if (arguments.length === 0) return;
	this.bufParams = bufParams;
}
module.exports = BufferBuilder
var Location = require('com/vividsolutions/jts/geom/Location');
var BufferSubgraph = require('com/vividsolutions/jts/operation/buffer/BufferSubgraph');
var PolygonBuilder = require('com/vividsolutions/jts/operation/overlay/PolygonBuilder');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var MCIndexNoder = require('com/vividsolutions/jts/noding/MCIndexNoder');
var OffsetCurveBuilder = require('com/vividsolutions/jts/operation/buffer/OffsetCurveBuilder');
var Collections = require('java/util/Collections');
var SubgraphDepthLocater = require('com/vividsolutions/jts/operation/buffer/SubgraphDepthLocater');
var OffsetCurveSetBuilder = require('com/vividsolutions/jts/operation/buffer/OffsetCurveSetBuilder');
var Label = require('com/vividsolutions/jts/geomgraph/Label');
var OverlayNodeFactory = require('com/vividsolutions/jts/operation/overlay/OverlayNodeFactory');
var EdgeList = require('com/vividsolutions/jts/geomgraph/EdgeList');
var ArrayList = require('java/util/ArrayList');
var RobustLineIntersector = require('com/vividsolutions/jts/algorithm/RobustLineIntersector');
var IntersectionAdder = require('com/vividsolutions/jts/noding/IntersectionAdder');
var Edge = require('com/vividsolutions/jts/geomgraph/Edge');
var PlanarGraph = require('com/vividsolutions/jts/geomgraph/PlanarGraph');
BufferBuilder.prototype.setWorkingPrecisionModel = function (pm) {
	this.workingPrecisionModel = pm;
};
BufferBuilder.prototype.insertUniqueEdge = function (e) {
	var existingEdge = this.edgeList.findEqualEdge(e);
	if (existingEdge !== null) {
		var existingLabel = existingEdge.getLabel();
		var labelToMerge = e.getLabel();
		if (!existingEdge.isPointwiseEqual(e)) {
			labelToMerge = new Label(e.getLabel());
			labelToMerge.flip();
		}
		existingLabel.merge(labelToMerge);
		var mergeDelta = BufferBuilder.depthDelta(labelToMerge);
		var existingDelta = existingEdge.getDepthDelta();
		var newDelta = existingDelta + mergeDelta;
		existingEdge.setDepthDelta(newDelta);
	} else {
		this.edgeList.add(e);
		e.setDepthDelta(BufferBuilder.depthDelta(e.getLabel()));
	}
};
BufferBuilder.prototype.buildSubgraphs = function (subgraphList, polyBuilder) {
	var processedGraphs = new ArrayList();
	for (var i = subgraphList.iterator(); i.hasNext(); ) {
		var subgraph = i.next();
		var p = subgraph.getRightmostCoordinate();
		var locater = new SubgraphDepthLocater(processedGraphs);
		var outsideDepth = locater.getDepth(p);
		subgraph.computeDepth(outsideDepth);
		subgraph.findResultEdges();
		processedGraphs.add(subgraph);
		polyBuilder.add(subgraph.getDirectedEdges(), subgraph.getNodes());
	}
};
BufferBuilder.prototype.createSubgraphs = function (graph) {
	var subgraphList = new ArrayList();
	for (var i = graph.getNodes().iterator(); i.hasNext(); ) {
		var node = i.next();
		if (!node.isVisited()) {
			var subgraph = new BufferSubgraph();
			subgraph.create(node);
			subgraphList.add(subgraph);
		}
	}
	Collections.sort(subgraphList, Collections.reverseOrder());
	return subgraphList;
};
BufferBuilder.prototype.createEmptyResultGeometry = function () {
	var emptyGeom = this.geomFact.createPolygon(null, null);
	return emptyGeom;
};
BufferBuilder.prototype.getNoder = function (precisionModel) {
	if (this.workingNoder !== null) return this.workingNoder;
	var noder = new MCIndexNoder();
	var li = new RobustLineIntersector();
	li.setPrecisionModel(precisionModel);
	noder.setSegmentIntersector(new IntersectionAdder(li));
	return noder;
};
BufferBuilder.prototype.buffer = function (g, distance) {
	var precisionModel = this.workingPrecisionModel;
	if (precisionModel === null) precisionModel = g.getPrecisionModel();
	this.geomFact = g.getFactory();
	var curveBuilder = new OffsetCurveBuilder(precisionModel, this.bufParams);
	var curveSetBuilder = new OffsetCurveSetBuilder(g, distance, curveBuilder);
	var bufferSegStrList = curveSetBuilder.getCurves();
	if (bufferSegStrList.size() <= 0) {
		return this.createEmptyResultGeometry();
	}
	this.computeNodedEdges(bufferSegStrList, precisionModel);
	this.graph = new PlanarGraph(new OverlayNodeFactory());
	this.graph.addEdges(this.edgeList.getEdges());
	var subgraphList = this.createSubgraphs(this.graph);
	var polyBuilder = new PolygonBuilder(this.geomFact);
	this.buildSubgraphs(subgraphList, polyBuilder);
	var resultPolyList = polyBuilder.getPolygons();
	if (resultPolyList.size() <= 0) {
		return this.createEmptyResultGeometry();
	}
	var resultGeom = this.geomFact.buildGeometry(resultPolyList);
	return resultGeom;
};
BufferBuilder.prototype.computeNodedEdges = function (bufferSegStrList, precisionModel) {
	var noder = this.getNoder(precisionModel);
	noder.computeNodes(bufferSegStrList);
	var nodedSegStrings = noder.getNodedSubstrings();
	for (var i = nodedSegStrings.iterator(); i.hasNext(); ) {
		var segStr = i.next();
		var pts = segStr.getCoordinates();
		if (pts.length === 2 && pts[0].equals2D(pts[1])) continue;
		var oldLabel = segStr.getData();
		var edge = new Edge(segStr.getCoordinates(), new Label(oldLabel));
		this.insertUniqueEdge(edge);
	}
};
BufferBuilder.prototype.setNoder = function (noder) {
	this.workingNoder = noder;
};
BufferBuilder.depthDelta = function (label) {
	var lLoc = label.getLocation(0, Position.LEFT);
	var rLoc = label.getLocation(0, Position.RIGHT);
	if (lLoc === Location.INTERIOR && rLoc === Location.EXTERIOR) return 1; else if (lLoc === Location.EXTERIOR && rLoc === Location.INTERIOR) return -1;
	return 0;
};
BufferBuilder.convertSegStrings = function (it) {
	var fact = new GeometryFactory();
	var lines = new ArrayList();
	while (it.hasNext()) {
		var ss = it.next();
		var line = fact.createLineString(ss.getCoordinates());
		lines.add(line);
	}
	return fact.buildGeometry(lines);
};

