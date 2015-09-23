function BufferSubgraph() {
	this.finder = null;
	this.dirEdgeList = new ArrayList();
	this.nodes = new ArrayList();
	this.rightMostCoord = null;
	this.env = null;
	if (arguments.length === 0) return;
	this.finder = new RightmostEdgeFinder();
}
module.exports = BufferSubgraph
var HashSet = require('java/util/HashSet');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var Stack = require('java/util/Stack');
var RightmostEdgeFinder = require('com/vividsolutions/jts/operation/buffer/RightmostEdgeFinder');
var TopologyException = require('com/vividsolutions/jts/geom/TopologyException');
var LinkedList = require('java/util/LinkedList');
var ArrayList = require('java/util/ArrayList');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
BufferSubgraph.prototype.clearVisitedEdges = function () {
	for (var it = this.dirEdgeList.iterator(); it.hasNext(); ) {
		var de = it.next();
		de.setVisited(false);
	}
};
BufferSubgraph.prototype.getRightmostCoordinate = function () {
	return this.rightMostCoord;
};
BufferSubgraph.prototype.computeNodeDepth = function (n) {
	var startEdge = null;
	for (var i = n.getEdges().iterator(); i.hasNext(); ) {
		var de = i.next();
		if (de.isVisited() || de.getSym().isVisited()) {
			startEdge = de;
			break;
		}
	}
	if (startEdge === null) throw new TopologyException("unable to find edge to compute depths at " + n.getCoordinate());
	n.getEdges().computeDepths(startEdge);
	for (var i = n.getEdges().iterator(); i.hasNext(); ) {
		var de = i.next();
		de.setVisited(true);
		this.copySymDepths(de);
	}
};
BufferSubgraph.prototype.computeDepth = function (outsideDepth) {
	this.clearVisitedEdges();
	var de = this.finder.getEdge();
	var n = de.getNode();
	var label = de.getLabel();
	de.setEdgeDepths(Position.RIGHT, outsideDepth);
	this.copySymDepths(de);
	this.computeDepths(de);
};
BufferSubgraph.prototype.create = function (node) {
	this.addReachable(node);
	this.finder.findEdge(this.dirEdgeList);
	this.rightMostCoord = this.finder.getCoordinate();
};
BufferSubgraph.prototype.findResultEdges = function () {
	for (var it = this.dirEdgeList.iterator(); it.hasNext(); ) {
		var de = it.next();
		if (de.getDepth(Position.RIGHT) >= 1 && de.getDepth(Position.LEFT) <= 0 && !de.isInteriorAreaEdge()) {
			de.setInResult(true);
		}
	}
};
BufferSubgraph.prototype.computeDepths = function (startEdge) {
	var nodesVisited = new HashSet();
	var nodeQueue = new LinkedList();
	var startNode = startEdge.getNode();
	nodeQueue.addLast(startNode);
	nodesVisited.add(startNode);
	startEdge.setVisited(true);
	while (!nodeQueue.isEmpty()) {
		var n = nodeQueue.removeFirst();
		nodesVisited.add(n);
		this.computeNodeDepth(n);
		for (var i = n.getEdges().iterator(); i.hasNext(); ) {
			var de = i.next();
			var sym = de.getSym();
			if (sym.isVisited()) continue;
			var adjNode = sym.getNode();
			if (!nodesVisited.contains(adjNode)) {
				nodeQueue.addLast(adjNode);
				nodesVisited.add(adjNode);
			}
		}
	}
};
BufferSubgraph.prototype.compareTo = function (o) {
	var graph = o;
	if (this.x < graph.rightMostCoord.x) {
		return -1;
	}
	if (this.x > graph.rightMostCoord.x) {
		return 1;
	}
	return 0;
};
BufferSubgraph.prototype.getEnvelope = function () {
	if (this.env === null) {
		var edgeEnv = new Envelope();
		for (var it = this.dirEdgeList.iterator(); it.hasNext(); ) {
			var dirEdge = it.next();
			var pts = dirEdge.getEdge().getCoordinates();
			for (var i = 0; i < pts.length - 1; i++) {
				edgeEnv.expandToInclude(pts[i]);
			}
		}
		this.env = edgeEnv;
	}
	return this.env;
};
BufferSubgraph.prototype.addReachable = function (startNode) {
	var nodeStack = new Stack();
	nodeStack.add(startNode);
	while (!nodeStack.empty()) {
		var node = nodeStack.pop();
		this.add(node, nodeStack);
	}
};
BufferSubgraph.prototype.copySymDepths = function (de) {
	var sym = de.getSym();
	sym.setDepth(Position.LEFT, de.getDepth(Position.RIGHT));
	sym.setDepth(Position.RIGHT, de.getDepth(Position.LEFT));
};
BufferSubgraph.prototype.add = function (node, nodeStack) {
	node.setVisited(true);
	this.nodes.add(node);
	for (var i = node.getEdges().iterator(); i.hasNext(); ) {
		var de = i.next();
		this.dirEdgeList.add(de);
		var sym = de.getSym();
		var symNode = sym.getNode();
		if (!symNode.isVisited()) nodeStack.push(symNode);
	}
};
BufferSubgraph.prototype.getNodes = function () {
	return this.nodes;
};
BufferSubgraph.prototype.getDirectedEdges = function () {
	return this.dirEdgeList;
};

