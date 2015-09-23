function Interval(...args) {
	this.min = null;
	this.max = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [min, max] = args;
				this.init(min, max);
			})(...args);
		case 1:
			return ((...args) => {
				let [interval] = args;
				this.init(interval.min, interval.max);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				this.min = 0.0;
				this.max = 0.0;
			})(...args);
	}
}
module.exports = Interval
Interval.prototype.expandToInclude = function (interval) {
	if (interval.max > this.max) this.max = interval.max;
	if (interval.min < this.min) this.min = interval.min;
};
Interval.prototype.getWidth = function () {
	return this.max - this.min;
};
Interval.prototype.overlaps = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [min, max] = args;
				if (this.min > max || this.max < min) return false;
				return true;
			})(...args);
		case 1:
			return ((...args) => {
				let [interval] = args;
				return this.overlaps(interval.min, interval.max);
			})(...args);
	}
};
Interval.prototype.getMin = function () {
	return this.min;
};
Interval.prototype.toString = function () {
	return "[" + this.min + ", " + this.max + "]";
};
Interval.prototype.contains = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [min, max] = args;
				return min >= this.min && max <= this.max;
			})(...args);
		case 1:
			if (args[0] instanceof Interval) {
				return ((...args) => {
					let [interval] = args;
					return this.contains(interval.min, interval.max);
				})(...args);
			} else if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [p] = args;
					return p >= this.min && p <= this.max;
				})(...args);
			}
	}
};
Interval.prototype.init = function (min, max) {
	this.min = min;
	this.max = max;
	if (min > max) {
		this.min = max;
		this.max = min;
	}
};
Interval.prototype.getMax = function () {
	return this.max;
};

