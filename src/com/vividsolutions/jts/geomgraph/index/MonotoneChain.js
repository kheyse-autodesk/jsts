function MonotoneChain(mce, chainIndex) {
	this.mce = null;
	this.chainIndex = null;
	if (arguments.length === 0) return;
	this.mce = mce;
	this.chainIndex = chainIndex;
}
module.exports = MonotoneChain
MonotoneChain.prototype.computeIntersections = function (mc, si) {
	this.mce.computeIntersectsForChain(this.chainIndex, mc.mce, mc.chainIndex, si);
};

