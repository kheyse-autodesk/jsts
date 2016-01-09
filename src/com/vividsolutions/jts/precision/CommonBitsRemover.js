import Coordinate from '../geom/Coordinate';
import CoordinateSequenceFilter from '../geom/CoordinateSequenceFilter';
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
	static get Translater() {
		return Translater;
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
class Translater {
	constructor(...args) {
		(() => {
			this.trans = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [trans] = args;
						this.trans = trans;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [CoordinateSequenceFilter];
	}
	filter(seq, i) {
		var xp = seq.getOrdinate(i, 0) + this.trans.x;
		var yp = seq.getOrdinate(i, 1) + this.trans.y;
		seq.setOrdinate(i, 0, xp);
		seq.setOrdinate(i, 1, yp);
	}
	isDone() {
		return false;
	}
	isGeometryChanged() {
		return true;
	}
	getClass() {
		return Translater;
	}
}

