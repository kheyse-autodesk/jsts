function Key(interval) {
	this.pt = 0.0;
	this.level = 0;
	this.interval = null;
	if (arguments.length === 0) return;
	this.computeKey(interval);
}
module.exports = Key
var Interval = require('com/vividsolutions/jts/index/bintree/Interval');
var DoubleBits = require('com/vividsolutions/jts/index/quadtree/DoubleBits');
Key.prototype.getInterval = function () {
	return this.interval;
};
Key.prototype.getLevel = function () {
	return this.level;
};
Key.prototype.computeKey = function (itemInterval) {
	this.level = Key.computeLevel(itemInterval);
	this.interval = new Interval();
	this.computeInterval(this.level, itemInterval);
	while (!this.interval.contains(itemInterval)) {
		this.level += 1;
		this.computeInterval(this.level, itemInterval);
	}
};
Key.prototype.computeInterval = function (level, itemInterval) {
	var size = DoubleBits.powerOf2(level);
	this.pt = Math.floor(itemInterval.getMin() / size) * size;
	this.interval.init(this.pt, this.pt + size);
};
Key.prototype.getPoint = function () {
	return this.pt;
};
Key.computeLevel = function (interval) {
	var dx = interval.getWidth();
	var level = DoubleBits.exponent(dx) + 1;
	return level;
};

