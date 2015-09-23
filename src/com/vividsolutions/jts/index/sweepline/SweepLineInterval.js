function SweepLineInterval(...args) {
	this.min = null;
	this.max = null;
	this.item = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [min, max] = args;
				SweepLineInterval.call(this, min, max, null);
			})(...args);
		case 3:
			return ((...args) => {
				let [min, max, item] = args;
				this.min = min < max ? min : max;
				this.max = max > min ? max : min;
				this.item = item;
			})(...args);
	}
}
module.exports = SweepLineInterval
SweepLineInterval.prototype.getMin = function () {
	return this.min;
};
SweepLineInterval.prototype.getItem = function () {
	return this.item;
};
SweepLineInterval.prototype.getMax = function () {
	return this.max;
};

