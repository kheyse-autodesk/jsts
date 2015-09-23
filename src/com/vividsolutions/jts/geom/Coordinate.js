function Coordinate(...args) {
	this.x = null;
	this.y = null;
	this.z = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [x, y] = args;
				Coordinate.call(this, x, y, Coordinate.NULL_ORDINATE);
			})(...args);
		case 1:
			return ((...args) => {
				let [c] = args;
				Coordinate.call(this, c.x, c.y, c.z);
			})(...args);
		case 3:
			return ((...args) => {
				let [x, y, z] = args;
				this.x = x;
				this.y = y;
				this.z = z;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				Coordinate.call(this, 0.0, 0.0);
			})(...args);
	}
}
module.exports = Coordinate
var NumberUtil = require('com/vividsolutions/jts/util/NumberUtil');
var Double = require('java/lang/Double');
var Assert = require('com/vividsolutions/jts/util/Assert');
Coordinate.prototype.setOrdinate = function (ordinateIndex, value) {
	switch (ordinateIndex) {
		case Coordinate.X:
			this.x = value;
			break;
		case Coordinate.Y:
			this.y = value;
			break;
		case Coordinate.Z:
			this.z = value;
			break;
		default:
			throw new IllegalArgumentException("Invalid ordinate index: " + ordinateIndex);
	}
};
Coordinate.prototype.equals2D = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [c, tolerance] = args;
				if (!NumberUtil.equalsWithTolerance(this.x, c.x, tolerance)) {
					return false;
				}
				if (!NumberUtil.equalsWithTolerance(this.y, c.y, tolerance)) {
					return false;
				}
				return true;
			})(...args);
		case 1:
			return ((...args) => {
				let [other] = args;
				if (this.x !== other.x) {
					return false;
				}
				if (this.y !== other.y) {
					return false;
				}
				return true;
			})(...args);
	}
};
Coordinate.prototype.getOrdinate = function (ordinateIndex) {
	switch (ordinateIndex) {
		case Coordinate.X:
			return this.x;
		case Coordinate.Y:
			return this.y;
		case Coordinate.Z:
			return this.z;
	}
	throw new IllegalArgumentException("Invalid ordinate index: " + ordinateIndex);
};
Coordinate.prototype.equals3D = function (other) {
	return this.x === other.x && this.y === other.y && (this.z === other.z || Double.isNaN(this.z) && Double.isNaN(other.z));
};
Coordinate.prototype.equals = function (other) {
	if (!(other instanceof Coordinate)) {
		return false;
	}
	return this.equals2D(other);
};
Coordinate.prototype.equalInZ = function (c, tolerance) {
	return NumberUtil.equalsWithTolerance(this.z, c.z, tolerance);
};
Coordinate.prototype.compareTo = function (o) {
	var other = o;
	if (this.x < other.x) return -1;
	if (this.x > other.x) return 1;
	if (this.y < other.y) return -1;
	if (this.y > other.y) return 1;
	return 0;
};
Coordinate.prototype.clone = function () {
	try {
		var coord = Coordinate.super_.prototype.clone.call(this);
		return coord;
	} catch (e) {
		if (e instanceof CloneNotSupportedException) {
			Assert.shouldNeverReachHere("this shouldn't happen because this class is Cloneable");
			return null;
		}
	} finally {}
};
Coordinate.prototype.toString = function () {
	return "(" + this.x + ", " + this.y + ", " + this.z + ")";
};
Coordinate.prototype.distance3D = function (c) {
	var dx = this.x - c.x;
	var dy = this.y - c.y;
	var dz = this.z - c.z;
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
Coordinate.prototype.distance = function (c) {
	var dx = this.x - c.x;
	var dy = this.y - c.y;
	return Math.sqrt(dx * dx + dy * dy);
};
Coordinate.prototype.hashCode = function () {
	var result = 17;
	result = 37 * result + Coordinate.hashCode(this.x);
	result = 37 * result + Coordinate.hashCode(this.y);
	return result;
};
Coordinate.prototype.setCoordinate = function (other) {
	this.x = other.x;
	this.y = other.y;
	this.z = other.z;
};
Coordinate.hashCode = function (x) {
	var f = Double.doubleToLongBits(x);
	return f ^ f >>> 32;
};
function DimensionalComparator(...args) {
	this.dimensionsToTest = 2;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [dimensionsToTest] = args;
				if (dimensionsToTest !== 2 && dimensionsToTest !== 3) throw new IllegalArgumentException("only 2 or 3 dimensions may be specified");
				this.dimensionsToTest = dimensionsToTest;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				DimensionalComparator.call(this, 2);
			})(...args);
	}
}
DimensionalComparator.prototype.compare = function (o1, o2) {
	var c1 = o1;
	var c2 = o2;
	var compX = DimensionalComparator.compare(c1.x, c2.x);
	if (compX !== 0) return compX;
	var compY = DimensionalComparator.compare(c1.y, c2.y);
	if (compY !== 0) return compY;
	if (this.dimensionsToTest <= 2) return 0;
	var compZ = DimensionalComparator.compare(c1.z, c2.z);
	return compZ;
};
DimensionalComparator.compare = function (a, b) {
	if (a < b) return -1;
	if (a > b) return 1;
	if (Double.isNaN(a)) {
		if (Double.isNaN(b)) return 0;
		return -1;
	}
	if (Double.isNaN(b)) return 1;
	return 0;
};
Coordinate.DimensionalComparator = DimensionalComparator;
Coordinate.serialVersionUID = 6683108902428366910;
Coordinate.NULL_ORDINATE = Double.NaN;
Coordinate.X = 0;
Coordinate.Y = 1;
Coordinate.Z = 2;

