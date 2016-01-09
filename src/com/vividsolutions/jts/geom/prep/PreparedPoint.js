import BasicPreparedGeometry from './BasicPreparedGeometry';
export default class PreparedPoint extends BasicPreparedGeometry {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [point] = args;
						super(point);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	intersects(g) {
		if (!this.envelopesIntersect(g)) return false;
		return this.isAnyTargetComponentInTest(g);
	}
	getClass() {
		return PreparedPoint;
	}
}

