export default class GraphComponent {
	constructor(...args) {
		(() => {
			this.isMarked = false;
			this.isVisited = false;
			this.data = null;
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
	static getComponentWithVisitedState(i, visitedState) {
		while (i.hasNext()) {
			var comp = i.next();
			if (comp.isVisited() === visitedState) return comp;
		}
		return null;
	}
	static setVisited(i, visited) {
		while (i.hasNext()) {
			var comp = i.next();
			comp.setVisited(visited);
		}
	}
	static setMarked(i, marked) {
		while (i.hasNext()) {
			var comp = i.next();
			comp.setMarked(marked);
		}
	}
	setVisited(isVisited) {
		this.isVisited = isVisited;
	}
	isMarked() {
		return this.isMarked;
	}
	setData(data) {
		this.data = data;
	}
	getData() {
		return this.data;
	}
	setMarked(isMarked) {
		this.isMarked = isMarked;
	}
	getContext() {
		return this.data;
	}
	isVisited() {
		return this.isVisited;
	}
	setContext(data) {
		this.data = data;
	}
}

