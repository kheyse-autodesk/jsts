function LineSegmentIndex() {
	this.index = new Quadtree();
	if (arguments.length === 0) return;
}
module.exports = LineSegmentIndex
var Quadtree = require('com/vividsolutions/jts/index/quadtree/Quadtree');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
var ArrayList = require('java/util/ArrayList');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
var TaggedLineString = require('com/vividsolutions/jts/simplify/TaggedLineString');
LineSegmentIndex.prototype.remove = function (seg) {
	this.index.remove(new Envelope(seg.p0, seg.p1), seg);
};
LineSegmentIndex.prototype.add = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof TaggedLineString) {
				return ((...args) => {
					let [line] = args;
					var segs = line.getSegments();
					for (var i = 0; i < segs.length; i++) {
						var seg = segs[i];
						this.add(seg);
					}
				})(...args);
			} else if (args[0] instanceof LineSegment) {
				return ((...args) => {
					let [seg] = args;
					this.index.insert(new Envelope(seg.p0, seg.p1), seg);
				})(...args);
			}
	}
};
LineSegmentIndex.prototype.query = function (querySeg) {
	var env = new Envelope(querySeg.p0, querySeg.p1);
	var visitor = new LineSegmentVisitor(querySeg);
	this.index.query(env, visitor);
	var itemsFound = visitor.getItems();
	return itemsFound;
};
function LineSegmentVisitor(querySeg) {
	this.querySeg = null;
	this.items = new ArrayList();
	if (arguments.length === 0) return;
	this.querySeg = querySeg;
}
module.exports = LineSegmentVisitor
LineSegmentVisitor.prototype.visitItem = function (item) {
	var seg = item;
	if (Envelope.intersects(seg.p0, seg.p1, this.querySeg.p0, this.querySeg.p1)) this.items.add(item);
};
LineSegmentVisitor.prototype.getItems = function () {
	return this.items;
};

