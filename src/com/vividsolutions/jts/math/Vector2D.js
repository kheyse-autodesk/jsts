function Vector2D(...args) {
	this.x = null;
	this.y = null;
	switch (args.length) {
		case 2:
			if (!Number.isInteger(args[0]) && !Number.isInteger(args[1])) {
				return ((...args) => {
					let [x, y] = args;
					this.x = x;
					this.y = y;
				})(...args);
			} else if (args[0] instanceof Coordinate && args[1] instanceof Coordinate) {
				return ((...args) => {
					let [from, to] = args;
					this.x = to.x - from.x;
					this.y = to.y - from.y;
				})(...args);
			}
		case 1:
			if (args[0] instanceof Vector2D) {
				return ((...args) => {
					let [v] = args;
					this.x = v.x;
					this.y = v.y;
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [v] = args;
					this.x = v.x;
					this.y = v.y;
				})(...args);
			}
		case 0:
			return ((...args) => {
				let [] = args;
				Vector2D.call(this, 0.0, 0.0);
			})(...args);
	}
}
module.exports = Vector2D
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Angle = require('com/vividsolutions/jts/algorithm/Angle');
var RobustDeterminant = require('com/vividsolutions/jts/algorithm/RobustDeterminant');
var Assert = require('com/vividsolutions/jts/util/Assert');
Vector2D.prototype.dot = function (v) {
	return this.x * v.x + this.y * v.y;
};
Vector2D.prototype.isParallel = function (v) {
	return 0.0 === RobustDeterminant.signOfDet2x2(this.x, this.y, v.x, v.y);
};
Vector2D.prototype.getComponent = function (index) {
	if (index === 0) return this.x;
	return this.y;
};
Vector2D.prototype.subtract = function (v) {
	return Vector2D.create(this.x - v.x, this.y - v.y);
};
Vector2D.prototype.equals = function (o) {
	if (!(o instanceof Vector2D)) {
		return false;
	}
	var v = o;
	return this.x === v.x && this.y === v.y;
};
Vector2D.prototype.normalize = function () {
	var length = this.length();
	if (length > 0.0) return this.divide(length);
	return Vector2D.create(0.0, 0.0);
};
Vector2D.prototype.angle = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [v] = args;
				return Angle.diff(v.angle(), this.angle());
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				return Math.atan2(this.y, this.x);
			})(...args);
	}
};
Vector2D.prototype.weightedSum = function (v, frac) {
	return Vector2D.create(frac * this.x + (1.0 - frac) * v.x, frac * this.y + (1.0 - frac) * v.y);
};
Vector2D.prototype.divide = function (d) {
	return Vector2D.create(this.x / d, this.y / d);
};
Vector2D.prototype.rotateByQuarterCircle = function (numQuarters) {
	var nQuad = numQuarters % 4;
	if (numQuarters < 0 && nQuad !== 0) {
		nQuad = nQuad + 4;
	}
	switch (nQuad) {
		case 0:
			return Vector2D.create(this.x, this.y);
		case 1:
			return Vector2D.create(-this.y, this.x);
		case 2:
			return Vector2D.create(-this.x, -this.y);
		case 3:
			return Vector2D.create(this.y, -this.x);
	}
	Assert.shouldNeverReachHere();
	return null;
};
Vector2D.prototype.rotate = function (angle) {
	var cos = Math.cos(angle);
	var sin = Math.sin(angle);
	return Vector2D.create(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
};
Vector2D.prototype.angleTo = function (v) {
	var a1 = this.angle();
	var a2 = v.angle();
	var angDel = a2 - a1;
	if (angDel <= -Math.PI) return angDel + Angle.PI_TIMES_2;
	if (angDel > Math.PI) return angDel - Angle.PI_TIMES_2;
	return angDel;
};
Vector2D.prototype.getX = function () {
	return this.x;
};
Vector2D.prototype.lengthSquared = function () {
	return this.x * this.x + this.y * this.y;
};
Vector2D.prototype.negate = function () {
	return Vector2D.create(-this.x, -this.y);
};
Vector2D.prototype.clone = function () {
	return new Vector2D(this);
};
Vector2D.prototype.toCoordinate = function () {
	return new Coordinate(this.x, this.y);
};
Vector2D.prototype.translate = function (coord) {
	return new Coordinate(this.x + coord.x, this.y + coord.y);
};
Vector2D.prototype.multiply = function (d) {
	return Vector2D.create(this.x * d, this.y * d);
};
Vector2D.prototype.toString = function () {
	return "[" + this.x + ", " + this.y + "]";
};
Vector2D.prototype.length = function () {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vector2D.prototype.average = function (v) {
	return this.weightedSum(v, 0.5);
};
Vector2D.prototype.getY = function () {
	return this.y;
};
Vector2D.prototype.add = function (v) {
	return Vector2D.create(this.x + v.x, this.y + v.y);
};
Vector2D.prototype.distance = function (v) {
	var delx = v.x - this.x;
	var dely = v.y - this.y;
	return Math.sqrt(delx * delx + dely * dely);
};
Vector2D.prototype.hashCode = function () {
	var result = 17;
	result = 37 * result + Coordinate.hashCode(this.x);
	result = 37 * result + Coordinate.hashCode(this.y);
	return result;
};
Vector2D.create = function (...args) {
	switch (args.length) {
		case 2:
			if (!Number.isInteger(args[0]) && !Number.isInteger(args[1])) {
				return ((...args) => {
					let [x, y] = args;
					return new Vector2D(x, y);
				})(...args);
			} else if (args[0] instanceof Coordinate && args[1] instanceof Coordinate) {
				return ((...args) => {
					let [from, to] = args;
					return new Vector2D(from, to);
				})(...args);
			}
		case 1:
			if (args[0] instanceof Vector2D) {
				return ((...args) => {
					let [v] = args;
					return new Vector2D(v);
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [coord] = args;
					return new Vector2D(coord);
				})(...args);
			}
	}
};

