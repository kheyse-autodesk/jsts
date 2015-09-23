function MonotoneChainOverlapAction() {}
module.exports = MonotoneChainOverlapAction
MonotoneChainOverlapAction.prototype.overlap = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [seg1, seg2] = args;
			})(...args);
		case 4:
			return ((...args) => {
				let [mc1, start1, mc2, start2] = args;
				mc1.getLineSegment(start1, this.overlapSeg1);
				mc2.getLineSegment(start2, this.overlapSeg2);
				this.overlap(this.overlapSeg1, this.overlapSeg2);
			})(...args);
	}
};

