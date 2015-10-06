import TreeSet from 'java/util/TreeSet';
import LineString from 'com/vividsolutions/jts/geom/LineString';
import Geometry from 'com/vividsolutions/jts/geom/Geometry';
import GeometryFactory from 'com/vividsolutions/jts/geom/GeometryFactory';
import Collection from 'java/util/Collection';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import LineMergeGraph from 'com/vividsolutions/jts/operation/linemerge/LineMergeGraph';
import LinkedList from 'java/util/LinkedList';
import ArrayList from 'java/util/ArrayList';
import ConnectedSubgraphFinder from 'com/vividsolutions/jts/planargraph/algorithm/ConnectedSubgraphFinder';
import Assert from 'com/vividsolutions/jts/util/Assert';
import MultiLineString from 'com/vividsolutions/jts/geom/MultiLineString';
import GraphComponent from 'com/vividsolutions/jts/planargraph/GraphComponent';
export default class LineSequencer {
	constructor(...args) {
		(() => {
			this.graph = new LineMergeGraph();
			this.factory = new GeometryFactory();
			this.lineCount = 0;
			this.isRun = false;
			this.sequencedGeometry = null;
			this.isSequenceable = false;
		})();
	}
	get interfaces_() {
		return [];
	}
	static findUnvisitedBestOrientedDE(node) {
		var wellOrientedDE = null;
		var unvisitedDE = null;
		for (var i = node.getOutEdges().iterator(); i.hasNext(); ) {
			var de = i.next();
			if (!de.getEdge().isVisited()) {
				unvisitedDE = de;
				if (de.getEdgeDirection()) wellOrientedDE = de;
			}
		}
		if (wellOrientedDE !== null) return wellOrientedDE;
		return unvisitedDE;
	}
	static findLowestDegreeNode(graph) {
		var minDegree = Integer.MAX_VALUE;
		var minDegreeNode = null;
		for (var i = graph.nodeIterator(); i.hasNext(); ) {
			var node = i.next();
			if (minDegreeNode === null || node.getDegree() < minDegree) {
				minDegree = node.getDegree();
				minDegreeNode = node;
			}
		}
		return minDegreeNode;
	}
	static isSequenced(geom) {
		if (!(geom instanceof MultiLineString)) {
			return true;
		}
		var mls = geom;
		var prevSubgraphNodes = new TreeSet();
		var lastNode = null;
		var currNodes = new ArrayList();
		for (var i = 0; i < mls.getNumGeometries(); i++) {
			var line = mls.getGeometryN(i);
			var startNode = line.getCoordinateN(0);
			var endNode = line.getCoordinateN(line.getNumPoints() - 1);
			if (prevSubgraphNodes.contains(startNode)) return false;
			if (prevSubgraphNodes.contains(endNode)) return false;
			if (lastNode !== null) {
				if (!startNode.equals(lastNode)) {
					prevSubgraphNodes.addAll(currNodes);
					currNodes.clear();
				}
			}
			currNodes.add(startNode);
			currNodes.add(endNode);
			lastNode = endNode;
		}
		return true;
	}
	static reverse(line) {
		var pts = line.getCoordinates();
		var revPts = [];
		var len = pts.length;
		for (var i = 0; i < len; i++) {
			revPts[len - 1 - i] = new Coordinate(pts[i]);
		}
		return line.getFactory().createLineString(revPts);
	}
	static sequence(geom) {
		var sequencer = new LineSequencer();
		sequencer.add(geom);
		return sequencer.getSequencedLineStrings();
	}
	addLine(lineString) {
		if (this.factory === null) {
			this.factory = lineString.getFactory();
		}
		this.graph.addEdge(lineString);
		this.lineCount++;
	}
	hasSequence(graph) {
		var oddDegreeCount = 0;
		for (var i = graph.nodeIterator(); i.hasNext(); ) {
			var node = i.next();
			if (node.getDegree() % 2 === 1) oddDegreeCount++;
		}
		return oddDegreeCount <= 2;
	}
	computeSequence() {
		if (this.isRun) {
			return null;
		}
		this.isRun = true;
		var sequences = this.findSequences();
		if (sequences === null) return null;
		this.sequencedGeometry = this.buildSequencedGeometry(sequences);
		this.isSequenceable = true;
		var finalLineCount = this.sequencedGeometry.getNumGeometries();
		Assert.isTrue(this.lineCount === finalLineCount, "Lines were missing from result");
		Assert.isTrue(this.sequencedGeometry instanceof LineString || this.sequencedGeometry instanceof MultiLineString, "Result is not lineal");
	}
	findSequences() {
		var sequences = new ArrayList();
		var csFinder = new ConnectedSubgraphFinder(this.graph);
		var subgraphs = csFinder.getConnectedSubgraphs();
		for (var i = subgraphs.iterator(); i.hasNext(); ) {
			var subgraph = i.next();
			if (this.hasSequence(subgraph)) {
				var seq = this.findSequence(subgraph);
				sequences.add(seq);
			} else {
				return null;
			}
		}
		return sequences;
	}
	addReverseSubpath(de, lit, expectedClosed) {
		var endNode = de.getToNode();
		var fromNode = null;
		while (true) {
			lit.add(de.getSym());
			de.getEdge().setVisited(true);
			fromNode = de.getFromNode();
			var unvisitedOutDE = LineSequencer.findUnvisitedBestOrientedDE(fromNode);
			if (unvisitedOutDE === null) break;
			de = unvisitedOutDE.getSym();
		}
		if (expectedClosed) {
			Assert.isTrue(fromNode === endNode, "path not contiguous");
		}
	}
	findSequence(graph) {
		GraphComponent.setVisited(graph.edgeIterator(), false);
		var startNode = LineSequencer.findLowestDegreeNode(graph);
		var startDE = startNode.getOutEdges().iterator().next();
		var startDESym = startDE.getSym();
		var seq = new LinkedList();
		var lit = seq.listIterator();
		this.addReverseSubpath(startDESym, lit, false);
		while (lit.hasPrevious()) {
			var prev = lit.previous();
			var unvisitedOutDE = LineSequencer.findUnvisitedBestOrientedDE(prev.getFromNode());
			if (unvisitedOutDE !== null) this.addReverseSubpath(unvisitedOutDE.getSym(), lit, true);
		}
		var orientedSeq = this.orient(seq);
		return orientedSeq;
	}
	reverse(seq) {
		var newSeq = new LinkedList();
		for (var i = seq.iterator(); i.hasNext(); ) {
			var de = i.next();
			newSeq.addFirst(de.getSym());
		}
		return newSeq;
	}
	orient(seq) {
		var startEdge = seq.get(0);
		var endEdge = seq.get(seq.size() - 1);
		var startNode = startEdge.getFromNode();
		var endNode = endEdge.getToNode();
		var flipSeq = false;
		var hasDegree1Node = startNode.getDegree() === 1 || endNode.getDegree() === 1;
		if (hasDegree1Node) {
			var hasObviousStartNode = false;
			if (endEdge.getToNode().getDegree() === 1 && endEdge.getEdgeDirection() === false) {
				hasObviousStartNode = true;
				flipSeq = true;
			}
			if (startEdge.getFromNode().getDegree() === 1 && startEdge.getEdgeDirection() === true) {
				hasObviousStartNode = true;
				flipSeq = false;
			}
			if (!hasObviousStartNode) {
				if (startEdge.getFromNode().getDegree() === 1) flipSeq = true;
			}
		}
		if (flipSeq) return this.reverse(seq);
		return seq;
	}
	buildSequencedGeometry(sequences) {
		var lines = new ArrayList();
		for (var i1 = sequences.iterator(); i1.hasNext(); ) {
			var seq = i1.next();
			for (var i2 = seq.iterator(); i2.hasNext(); ) {
				var de = i2.next();
				var e = de.getEdge();
				var line = e.getLine();
				var lineToAdd = line;
				if (!de.getEdgeDirection() && !line.isClosed()) lineToAdd = LineSequencer.reverse(line);
				lines.add(lineToAdd);
			}
		}
		if (lines.size() === 0) return this.factory.createMultiLineString([]);
		return this.factory.buildGeometry(lines);
	}
	getSequencedLineStrings() {
		this.computeSequence();
		return this.sequencedGeometry;
	}
	isSequenceable() {
		this.computeSequence();
		return this.isSequenceable;
	}
	add(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Geometry) {
						return ((...args) => {
							let [geometry] = args;
							geometry.apply(new (class {
								filter(component) {
									if (component instanceof LineString) {
										this.addLine(component);
									}
								}
							})());
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(Collection) > -1) {
						return ((...args) => {
							let [geometries] = args;
							for (var i = geometries.iterator(); i.hasNext(); ) {
								var geometry = i.next();
								this.add(geometry);
							}
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
}

