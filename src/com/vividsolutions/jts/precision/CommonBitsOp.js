function CommonBitsOp(...args) {
	this.returnToOriginalPrecision = true;
	this.cbr = null;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [returnToOriginalPrecision] = args;
				this.returnToOriginalPrecision = returnToOriginalPrecision;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				CommonBitsOp.call(this, true);
			})(...args);
	}
}
module.exports = CommonBitsOp
var CommonBitsRemover = require('com/vividsolutions/jts/precision/CommonBitsRemover');
CommonBitsOp.prototype.computeResultPrecision = function (result) {
	if (this.returnToOriginalPrecision) this.cbr.addCommonBits(result);
	return result;
};
CommonBitsOp.prototype.union = function (geom0, geom1) {
	var geom = this.removeCommonBits(geom0, geom1);
	return this.computeResultPrecision(geom[0].union(geom[1]));
};
CommonBitsOp.prototype.intersection = function (geom0, geom1) {
	var geom = this.removeCommonBits(geom0, geom1);
	return this.computeResultPrecision(geom[0].intersection(geom[1]));
};
CommonBitsOp.prototype.removeCommonBits = function (...args) {
	switch (args.length) {
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
		case 1:
			return ((...args) => {
				let [geom0] = args;
				this.cbr = new CommonBitsRemover();
				this.cbr.add(geom0);
				var geom = this.cbr.removeCommonBits(geom0.clone());
				return geom;
			})(...args);
	}
};
CommonBitsOp.prototype.buffer = function (geom0, distance) {
	var geom = this.removeCommonBits(geom0);
	return this.computeResultPrecision(geom.buffer(distance));
};
CommonBitsOp.prototype.symDifference = function (geom0, geom1) {
	var geom = this.removeCommonBits(geom0, geom1);
	return this.computeResultPrecision(geom[0].symDifference(geom[1]));
};
CommonBitsOp.prototype.difference = function (geom0, geom1) {
	var geom = this.removeCommonBits(geom0, geom1);
	return this.computeResultPrecision(geom[0].difference(geom[1]));
};

