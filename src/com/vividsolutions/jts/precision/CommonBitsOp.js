import BufferOp from 'com/vividsolutions/jts/operation/buffer/BufferOp';
import CommonBitsRemover from 'com/vividsolutions/jts/precision/CommonBitsRemover';
import OverlayOp from 'com/vividsolutions/jts/operation/overlay/OverlayOp';
export default class CommonBitsOp {
	constructor(...args) {
		(() => {
			this.returnToOriginalPrecision = true;
			this.cbr = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						overloads.call(this, true);
					})(...args);
				case 1:
					return ((...args) => {
						let [returnToOriginalPrecision] = args;
						this.returnToOriginalPrecision = returnToOriginalPrecision;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	computeResultPrecision(result) {
		if (this.returnToOriginalPrecision) this.cbr.addCommonBits(result);
		return result;
	}
	union(geom0, geom1) {
		var geom = this.removeCommonBits(geom0, geom1);
		return this.computeResultPrecision(OverlayOp.union(geom[0], geom[1]));
	}
	intersection(geom0, geom1) {
		var geom = this.removeCommonBits(geom0, geom1);
		return this.computeResultPrecision(OverlayOp.intersection(geom[0], geom[1]));
	}
	removeCommonBits(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geom0] = args;
						this.cbr = new CommonBitsRemover();
						this.cbr.add(geom0);
						var geom = this.cbr.removeCommonBits(geom0.clone());
						return geom;
					})(...args);
				case 2:
					return ((...args) => {
						let [geom0, geom1] = args;
						this.cbr = new CommonBitsRemover();
						this.cbr.add(geom0);
						this.cbr.add(geom1);
						var geom = [];
						geom[0] = this.cbr.removeCommonBits(geom0.clone());
						geom[1] = this.cbr.removeCommonBits(geom1.clone());
						return geom;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	buffer(geom0, distance) {
		var geom = this.removeCommonBits(geom0);
		return this.computeResultPrecision(BufferOp.bufferOp(geom, distance));
	}
	symDifference(geom0, geom1) {
		var geom = this.removeCommonBits(geom0, geom1);
		return this.computeResultPrecision(OverlayOp.symDifference(geom[0], geom[1]));
	}
	difference(geom0, geom1) {
		var geom = this.removeCommonBits(geom0, geom1);
		return this.computeResultPrecision(OverlayOp.difference(geom[0], geom[1]));
	}
}

