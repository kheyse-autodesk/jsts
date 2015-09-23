function TaggedLineString(...args) {
	this.parentLine = null;
	this.segs = null;
	this.resultSegs = new ArrayList();
	this.minimumSize = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [parentLine, minimumSize] = args;
				this.parentLine = parentLine;
				this.minimumSize = minimumSize;
				this.init();
			})(...args);
		case 1:
			return ((...args) => {
				let [parentLine] = args;
				TaggedLineString.call(this, parentLine, 2);
			})(...args);
	}
}
module.exports = TaggedLineString
var TaggedLineSegment = require('com/vividsolutions/jts/simplify/TaggedLineSegment');
var ArrayList = require('java/util/ArrayList');
TaggedLineString.prototype.addToResult = function (seg) {
	this.resultSegs.add(seg);
};
TaggedLineString.prototype.asLineString = function () {
	return this.parentLine.getFactory().createLineString(TaggedLineString.extractCoordinates(this.resultSegs));
};
TaggedLineString.prototype.getResultSize = function () {
	var resultSegsSize = this.resultSegs.size();
	return resultSegsSize === 0 ? 0 : resultSegsSize + 1;
};
TaggedLineString.prototype.getParent = function () {
	return this.parentLine;
};
TaggedLineString.prototype.getSegment = function (i) {
	return this.segs[i];
};
TaggedLineString.prototype.getParentCoordinates = function () {
	return this.parentLine.getCoordinates();
};
TaggedLineString.prototype.getMinimumSize = function () {
	return this.minimumSize;
};
TaggedLineString.prototype.asLinearRing = function () {
	return this.parentLine.getFactory().createLinearRing(TaggedLineString.extractCoordinates(this.resultSegs));
};
TaggedLineString.prototype.getSegments = function () {
	return this.segs;
};
TaggedLineString.prototype.init = function () {
	var pts = this.parentLine.getCoordinates();
	this.segs = [];
	for (var i = 0; i < pts.length - 1; i++) {
		var seg = new TaggedLineSegment(pts[i], pts[i + 1], this.parentLine, i);
		this.segs[i] = seg;
	}
};
TaggedLineString.prototype.getResultCoordinates = function () {
	return TaggedLineString.extractCoordinates(this.resultSegs);
};
TaggedLineString.extractCoordinates = function (segs) {
	var pts = [];
	var seg = null;
	for (var i = 0; i < segs.size(); i++) {
		seg = segs.get(i);
		pts[i] = seg.p0;
	}
	pts[pts.length - 1] = seg.p1;
	return pts;
};

