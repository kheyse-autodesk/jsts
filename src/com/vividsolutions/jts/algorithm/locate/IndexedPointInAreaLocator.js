function IndexedPointInAreaLocator(g) {
	this.index = null;
	if (arguments.length === 0) return;
	if (!(g instanceof Polygonal)) throw new IllegalArgumentException("Argument must be Polygonal");
	this.index = new IntervalIndexedGeometry(g);
}
module.exports = IndexedPointInAreaLocator
var SortedPackedIntervalRTree = require('com/vividsolutions/jts/index/intervalrtree/SortedPackedIntervalRTree');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
var Polygonal = require('com/vividsolutions/jts/geom/Polygonal');
var LinearComponentExtracter = require('com/vividsolutions/jts/geom/util/LinearComponentExtracter');
var ArrayListVisitor = require('com/vividsolutions/jts/index/ArrayListVisitor');
var RayCrossingCounter = require('com/vividsolutions/jts/algorithm/RayCrossingCounter');
IndexedPointInAreaLocator.prototype.locate = function (p) {
	var rcc = new RayCrossingCounter(p);
	var visitor = new SegmentVisitor(rcc);
	this.index.query(p.y, p.y, visitor);
	return rcc.getLocation();
};
function SegmentVisitor(counter) {
	this.counter = null;
	if (arguments.length === 0) return;
	this.counter = counter;
}
SegmentVisitor.prototype.visitItem = function (item) {
	var seg = item;
	this.counter.countSegment(seg.getCoordinate(0), seg.getCoordinate(1));
};
IndexedPointInAreaLocator.SegmentVisitor = SegmentVisitor;
function IntervalIndexedGeometry(geom) {
	this.index = new SortedPackedIntervalRTree();
	if (arguments.length === 0) return;
	this.init(geom);
}
IntervalIndexedGeometry.prototype.init = function (geom) {
	var lines = LinearComponentExtracter.getLines(geom);
	for (var i = lines.iterator(); i.hasNext(); ) {
		var line = i.next();
		var pts = line.getCoordinates();
		this.addLine(pts);
	}
};
IntervalIndexedGeometry.prototype.addLine = function (pts) {
	for (var i = 1; i < pts.length; i++) {
		var seg = new LineSegment(pts[i - 1], pts[i]);
		var min = Math.min(seg.p0.y, seg.p1.y);
		var max = Math.max(seg.p0.y, seg.p1.y);
		this.index.insert(min, max, seg);
	}
};
IntervalIndexedGeometry.prototype.query = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [min, max] = args;
				var visitor = new ArrayListVisitor();
				this.index.query(min, max, visitor);
				return visitor.getItems();
			})(...args);
		case 3:
			return ((...args) => {
				let [min, max, visitor] = args;
				this.index.query(min, max, visitor);
			})(...args);
	}
};
IndexedPointInAreaLocator.IntervalIndexedGeometry = IntervalIndexedGeometry;

