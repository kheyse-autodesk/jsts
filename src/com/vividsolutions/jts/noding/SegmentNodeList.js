import SegmentNode from 'com/vividsolutions/jts/noding/SegmentNode';
import Iterator from 'java/util/Iterator';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import NodedSegmentString from 'com/vividsolutions/jts/noding/NodedSegmentString';
import ArrayList from 'java/util/ArrayList';
import RuntimeException from 'java/lang/RuntimeException';
import Assert from 'com/vividsolutions/jts/util/Assert';
import TreeMap from 'java/util/TreeMap';
export default class SegmentNodeList {
	constructor(...args) {
		(() => {
			this.nodeMap = new TreeMap();
			this.edge = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [edge] = args;
						this.edge = edge;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	addCollapsedNodes() {
		var collapsedVertexIndexes = new ArrayList();
		this.findCollapsesFromInsertedNodes(collapsedVertexIndexes);
		this.findCollapsesFromExistingVertices(collapsedVertexIndexes);
		for (var it = collapsedVertexIndexes.iterator(); it.hasNext(); ) {
			var vertexIndex = it.next().intValue();
			this.add(this.edge.getCoordinate(vertexIndex), vertexIndex);
		}
	}
	print(out) {
		out.println("Intersections:");
		for (var it = this.iterator(); it.hasNext(); ) {
			var ei = it.next();
			ei.print(out);
		}
	}
	findCollapsesFromExistingVertices(collapsedVertexIndexes) {
		for (var i = 0; i < this.edge.size() - 2; i++) {
			var p0 = this.edge.getCoordinate(i);
			var p1 = this.edge.getCoordinate(i + 1);
			var p2 = this.edge.getCoordinate(i + 2);
			if (p0.equals2D(p2)) {
				collapsedVertexIndexes.add(i + 1);
			}
		}
	}
	iterator() {
		return this.nodeMap.values().iterator();
	}
	addSplitEdges(edgeList) {
		this.addEndpoints();
		this.addCollapsedNodes();
		var it = this.iterator();
		var eiPrev = it.next();
		while (it.hasNext()) {
			var ei = it.next();
			var newEdge = this.createSplitEdge(eiPrev, ei);
			edgeList.add(newEdge);
			eiPrev = ei;
		}
	}
	findCollapseIndex(ei0, ei1, collapsedVertexIndex) {
		if (!ei0.coord.equals2D(ei1.coord)) return false;
		var numVerticesBetween = ei1.segmentIndex - ei0.segmentIndex;
		if (!ei1.isInterior()) {
			numVerticesBetween--;
		}
		if (numVerticesBetween === 1) {
			collapsedVertexIndex[0] = ei0.segmentIndex + 1;
			return true;
		}
		return false;
	}
	findCollapsesFromInsertedNodes(collapsedVertexIndexes) {
		var collapsedVertexIndex = [];
		var it = this.iterator();
		var eiPrev = it.next();
		while (it.hasNext()) {
			var ei = it.next();
			var isCollapsed = this.findCollapseIndex(eiPrev, ei, collapsedVertexIndex);
			if (isCollapsed) collapsedVertexIndexes.add(collapsedVertexIndex[0]);
			eiPrev = ei;
		}
	}
	getEdge() {
		return this.edge;
	}
	addEndpoints() {
		var maxSegIndex = this.edge.size() - 1;
		this.add(this.edge.getCoordinate(0), 0);
		this.add(this.edge.getCoordinate(maxSegIndex), maxSegIndex);
	}
	createSplitEdge(ei0, ei1) {
		var npts = ei1.segmentIndex - ei0.segmentIndex + 2;
		var lastSegStartPt = this.edge.getCoordinate(ei1.segmentIndex);
		var useIntPt1 = ei1.isInterior() || !ei1.coord.equals2D(lastSegStartPt);
		if (!useIntPt1) {
			npts--;
		}
		var pts = [];
		var ipt = 0;
		pts[ipt++] = new Coordinate(ei0.coord);
		for (var i = ei0.segmentIndex + 1; i <= ei1.segmentIndex; i++) {
			pts[ipt++] = this.edge.getCoordinate(i);
		}
		if (useIntPt1) pts[ipt] = ei1.coord;
		return new NodedSegmentString(pts, this.edge.getData());
	}
	add(intPt, segmentIndex) {
		var eiNew = new SegmentNode(this.edge, intPt, segmentIndex, this.edge.getSegmentOctant(segmentIndex));
		var ei = this.nodeMap.get(eiNew);
		if (ei !== null) {
			Assert.isTrue(ei.coord.equals2D(intPt), "Found equal nodes with different coordinates");
			return ei;
		}
		this.nodeMap.put(eiNew, eiNew);
		return eiNew;
	}
	checkSplitEdgesCorrectness(splitEdges) {
		var edgePts = this.edge.getCoordinates();
		var split0 = splitEdges.get(0);
		var pt0 = split0.getCoordinate(0);
		if (!pt0.equals2D(edgePts[0])) throw new RuntimeException("bad split edge start point at " + pt0);
		var splitn = splitEdges.get(splitEdges.size() - 1);
		var splitnPts = splitn.getCoordinates();
		var ptn = splitnPts[splitnPts.length - 1];
		if (!ptn.equals2D(edgePts[edgePts.length - 1])) throw new RuntimeException("bad split edge end point at " + ptn);
	}
}
class NodeVertexIterator {
	constructor(...args) {
		(() => {
			this.nodeList = null;
			this.edge = null;
			this.nodeIt = null;
			this.currNode = null;
			this.nextNode = null;
			this.currSegIndex = 0;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [nodeList] = args;
						this.nodeList = nodeList;
						this.edge = nodeList.getEdge();
						this.nodeIt = nodeList.iterator();
						this.readNextNode();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Iterator];
	}
	next() {
		if (this.currNode === null) {
			this.currNode = this.nextNode;
			this.currSegIndex = this.currNode.segmentIndex;
			this.readNextNode();
			return this.currNode;
		}
		if (this.nextNode === null) return null;
		if (this.nextNode.segmentIndex === this.currNode.segmentIndex) {
			this.currNode = this.nextNode;
			this.currSegIndex = this.currNode.segmentIndex;
			this.readNextNode();
			return this.currNode;
		}
		if (this.nextNode.segmentIndex > this.currNode.segmentIndex) {}
		return null;
	}
	remove() {
		throw new UnsupportedOperationException(this.getClass().getName());
	}
	hasNext() {
		if (this.nextNode === null) return false;
		return true;
	}
	readNextNode() {
		if (this.nodeIt.hasNext()) this.nextNode = this.nodeIt.next(); else this.nextNode = null;
	}
}

