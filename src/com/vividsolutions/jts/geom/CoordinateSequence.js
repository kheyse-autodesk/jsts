function CoordinateSequence() {}
module.exports = CoordinateSequence
CoordinateSequence.prototype.setOrdinate = function (index, ordinateIndex, value) {};
CoordinateSequence.prototype.size = function () {};
CoordinateSequence.prototype.getOrdinate = function (index, ordinateIndex) {};
CoordinateSequence.prototype.getCoordinate = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [index, coord] = args;
			})(...args);
		case 1:
			return ((...args) => {
				let [i] = args;
			})(...args);
	}
};
CoordinateSequence.prototype.getCoordinateCopy = function (i) {};
CoordinateSequence.prototype.getDimension = function () {};
CoordinateSequence.prototype.getX = function (index) {};
CoordinateSequence.prototype.clone = function () {};
CoordinateSequence.prototype.expandEnvelope = function (env) {};
CoordinateSequence.prototype.getY = function (index) {};
CoordinateSequence.prototype.toCoordinateArray = function () {};

