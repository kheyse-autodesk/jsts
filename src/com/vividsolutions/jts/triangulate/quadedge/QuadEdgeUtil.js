function QuadEdgeUtil() {}
module.exports = QuadEdgeUtil
var ArrayList = require('java/util/ArrayList');
QuadEdgeUtil.findEdgesIncidentOnOrigin = function (start) {
	var incEdge = new ArrayList();
	var qe = start;
	do {
		incEdge.add(qe);
		qe = qe.oNext();
	} while (qe !== start);
	return incEdge;
};

