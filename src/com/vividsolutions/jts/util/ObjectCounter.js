import HashMap from 'java/util/HashMap';
export default class ObjectCounter {
	constructor(...args) {
		(() => {
			this.counts = new HashMap();
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get Counter() {
		return Counter;
	}
	count(o) {
		var counter = this.counts.get(o);
		if (counter === null) return 0; else return counter.count();
	}
	add(o) {
		var counter = this.counts.get(o);
		if (counter === null) this.counts.put(o, new Counter(1)); else counter.increment();
	}
	getClass() {
		return ObjectCounter;
	}
}
class Counter {
	constructor(...args) {
		(() => {
			this.count = 0;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
				case 1:
					return ((...args) => {
						let [count] = args;
						this.count = count;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	count() {
		return this.count;
	}
	increment() {
		this.count++;
	}
	getClass() {
		return Counter;
	}
}

