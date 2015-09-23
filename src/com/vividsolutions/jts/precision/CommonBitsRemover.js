function CommonBitsRemover() {
	this.commonCoord = null;
	this.ccFilter = new CommonCoordinateFilter();
	if (arguments.length === 0) return;
}
module.exports = CommonBitsRemover
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
CommonBitsRemover.prototype.addCommonBits = function (geom) {
	var trans = new Translater(this.commonCoord);
	geom.apply(trans);
	geom.geometryChanged();
};
CommonBitsRemover.prototype.removeCommonBits = function (geom) {
	if (this.commonCoord.x === 0.0 && this.commonCoord.y === 0.0) return geom;
	var invCoord = new Coordinate(this.commonCoord);
	invCoord.x = -invCoord.x;
	invCoord.y = -invCoord.y;
	var trans = new Translater(invCoord);
	geom.apply(trans);
	geom.geometryChanged();
	return geom;
};
CommonBitsRemover.prototype.getCommonCoordinate = function () {
	return this.commonCoord;
};
CommonBitsRemover.prototype.add = function (geom) {
	geom.apply(this.ccFilter);
	this.commonCoord = this.ccFilter.getCommonCoordinate();
};

