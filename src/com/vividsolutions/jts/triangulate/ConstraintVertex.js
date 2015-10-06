import Vertex from 'com/vividsolutions/jts/triangulate/quadedge/Vertex';
export default class ConstraintVertex extends Vertex {
	constructor(...args) {
		super();
		(() => {
			this.isOnConstraint = null;
			this.constraint = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [p] = args;
						super(p);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	getConstraint() {
		return this.constraint;
	}
	setOnConstraint(isOnConstraint) {
		this.isOnConstraint = isOnConstraint;
	}
	merge(other) {
		if (other.isOnConstraint) {
			this.isOnConstraint = true;
			this.constraint = other.constraint;
		}
	}
	isOnConstraint() {
		return this.isOnConstraint;
	}
	setConstraint(constraint) {
		this.isOnConstraint = true;
		this.constraint = constraint;
	}
}

