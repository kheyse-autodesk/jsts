function AxisPlaneCoordinateSequence(seq, indexMap) {
	this.seq = null;
	this.indexMap = null;
	if (arguments.length === 0) return;
	this.seq = seq;
	this.indexMap = indexMap;
}
module.exports = AxisPlaneCoordinateSequence
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
AxisPlaneCoordinateSequence.prototype.setOrdinate = function (index, ordinateIndex, value) {
	throw new UnsupportedOperationException();
};
AxisPlaneCoordinateSequence.prototype.getZ = function (index) {
	return this.getOrdinate(index, CoordinateSequence.Z);
};
AxisPlaneCoordinateSequence.prototype.size = function () {
	return this.seq.size();
};
AxisPlaneCoordinateSequence.prototype.getOrdinate = function (index, ordinateIndex) {
	if (ordinateIndex > 1) return 0;
	return this.seq.getOrdinate(index, this.indexMap[ordinateIndex]);
};
AxisPlaneCoordinateSequence.prototype.getCoordinate = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [index, coord] = args;
				coord.x = this.getOrdinate(index, CoordinateSequence.X);
				coord.y = this.getOrdinate(index, CoordinateSequence.Y);
				coord.z = this.getOrdinate(index, CoordinateSequence.Z);
			})(...args);
		case 1:
			return ((...args) => {
				let [i] = args;
				return this.getCoordinateCopy(i);
			})(...args);
	}
};
AxisPlaneCoordinateSequence.prototype.getCoordinateCopy = function (i) {
	return new Coordinate(this.getX(i), this.getY(i), this.getZ(i));
};
AxisPlaneCoordinateSequence.prototype.getDimension = function () {
	return 2;
};
AxisPlaneCoordinateSequence.prototype.getX = function (index) {
	return this.getOrdinate(index, CoordinateSequence.X);
};
AxisPlaneCoordinateSequence.prototype.clone = function () {
	throw new UnsupportedOperationException();
};
AxisPlaneCoordinateSequence.prototype.expandEnvelope = function (env) {
	throw new UnsupportedOperationException();
};
AxisPlaneCoordinateSequence.prototype.getY = function (index) {
	return this.getOrdinate(index, CoordinateSequence.Y);
};
AxisPlaneCoordinateSequence.prototype.toCoordinateArray = function () {
	throw new UnsupportedOperationException();
};
AxisPlaneCoordinateSequence.projectToYZ = function (seq) {
	return new AxisPlaneCoordinateSequence(seq, AxisPlaneCoordinateSequence.YZ_INDEX);
};
AxisPlaneCoordinateSequence.projectToXZ = function (seq) {
	return new AxisPlaneCoordinateSequence(seq, AxisPlaneCoordinateSequence.XZ_INDEX);
};
AxisPlaneCoordinateSequence.projectToXY = function (seq) {
	return new AxisPlaneCoordinateSequence(seq, AxisPlaneCoordinateSequence.XY_INDEX);
};
AxisPlaneCoordinateSequence.XY_INDEX = [0, 1];
AxisPlaneCoordinateSequence.XZ_INDEX = [0, 2];
AxisPlaneCoordinateSequence.YZ_INDEX = [1, 2];

