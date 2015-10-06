import MarkHalfEdge from 'com/vividsolutions/jts/edgegraph/MarkHalfEdge';
export default class DissolveHalfEdge extends MarkHalfEdge {
	constructor(...args) {
		super();
		(() => {
			this.isStart = false;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [orig] = args;
						super(orig);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	setStart() {
		this.isStart = true;
	}
	isStart() {
		return this.isStart;
	}
}

