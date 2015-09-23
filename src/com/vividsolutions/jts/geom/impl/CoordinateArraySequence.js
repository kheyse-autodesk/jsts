function CoordinateArraySequence(...args) {
	this.dimension = 3;
	this.coordinates = null;
	switch (args.length) {
		case 2:
			if (args[0] instanceof Array && Number.isInteger(args[1])) {
				return ((...args) => {
					let [coordinates, dimension] = args;
					this.coordinates = coordinates;
					this.dimension = dimension;
					if (coordinates === null) this.coordinates = [];
				})(...args);
			} else if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
				return ((...args) => {
					let [size, dimension] = args;
					this.coordinates = [];
					this.dimension = dimension;
					for (var i = 0; i < size; i++) {
						this.coordinates[i] = new Coordinate();
					}
				})(...args);
			}
		case 1:
			if (args[0] instanceof Array) {
				return ((...args) => {
					let [coordinates] = args;
					CoordinateArraySequence.call(this, coordinates, 3);
				})(...args);
			} else if (Number.isInteger(args[0])) {
				return ((...args) => {
					let [size] = args;
					this.coordinates = [];
					for (var i = 0; i < size; i++) {
						this.coordinates[i] = new Coordinate();
					}
				})(...args);
			} else if (args[0] instanceof CoordinateSequence) {
				return ((...args) => {
					let [coordSeq] = args;
					if (coordSeq === null) {
						this.coordinates = [];
						return null;
					}
					this.dimension = coordSeq.getDimension();
					this.coordinates = [];
					for (var i = 0; i < this.coordinates.length; i++) {
						this.coordinates[i] = coordSeq.getCoordinateCopy(i);
					}
				})(...args);
			}
	}
}
module.exports = CoordinateArraySequence
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
var util = require('util');
util.inherits(CoordinateArraySequence, CoordinateSequence);
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Double = require('java/lang/Double');
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
CoordinateArraySequence.prototype.setOrdinate = function (index, ordinateIndex, value) {
	switch (ordinateIndex) {
		case CoordinateSequence.X:
			this.x = value;
			break;
		case CoordinateSequence.Y:
			this.y = value;
			break;
		case CoordinateSequence.Z:
			this.z = value;
			break;
		default:
			throw new IllegalArgumentException("invalid ordinateIndex");
	}
};
CoordinateArraySequence.prototype.size = function () {
	return this.coordinates.length;
};
CoordinateArraySequence.prototype.getOrdinate = function (index, ordinateIndex) {
	switch (ordinateIndex) {
		case CoordinateSequence.X:
			return this.x;
		case CoordinateSequence.Y:
			return this.y;
		case CoordinateSequence.Z:
			return this.z;
	}
	return Double.NaN;
};
CoordinateArraySequence.prototype.getCoordinate = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [index, coord] = args;
				coord.x = this.x;
				coord.y = this.y;
				coord.z = this.z;
			})(...args);
		case 1:
			return ((...args) => {
				let [i] = args;
				return this.coordinates[i];
			})(...args);
	}
};
CoordinateArraySequence.prototype.getCoordinateCopy = function (i) {
	return new Coordinate(this.coordinates[i]);
};
CoordinateArraySequence.prototype.getDimension = function () {
	return this.dimension;
};
CoordinateArraySequence.prototype.getX = function (index) {
	return this.x;
};
CoordinateArraySequence.prototype.clone = function () {
	var cloneCoordinates = [];
	for (var i = 0; i < this.coordinates.length; i++) {
		cloneCoordinates[i] = this.coordinates[i].clone();
	}
	return new CoordinateArraySequence(cloneCoordinates);
};
CoordinateArraySequence.prototype.expandEnvelope = function (env) {
	for (var i = 0; i < this.coordinates.length; i++) {
		env.expandToInclude(this.coordinates[i]);
	}
	return env;
};
CoordinateArraySequence.prototype.toString = function () {
	if (this.coordinates.length > 0) {
		var strBuf = new StringBuffer(17 * this.coordinates.length);
		strBuf.append('(');
		strBuf.append(this.coordinates[0]);
		for (var i = 1; i < this.coordinates.length; i++) {
			strBuf.append(", ");
			strBuf.append(this.coordinates[i]);
		}
		strBuf.append(')');
		return strBuf.toString();
	} else {
		return "()";
	}
};
CoordinateArraySequence.prototype.getY = function (index) {
	return this.y;
};
CoordinateArraySequence.prototype.toCoordinateArray = function () {
	return this.coordinates;
};
CoordinateArraySequence.serialVersionUID = -915438501601840650;

