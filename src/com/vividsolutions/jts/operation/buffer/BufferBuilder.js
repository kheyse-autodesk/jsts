import Location from 'com/vividsolutions/jts/geom/Location';
import BufferSubgraph from 'com/vividsolutions/jts/operation/buffer/BufferSubgraph';
import PolygonBuilder from 'com/vividsolutions/jts/operation/overlay/PolygonBuilder';
import GeometryFactory from 'com/vividsolutions/jts/geom/GeometryFactory';
import Position from 'com/vividsolutions/jts/geomgraph/Position';
import MCIndexNoder from 'com/vividsolutions/jts/noding/MCIndexNoder';
import OffsetCurveBuilder from 'com/vividsolutions/jts/operation/buffer/OffsetCurveBuilder';
import Collections from 'java/util/Collections';
import SubgraphDepthLocater from 'com/vividsolutions/jts/operation/buffer/SubgraphDepthLocater';
import OffsetCurveSetBuilder from 'com/vividsolutions/jts/operation/buffer/OffsetCurveSetBuilder';
import Label from 'com/vividsolutions/jts/geomgraph/Label';
import OverlayNodeFactory from 'com/vividsolutions/jts/operation/overlay/OverlayNodeFactory';
import EdgeList from 'com/vividsolutions/jts/geomgraph/EdgeList';
import ArrayList from 'java/util/ArrayList';
import RobustLineIntersector from 'com/vividsolutions/jts/algorithm/RobustLineIntersector';
import IntersectionAdder from 'com/vividsolutions/jts/noding/IntersectionAdder';
import Edge from 'com/vividsolutions/jts/geomgraph/Edge';
import PlanarGraph from 'com/vividsolutions/jts/geomgraph/PlanarGraph';
export default class BufferBuilder {
	constructor(...args) {
		(() => {
			this.bufParams = null;
			this.workingPrecisionModel = null;
			this.workingNoder = null;
			this.geomFact = null;
			this.graph = null;
			this.edgeList = new EdgeList();
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [bufParams] = args;
						this.bufParams = bufParams;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static depthDelta(label) {
		var lLoc = label.getLocation(0, Position.LEFT);
		var rLoc = label.getLocation(0, Position.RIGHT);
		if (lLoc === Location.INTERIOR && rLoc === Location.EXTERIOR) return 1; else if (lLoc === Location.EXTERIOR && rLoc === Location.INTERIOR) return -1;
		return 0;
	}
	static convertSegStrings(it) {
		var fact = new GeometryFactory();
		var lines = new ArrayList();
		while (it.hasNext()) {
			var ss = it.next();
			var line = fact.createLineString(ss.getCoordinates());
			lines.add(line);
		}
		return fact.buildGeometry(lines);
	}
	setWorkingPrecisionModel(pm) {
		this.workingPrecisionModel = pm;
	}
	insertUniqueEdge(e) {
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
	}
	buildSubgraphs(subgraphList, polyBuilder) {
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
	}
	createSubgraphs(graph) {
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
	}
	createEmptyResultGeometry() {
		var emptyGeom = this.geomFact.createPolygon();
		return emptyGeom;
	}
	getNoder(precisionModel) {
		if (this.workingNoder !== null) return this.workingNoder;
		var noder = new MCIndexNoder();
		var li = new RobustLineIntersector();
		li.setPrecisionModel(precisionModel);
		noder.setSegmentIntersector(new IntersectionAdder(li));
		return noder;
	}
	buffer(g, distance) {
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
	}
	computeNodedEdges(bufferSegStrList, precisionModel) {
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
	}
	setNoder(noder) {
		this.workingNoder = noder;
	}
	getClass() {
		return BufferBuilder;
	}
}

