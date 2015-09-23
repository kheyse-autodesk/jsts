function Interval(...args) {
	this.min = null;
	this.max = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [min, max] = args;
				Assert.isTrue(min <= max);
				this.min = min;
				this.max = max;
			})(...args);
		case 1:
			return ((...args) => {
				let [other] = args;
				Interval.call(this, other.min, other.max);
			})(...args);
	}
}
module.exports = Interval
var Assert = require('com/vividsolutions/jts/util/Assert');
Interval.prototype.expandToInclude = function (other) {
	this.max = Math.max(this.max, other.max);
	this.min = Math.min(this.min, other.min);
	return this;
};
Interval.prototype.getCentre = function () {
	return (this.min + this.max) / 2;
};
Interval.prototype.intersects = function (other) {
	return !(other.min > this.max || other.max < this.min);
};
Interval.prototype.equals = function (o) {
	if (!(o instanceof Interval)) {
		return false;
	}
	var other = o;
	return this.min === other.min && this.max === other.max;
};

