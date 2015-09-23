function Bintree() {
	this.root = null;
	this.minExtent = 1.0;
	if (arguments.length === 0) return;
	this.root = new Root();
}
module.exports = Bintree
var Root = require('com/vividsolutions/jts/index/bintree/Root');
var Interval = require('com/vividsolutions/jts/index/bintree/Interval');
var ArrayList = require('java/util/ArrayList');
Bintree.prototype.size = function () {
	if (this.root !== null) return this.root.size();
	return 0;
};
Bintree.prototype.insert = function (itemInterval, item) {
	this.collectStats(itemInterval);
	var insertInterval = Bintree.ensureExtent(itemInterval, this.minExtent);
	this.root.insert(insertInterval, item);
};
Bintree.prototype.query = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [interval, foundItems] = args;
				this.root.addAllItemsFromOverlapping(interval, foundItems);
			})(...args);
		case 1:
			if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [x] = args;
					return this.query(new Interval(x, x));
				})(...args);
			} else if (args[0] instanceof Interval) {
				return ((...args) => {
					let [interval] = args;
					var foundItems = new ArrayList();
					this.query(interval, foundItems);
					return foundItems;
				})(...args);
			}
	}
};
Bintree.prototype.iterator = function () {
	var foundItems = new ArrayList();
	this.root.addAllItems(foundItems);
	return foundItems.iterator();
};
Bintree.prototype.remove = function (itemInterval, item) {
	var insertInterval = Bintree.ensureExtent(itemInterval, this.minExtent);
	return this.root.remove(insertInterval, item);
};
Bintree.prototype.collectStats = function (interval) {
	var del = interval.getWidth();
	if (del < this.minExtent && del > 0.0) this.minExtent = del;
};
Bintree.prototype.depth = function () {
	if (this.root !== null) return this.root.depth();
	return 0;
};
Bintree.prototype.nodeSize = function () {
	if (this.root !== null) return this.root.nodeSize();
	return 0;
};
Bintree.ensureExtent = function (itemInterval, minExtent) {
	var min = itemInterval.getMin();
	var max = itemInterval.getMax();
	if (min !== max) return itemInterval;
	if (min === max) {
		min = min - minExtent / 2.0;
		max = min + minExtent / 2.0;
	}
	return new Interval(min, max);
};

