import Coordinate from '../geom/Coordinate';
export default class CommonBitsRemover {
	constructor(...args) {
		(() => {
			this.commonCoord = null;
			this.ccFilter = new CommonCoordinateFilter();
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
	addCommonBits(geom) {
		var trans = new Translater(this.commonCoord);
		geom.apply(trans);
		geom.geometryChanged();
	}
	removeCommonBits(geom) {
		if (this.commonCoord.x === 0.0 && this.commonCoord.y === 0.0) return geom;
		var invCoord = new Coordinate(this.commonCoord);
		invCoord.x = -invCoord.x;
		invCoord.y = -invCoord.y;
		var trans = new Translater(invCoord);
		geom.apply(trans);
		geom.geometryChanged();
		return geom;
	}
	getCommonCoordinate() {
		return this.commonCoord;
	}
	add(geom) {
		geom.apply(this.ccFilter);
		this.commonCoord = this.ccFilter.getCommonCoordinate();
	}
	getClass() {
		return CommonBitsRemover;
	}
}

