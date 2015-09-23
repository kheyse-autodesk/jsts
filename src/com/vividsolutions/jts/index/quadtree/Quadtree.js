function Quadtree() {
	this.root = null;
	this.minExtent = 1.0;
	if (arguments.length === 0) return;
	this.root = new Root();
}
module.exports = Quadtree
var Root = require('com/vividsolutions/jts/index/quadtree/Root');
var ArrayList = require('java/util/ArrayList');
var ArrayListVisitor = require('com/vividsolutions/jts/index/ArrayListVisitor');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
Quadtree.prototype.size = function () {
	if (this.root !== null) return this.root.size();
	return 0;
};
Quadtree.prototype.insert = function (itemEnv, item) {
	this.collectStats(itemEnv);
	var insertEnv = Quadtree.ensureExtent(itemEnv, this.minExtent);
	this.root.insert(insertEnv, item);
};
Quadtree.prototype.query = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [searchEnv, visitor] = args;
				this.root.visit(searchEnv, visitor);
			})(...args);
		case 1:
			return ((...args) => {
				let [searchEnv] = args;
				var visitor = new ArrayListVisitor();
				this.query(searchEnv, visitor);
				return visitor.getItems();
			})(...args);
	}
};
Quadtree.prototype.queryAll = function () {
	var foundItems = new ArrayList();
	this.root.addAllItems(foundItems);
	return foundItems;
};
Quadtree.prototype.remove = function (itemEnv, item) {
	var posEnv = Quadtree.ensureExtent(itemEnv, this.minExtent);
	return this.root.remove(posEnv, item);
};
Quadtree.prototype.collectStats = function (itemEnv) {
	var delX = itemEnv.getWidth();
	if (delX < this.minExtent && delX > 0.0) this.minExtent = delX;
	var delY = itemEnv.getHeight();
	if (delY < this.minExtent && delY > 0.0) this.minExtent = delY;
};
Quadtree.prototype.depth = function () {
	if (this.root !== null) return this.root.depth();
	return 0;
};
Quadtree.prototype.isEmpty = function () {
	if (this.root === null) return true;
	return false;
};
Quadtree.ensureExtent = function (itemEnv, minExtent) {
	var minx = itemEnv.getMinX();
	var maxx = itemEnv.getMaxX();
	var miny = itemEnv.getMinY();
	var maxy = itemEnv.getMaxY();
	if (minx !== maxx && miny !== maxy) return itemEnv;
	if (minx === maxx) {
		minx = minx - minExtent / 2.0;
		maxx = minx + minExtent / 2.0;
	}
	if (miny === maxy) {
		miny = miny - minExtent / 2.0;
		maxy = miny + minExtent / 2.0;
	}
	return new Envelope(minx, maxx, miny, maxy);
};
Quadtree.serialVersionUID = -7461163625812743604;

