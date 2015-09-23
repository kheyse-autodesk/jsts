function SinglePassNoder(...args) {
	this.segInt = null;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [segInt] = args;
				this.setSegmentIntersector(segInt);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
			})(...args);
	}
}
module.exports = SinglePassNoder
SinglePassNoder.prototype.setSegmentIntersector = function (segInt) {
	this.segInt = segInt;
};

