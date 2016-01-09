import AbstractPreparedPolygonContains from './AbstractPreparedPolygonContains';
export default class PreparedPolygonCovers extends AbstractPreparedPolygonContains {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [prepPoly] = args;
						super(prepPoly);
						this.requireSomePointInInterior = false;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static covers(prep, geom) {
		var polyInt = new PreparedPolygonCovers(prep);
		return polyInt.covers(geom);
	}
	fullTopologicalPredicate(geom) {
		var result = this.prepPoly.getGeometry().covers(geom);
		return result;
	}
	covers(geom) {
		return this.eval(geom);
	}
	getClass() {
		return PreparedPolygonCovers;
	}
}

