import AbstractPreparedPolygonContains from './AbstractPreparedPolygonContains';
export default class PreparedPolygonContains extends AbstractPreparedPolygonContains {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [prepPoly] = args;
						super(prepPoly);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static contains(prep, geom) {
		var polyInt = new PreparedPolygonContains(prep);
		return polyInt.contains(geom);
	}
	fullTopologicalPredicate(geom) {
		var isContained = this.prepPoly.getGeometry().contains(geom);
		return isContained;
	}
	contains(geom) {
		return this.eval(geom);
	}
	getClass() {
		return PreparedPolygonContains;
	}
}

