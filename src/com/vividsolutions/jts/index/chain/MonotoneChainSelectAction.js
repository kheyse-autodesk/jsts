function MonotoneChainSelectAction() {}
module.exports = MonotoneChainSelectAction
MonotoneChainSelectAction.prototype.select = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [mc, startIndex] = args;
				mc.getLineSegment(startIndex, this.selectedSegment);
				this.select(this.selectedSegment);
			})(...args);
		case 1:
			return ((...args) => {
				let [seg] = args;
			})(...args);
	}
};

