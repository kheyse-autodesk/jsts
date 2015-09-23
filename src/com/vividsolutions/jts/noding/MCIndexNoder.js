function MCIndexNoder(...args) {
	this.monoChains = new ArrayList();
	this.index = new STRtree();
	this.idCounter = 0;
	this.nodedSegStrings = null;
	this.nOverlaps = 0;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [si] = args;
				MCIndexNoder.super_.call(this, si);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
			})(...args);
	}
}
module.exports = MCIndexNoder
var SinglePassNoder = require('com/vividsolutions/jts/noding/SinglePassNoder');
var util = require('util');
util.inherits(MCIndexNoder, SinglePassNoder)
var STRtree = require('com/vividsolutions/jts/index/strtree/STRtree');
var NodedSegmentString = require('com/vividsolutions/jts/noding/NodedSegmentString');
var MonotoneChainBuilder = require('com/vividsolutions/jts/index/chain/MonotoneChainBuilder');
var ArrayList = require('java/util/ArrayList');
MCIndexNoder.prototype.getMonotoneChains = function () {
	return this.monoChains;
};
MCIndexNoder.prototype.getNodedSubstrings = function () {
	return NodedSegmentString.getNodedSubstrings(this.nodedSegStrings);
};
MCIndexNoder.prototype.getIndex = function () {
	return this.index;
};
MCIndexNoder.prototype.add = function (segStr) {
	var segChains = MonotoneChainBuilder.getChains(segStr.getCoordinates(), segStr);
	for (var i = segChains.iterator(); i.hasNext(); ) {
		var mc = i.next();
		mc.setId(this.idCounter++);
		this.index.insert(mc.getEnvelope(), mc);
		this.monoChains.add(mc);
	}
};
MCIndexNoder.prototype.computeNodes = function (inputSegStrings) {
	this.nodedSegStrings = inputSegStrings;
	for (var i = inputSegStrings.iterator(); i.hasNext(); ) {
		this.add(i.next());
	}
	this.intersectChains();
};
MCIndexNoder.prototype.intersectChains = function () {
	var overlapAction = new SegmentOverlapAction(this.segInt);
	for (var i = this.monoChains.iterator(); i.hasNext(); ) {
		var queryChain = i.next();
		var overlapChains = this.index.query(queryChain.getEnvelope());
		for (var j = overlapChains.iterator(); j.hasNext(); ) {
			var testChain = j.next();
			if (testChain.getId() > queryChain.getId()) {
				queryChain.computeOverlaps(testChain, overlapAction);
				this.nOverlaps++;
			}
			if (this.segInt.isDone()) return null;
		}
	}
};

