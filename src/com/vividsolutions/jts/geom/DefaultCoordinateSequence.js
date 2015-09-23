function DefaultCoordinateSequence(...args) {
	this.coordinates = null;
	switch (args.length) {
		case 1:
			if (args[0] instanceof Array) {
				return ((...args) => {
					let [coordinates] = args;
					if (Geometry.hasNullElements(coordinates)) {
						throw new IllegalArgumentException("Null coordinate");
					}
					this.coordinates = coordinates;
				})(...args);
			} else if (args[0] instanceof CoordinateSequence) {
				return ((...args) => {
					let [coordSeq] = args;
					this.coordinates = [];
					for (var i = 0; i < this.coordinates.length; i++) {
						this.coordinates[i] = coordSeq.getCoordinateCopy(i);
					}
				})(...args);
			} else if (Number.isInteger(args[0])) {
				return ((...args) => {
					let [size] = args;
					this.coordinates = [];
					for (var i = 0; i < size; i++) {
						this.coordinates[i] = new Coordinate();
					}
				})(...args);
			}
	}
}
module.exports = DefaultCoordinateSequence
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Double = require('java/lang/Double');
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
DefaultCoordinateSequence.prototype.setOrdinate = function (index, ordinateIndex, value) {
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
	}
};
DefaultCoordinateSequence.prototype.size = function () {
	return this.coordinates.length;
};
DefaultCoordinateSequence.prototype.getOrdinate = function (index, ordinateIndex) {
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
DefaultCoordinateSequence.prototype.getCoordinate = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [index, coord] = args;
				coord.x = this.x;
				coord.y = this.y;
			})(...args);
		case 1:
			return ((...args) => {
				let [i] = args;
				return this.coordinates[i];
			})(...args);
	}
};
DefaultCoordinateSequence.prototype.getCoordinateCopy = function (i) {
	return new Coordinate(this.coordinates[i]);
};
DefaultCoordinateSequence.prototype.getDimension = function () {
	return 3;
};
DefaultCoordinateSequence.prototype.getX = function (index) {
	return this.x;
};
DefaultCoordinateSequence.prototype.clone = function () {
	var cloneCoordinates = [];
	for (var i = 0; i < this.coordinates.length; i++) {
		cloneCoordinates[i] = this.coordinates[i].clone();
	}
	return new DefaultCoordinateSequence(cloneCoordinates);
};
DefaultCoordinateSequence.prototype.expandEnvelope = function (env) {
	for (var i = 0; i < this.coordinates.length; i++) {
		env.expandToInclude(this.coordinates[i]);
	}
	return env;
};
DefaultCoordinateSequence.prototype.toString = function () {
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
DefaultCoordinateSequence.prototype.getY = function (index) {
	return this.y;
};
DefaultCoordinateSequence.prototype.toCoordinateArray = function () {
	return this.coordinates;
};
DefaultCoordinateSequence.serialVersionUID = -915438501601840650;

