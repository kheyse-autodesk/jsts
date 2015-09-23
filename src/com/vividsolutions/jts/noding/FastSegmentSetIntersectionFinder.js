function FastSegmentSetIntersectionFinder(baseSegStrings) {
	this.segSetMutInt = null;
	if (arguments.length === 0) return;
	this.segSetMutInt = new MCIndexSegmentSetMutualIntersector(baseSegStrings);
}
module.exports = FastSegmentSetIntersectionFinder
var SegmentIntersectionDetector = require('com/vividsolutions/jts/noding/SegmentIntersectionDetector');
var MCIndexSegmentSetMutualIntersector = require('com/vividsolutions/jts/noding/MCIndexSegmentSetMutualIntersector');
FastSegmentSetIntersectionFinder.prototype.getSegmentSetIntersector = function () {
	return this.segSetMutInt;
};
FastSegmentSetIntersectionFinder.prototype.intersects = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [segStrings, intDetector] = args;
				this.segSetMutInt.process(segStrings, intDetector);
				return intDetector.hasIntersection();
			})(...args);
		case 1:
			return ((...args) => {
				let [segStrings] = args;
				var intFinder = new SegmentIntersectionDetector();
				return this.intersects(segStrings, intFinder);
			})(...args);
	}
};

