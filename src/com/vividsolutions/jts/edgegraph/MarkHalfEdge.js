import HalfEdge from './HalfEdge';
export default class MarkHalfEdge extends HalfEdge {
	constructor(...args) {
		super();
		(() => {
			this.isMarked = false;
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
	static setMarkBoth(e, isMarked) {
		e.setMark(isMarked);
		e.sym().setMark(isMarked);
	}
	static isMarked(e) {
		return e.isMarked();
	}
	static setMark(e, isMarked) {
		e.setMark(isMarked);
	}
	static markBoth(e) {
		e.mark();
		e.sym().mark();
	}
	static mark(e) {
		e.mark();
	}
	mark() {
		this.isMarked = true;
	}
	setMark(isMarked) {
		this.isMarked = isMarked;
	}
	isMarked() {
		return this.isMarked;
	}
	getClass() {
		return MarkHalfEdge;
	}
}

