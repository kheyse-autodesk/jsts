function PointBuilder(op, geometryFactory, ptLocator) {
	this.op = null;
	this.geometryFactory = null;
	this.resultPointList = new ArrayList();
	if (arguments.length === 0) return;
	this.op = op;
	this.geometryFactory = geometryFactory;
}
module.exports = PointBuilder
var ArrayList = require('java/util/ArrayList');
var OverlayOp = require('com/vividsolutions/jts/operation/overlay/OverlayOp');
PointBuilder.prototype.filterCoveredNodeToPoint = function (n) {
	var coord = n.getCoordinate();
	if (!this.op.isCoveredByLA(coord)) {
		var pt = this.geometryFactory.createPoint(coord);
		this.resultPointList.add(pt);
	}
};
PointBuilder.prototype.extractNonCoveredResultNodes = function (opCode) {
	for (var nodeit = this.op.getGraph().getNodes().iterator(); nodeit.hasNext(); ) {
		var n = nodeit.next();
		if (n.isInResult()) continue;
		if (n.isIncidentEdgeInResult()) continue;
		if (n.getEdges().getDegree() === 0 || opCode === OverlayOp.INTERSECTION) {
			var label = n.getLabel();
			if (OverlayOp.isResultOfOp(label, opCode)) {
				this.filterCoveredNodeToPoint(n);
			}
		}
	}
};
PointBuilder.prototype.build = function (opCode) {
	this.extractNonCoveredResultNodes(opCode);
	return this.resultPointList;
};

