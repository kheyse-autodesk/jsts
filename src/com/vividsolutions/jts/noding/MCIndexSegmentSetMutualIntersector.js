function MCIndexSegmentSetMutualIntersector(baseSegStrings) {
	this.index = new STRtree();
	if (arguments.length === 0) return;
	this.initBaseSegments(baseSegStrings);
}
module.exports = MCIndexSegmentSetMutualIntersector
var STRtree = require('com/vividsolutions/jts/index/strtree/STRtree');
var MonotoneChainBuilder = require('com/vividsolutions/jts/index/chain/MonotoneChainBuilder');
var ArrayList = require('java/util/ArrayList');
MCIndexSegmentSetMutualIntersector.prototype.addToIndex = function (segStr) {
	var segChains = MonotoneChainBuilder.getChains(segStr.getCoordinates(), segStr);
	for (var i = segChains.iterator(); i.hasNext(); ) {
		var mc = i.next();
		this.index.insert(mc.getEnvelope(), mc);
	}
};
MCIndexSegmentSetMutualIntersector.prototype.addToMonoChains = function (segStr, monoChains) {
	var segChains = MonotoneChainBuilder.getChains(segStr.getCoordinates(), segStr);
	for (var i = segChains.iterator(); i.hasNext(); ) {
		var mc = i.next();
		monoChains.add(mc);
	}
};
MCIndexSegmentSetMutualIntersector.prototype.process = function (segStrings, segInt) {
	var monoChains = new ArrayList();
	for (var i = segStrings.iterator(); i.hasNext(); ) {
		this.addToMonoChains(i.next(), monoChains);
	}
	this.intersectChains(monoChains, segInt);
};
MCIndexSegmentSetMutualIntersector.prototype.initBaseSegments = function (segStrings) {
	for (var i = segStrings.iterator(); i.hasNext(); ) {
		this.addToIndex(i.next());
	}
	this.index.build();
};
MCIndexSegmentSetMutualIntersector.prototype.getIndex = function () {
	return this.index;
};
MCIndexSegmentSetMutualIntersector.prototype.intersectChains = function (monoChains, segInt) {
	var overlapAction = new SegmentOverlapAction(segInt);
	for (var i = monoChains.iterator(); i.hasNext(); ) {
		var queryChain = i.next();
		var overlapChains = this.index.query(queryChain.getEnvelope());
		for (var j = overlapChains.iterator(); j.hasNext(); ) {
			var testChain = j.next();
			queryChain.computeOverlaps(testChain, overlapAction);
			if (segInt.isDone()) return null;
		}
	}
};

