import RelateComputer from './RelateComputer';
import GeometryGraphOperation from '../GeometryGraphOperation';
export default class RelateOp extends GeometryGraphOperation {
	constructor(...args) {
		super();
		(() => {
			this.relate = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [g0, g1] = args;
						super(g0, g1);
						this.relate = new RelateComputer(this.arg);
					})(...args);
				case 3:
					return ((...args) => {
						let [g0, g1, boundaryNodeRule] = args;
						super(g0, g1, boundaryNodeRule);
						this.relate = new RelateComputer(this.arg);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static relate(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [a, b] = args;
						var relOp = new RelateOp(a, b);
						var im = relOp.getIntersectionMatrix();
						return im;
					})(...args);
				case 3:
					return ((...args) => {
						let [a, b, boundaryNodeRule] = args;
						var relOp = new RelateOp(a, b, boundaryNodeRule);
						var im = relOp.getIntersectionMatrix();
						return im;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	getIntersectionMatrix() {
		return this.relate.computeIM();
	}
	getClass() {
		return RelateOp;
	}
}

