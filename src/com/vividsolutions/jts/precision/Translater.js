import CoordinateSequenceFilter from '../geom/CoordinateSequenceFilter';
export default class Translater {
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

