function ObjectCounter() {
	this.counts = new HashMap();
	if (arguments.length === 0) return;
}
module.exports = ObjectCounter
var HashMap = require('java/util/HashMap');
ObjectCounter.prototype.count = function (o) {
	var counter = this.counts.get(o);
	if (counter === null) return 0; else return counter.count();
};
ObjectCounter.prototype.add = function (o) {
	var counter = this.counts.get(o);
	if (counter === null) this.counts.put(o, new Counter(1)); else counter.increment();
};
function Counter(...args) {
	this.count = 0;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [count] = args;
				this.count = count;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
			})(...args);
	}
}
Counter.prototype.count = function () {
	return this.count;
};
Counter.prototype.increment = function () {
	this.count++;
};
ObjectCounter.Counter = Counter;

