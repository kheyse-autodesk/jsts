import ArrayList from 'java/util/ArrayList';
export default class PriorityQueue {
	constructor(...args) {
		(() => {
			this.size = null;
			this.items = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						this.size = 0;
						this.items = new ArrayList();
						this.items.add(null);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	poll() {
		if (this.isEmpty()) return null;
		var minItem = this.items.get(1);
		this.items.set(1, this.items.get(this.size));
		this.size -= 1;
		this.reorder(1);
		return minItem;
	}
	size() {
		return this.size;
	}
	reorder(hole) {
		var child = null;
		var tmp = this.items.get(hole);
		for (; hole * 2 <= this.size; hole = child) {
			child = hole * 2;
			if (child !== this.size && this.items.get(child + 1).compareTo(this.items.get(child)) < 0) child++;
			if (this.items.get(child).compareTo(tmp) < 0) this.items.set(hole, this.items.get(child)); else break;
		}
		this.items.set(hole, tmp);
	}
	clear() {
		this.size = 0;
		this.items.clear();
	}
	isEmpty() {
		return this.size === 0;
	}
	add(x) {
		this.items.add(null);
		this.size += 1;
		var hole = this.size;
		this.items.set(0, x);
		for (; x.compareTo(this.items.get(hole / 2)) < 0; hole /= 2) {
			this.items.set(hole, this.items.get(hole / 2));
		}
		this.items.set(hole, x);
	}
	getClass() {
		return PriorityQueue;
	}
}

