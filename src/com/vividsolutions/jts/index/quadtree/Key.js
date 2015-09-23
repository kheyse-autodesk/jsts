function Key(itemEnv) {
	this.pt = new Coordinate();
	this.level = 0;
	this.env = null;
	if (arguments.length === 0) return;
	this.computeKey(itemEnv);
}
module.exports = Key
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var DoubleBits = require('com/vividsolutions/jts/index/quadtree/DoubleBits');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
Key.prototype.getLevel = function () {
	return this.level;
};
Key.prototype.computeKey = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [level, itemEnv] = args;
				var quadSize = DoubleBits.powerOf2(level);
				this.pt.x = Math.floor(itemEnv.getMinX() / quadSize) * quadSize;
				this.pt.y = Math.floor(itemEnv.getMinY() / quadSize) * quadSize;
				this.env.init(this.pt.x, this.pt.x + quadSize, this.pt.y, this.pt.y + quadSize);
			})(...args);
		case 1:
			return ((...args) => {
				let [itemEnv] = args;
				this.level = Key.computeQuadLevel(itemEnv);
				this.env = new Envelope();
				this.computeKey(this.level, itemEnv);
				while (!this.env.contains(itemEnv)) {
					this.level += 1;
					this.computeKey(this.level, itemEnv);
				}
			})(...args);
	}
};
Key.prototype.getEnvelope = function () {
	return this.env;
};
Key.prototype.getCentre = function () {
	return new Coordinate((this.env.getMinX() + this.env.getMaxX()) / 2, (this.env.getMinY() + this.env.getMaxY()) / 2);
};
Key.prototype.getPoint = function () {
	return this.pt;
};
Key.computeQuadLevel = function (env) {
	var dx = env.getWidth();
	var dy = env.getHeight();
	var dMax = dx > dy ? dx : dy;
	var level = DoubleBits.exponent(dMax) + 1;
	return level;
};

