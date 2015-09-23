function EdgeEndBundleStar() {
	if (arguments.length === 0) return;
}
module.exports = EdgeEndBundleStar
var EdgeEndStar = require('com/vividsolutions/jts/geomgraph/EdgeEndStar');
var util = require('util');
util.inherits(EdgeEndBundleStar, EdgeEndStar)
var EdgeEndBundle = require('com/vividsolutions/jts/operation/relate/EdgeEndBundle');
EdgeEndBundleStar.prototype.updateIM = function (im) {
	for (var it = this.iterator(); it.hasNext(); ) {
		var esb = it.next();
		esb.updateIM(im);
	}
};
EdgeEndBundleStar.prototype.insert = function (e) {
	var eb = this.edgeMap.get(e);
	if (eb === null) {
		eb = new EdgeEndBundle(e);
		this.insertEdgeEnd(e, eb);
	} else {
		eb.insert(e);
	}
};

