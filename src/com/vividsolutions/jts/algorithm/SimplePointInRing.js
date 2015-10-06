import CGAlgorithms from 'com/vividsolutions/jts/algorithm/CGAlgorithms';
import PointInRing from 'com/vividsolutions/jts/algorithm/PointInRing';
export default class SimplePointInRing {
	constructor(...args) {
		(() => {
			this.pts = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [ring] = args;
						this.pts = ring.getCoordinates();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [PointInRing];
	}
	isInside(pt) {
		return CGAlgorithms.isPointInRing(pt, this.pts);
	}
}

