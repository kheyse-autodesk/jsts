function TaggedLineSegment(...args) {
	this.parent = null;
	this.index = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [p0, p1] = args;
				TaggedLineSegment.call(this, p0, p1, null, -1);
			})(...args);
		case 4:
			return ((...args) => {
				let [p0, p1, parent, index] = args;
				TaggedLineSegment.super_.call(this, p0, p1);
				this.parent = parent;
				this.index = index;
			})(...args);
	}
}
module.exports = TaggedLineSegment
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
var util = require('util');
util.inherits(TaggedLineSegment, LineSegment)
TaggedLineSegment.prototype.getIndex = function () {
	return this.index;
};
TaggedLineSegment.prototype.getParent = function () {
	return this.parent;
};

