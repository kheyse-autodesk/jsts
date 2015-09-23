function LastFoundQuadEdgeLocator(subdiv) {
	this.subdiv = null;
	this.lastEdge = null;
	if (arguments.length === 0) return;
	this.subdiv = subdiv;
	this.init();
}
module.exports = LastFoundQuadEdgeLocator
LastFoundQuadEdgeLocator.prototype.init = function () {
	this.lastEdge = this.findEdge();
};
LastFoundQuadEdgeLocator.prototype.locate = function (v) {
	if (!this.lastEdge.isLive()) {
		this.init();
	}
	var e = this.subdiv.locateFromEdge(v, this.lastEdge);
	this.lastEdge = e;
	return e;
};
LastFoundQuadEdgeLocator.prototype.findEdge = function () {
	var edges = this.subdiv.getEdges();
	return edges.iterator().next();
};

