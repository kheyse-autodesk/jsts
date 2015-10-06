import SimilarityMeasure from 'com/vividsolutions/jts/algorithm/match/SimilarityMeasure';
import OverlayOp from 'com/vividsolutions/jts/operation/overlay/OverlayOp';
export default class AreaSimilarityMeasure {
	constructor(...args) {
		(() => {})();
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
		return [SimilarityMeasure];
	}
	measure(g1, g2) {
		var areaInt = OverlayOp.intersection(g1, g2).getArea();
		var areaUnion = OverlayOp.union(g1, g2).getArea();
		return areaInt / areaUnion;
	}
	getClass() {
		return AreaSimilarityMeasure;
	}
}

