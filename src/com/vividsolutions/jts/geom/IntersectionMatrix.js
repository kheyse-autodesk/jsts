function IntersectionMatrix(...args) {
	this.matrix = null;
	switch (args.length) {
		case 1:
			if (args[0] instanceof String) {
				return ((...args) => {
					let [elements] = args;
					IntersectionMatrix.call(this);
					this.set(elements);
				})(...args);
			} else if (args[0] instanceof IntersectionMatrix) {
				return ((...args) => {
					let [other] = args;
					IntersectionMatrix.call(this);
					this.matrix[Location.INTERIOR][Location.INTERIOR] = other.matrix[Location.INTERIOR][Location.INTERIOR];
					this.matrix[Location.INTERIOR][Location.BOUNDARY] = other.matrix[Location.INTERIOR][Location.BOUNDARY];
					this.matrix[Location.INTERIOR][Location.EXTERIOR] = other.matrix[Location.INTERIOR][Location.EXTERIOR];
					this.matrix[Location.BOUNDARY][Location.INTERIOR] = other.matrix[Location.BOUNDARY][Location.INTERIOR];
					this.matrix[Location.BOUNDARY][Location.BOUNDARY] = other.matrix[Location.BOUNDARY][Location.BOUNDARY];
					this.matrix[Location.BOUNDARY][Location.EXTERIOR] = other.matrix[Location.BOUNDARY][Location.EXTERIOR];
					this.matrix[Location.EXTERIOR][Location.INTERIOR] = other.matrix[Location.EXTERIOR][Location.INTERIOR];
					this.matrix[Location.EXTERIOR][Location.BOUNDARY] = other.matrix[Location.EXTERIOR][Location.BOUNDARY];
					this.matrix[Location.EXTERIOR][Location.EXTERIOR] = other.matrix[Location.EXTERIOR][Location.EXTERIOR];
				})(...args);
			}
		case 0:
			return ((...args) => {
				let [] = args;
				this.matrix = [];
				this.setAll(Dimension.FALSE);
			})(...args);
	}
}
module.exports = IntersectionMatrix
var Location = require('com/vividsolutions/jts/geom/Location');
var Dimension = require('com/vividsolutions/jts/geom/Dimension');
IntersectionMatrix.prototype.isIntersects = function () {
	return !this.isDisjoint();
};
IntersectionMatrix.prototype.isCovers = function () {
	var hasPointInCommon = IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.INTERIOR]) || IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.BOUNDARY]) || IntersectionMatrix.isTrue(this.matrix[Location.BOUNDARY][Location.INTERIOR]) || IntersectionMatrix.isTrue(this.matrix[Location.BOUNDARY][Location.BOUNDARY]);
	return hasPointInCommon && this.matrix[Location.EXTERIOR][Location.INTERIOR] === Dimension.FALSE && this.matrix[Location.EXTERIOR][Location.BOUNDARY] === Dimension.FALSE;
};
IntersectionMatrix.prototype.isCoveredBy = function () {
	var hasPointInCommon = IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.INTERIOR]) || IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.BOUNDARY]) || IntersectionMatrix.isTrue(this.matrix[Location.BOUNDARY][Location.INTERIOR]) || IntersectionMatrix.isTrue(this.matrix[Location.BOUNDARY][Location.BOUNDARY]);
	return hasPointInCommon && this.matrix[Location.INTERIOR][Location.EXTERIOR] === Dimension.FALSE && this.matrix[Location.BOUNDARY][Location.EXTERIOR] === Dimension.FALSE;
};
IntersectionMatrix.prototype.set = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [dimensionSymbols] = args;
				for (var i = 0; i < dimensionSymbols.length(); i++) {
					var row = i / 3;
					var col = i % 3;
					this.matrix[row][col] = Dimension.toDimensionValue(dimensionSymbols.charAt(i));
				}
			})(...args);
		case 3:
			return ((...args) => {
				let [row, column, dimensionValue] = args;
				this.matrix[row][column] = dimensionValue;
			})(...args);
	}
};
IntersectionMatrix.prototype.isContains = function () {
	return IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.INTERIOR]) && this.matrix[Location.EXTERIOR][Location.INTERIOR] === Dimension.FALSE && this.matrix[Location.EXTERIOR][Location.BOUNDARY] === Dimension.FALSE;
};
IntersectionMatrix.prototype.setAtLeast = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [minimumDimensionSymbols] = args;
				for (var i = 0; i < minimumDimensionSymbols.length(); i++) {
					var row = i / 3;
					var col = i % 3;
					this.setAtLeast(row, col, Dimension.toDimensionValue(minimumDimensionSymbols.charAt(i)));
				}
			})(...args);
		case 3:
			return ((...args) => {
				let [row, column, minimumDimensionValue] = args;
				if (this.matrix[row][column] < minimumDimensionValue) {
					this.matrix[row][column] = minimumDimensionValue;
				}
			})(...args);
	}
};
IntersectionMatrix.prototype.setAtLeastIfValid = function (row, column, minimumDimensionValue) {
	if (row >= 0 && column >= 0) {
		this.setAtLeast(row, column, minimumDimensionValue);
	}
};
IntersectionMatrix.prototype.isWithin = function () {
	return IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.INTERIOR]) && this.matrix[Location.INTERIOR][Location.EXTERIOR] === Dimension.FALSE && this.matrix[Location.BOUNDARY][Location.EXTERIOR] === Dimension.FALSE;
};
IntersectionMatrix.prototype.isTouches = function (dimensionOfGeometryA, dimensionOfGeometryB) {
	if (dimensionOfGeometryA > dimensionOfGeometryB) {
		return this.isTouches(dimensionOfGeometryB, dimensionOfGeometryA);
	}
	if (dimensionOfGeometryA === Dimension.A && dimensionOfGeometryB === Dimension.A || dimensionOfGeometryA === Dimension.L && dimensionOfGeometryB === Dimension.L || dimensionOfGeometryA === Dimension.L && dimensionOfGeometryB === Dimension.A || dimensionOfGeometryA === Dimension.P && dimensionOfGeometryB === Dimension.A || dimensionOfGeometryA === Dimension.P && dimensionOfGeometryB === Dimension.L) {
		return this.matrix[Location.INTERIOR][Location.INTERIOR] === Dimension.FALSE && (IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.BOUNDARY]) || IntersectionMatrix.isTrue(this.matrix[Location.BOUNDARY][Location.INTERIOR]) || IntersectionMatrix.isTrue(this.matrix[Location.BOUNDARY][Location.BOUNDARY]));
	}
	return false;
};
IntersectionMatrix.prototype.isOverlaps = function (dimensionOfGeometryA, dimensionOfGeometryB) {
	if (dimensionOfGeometryA === Dimension.P && dimensionOfGeometryB === Dimension.P || dimensionOfGeometryA === Dimension.A && dimensionOfGeometryB === Dimension.A) {
		return IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.INTERIOR]) && IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.EXTERIOR]) && IntersectionMatrix.isTrue(this.matrix[Location.EXTERIOR][Location.INTERIOR]);
	}
	if (dimensionOfGeometryA === Dimension.L && dimensionOfGeometryB === Dimension.L) {
		return this.matrix[Location.INTERIOR][Location.INTERIOR] === 1 && IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.EXTERIOR]) && IntersectionMatrix.isTrue(this.matrix[Location.EXTERIOR][Location.INTERIOR]);
	}
	return false;
};
IntersectionMatrix.prototype.isEquals = function (dimensionOfGeometryA, dimensionOfGeometryB) {
	if (dimensionOfGeometryA !== dimensionOfGeometryB) {
		return false;
	}
	return IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.INTERIOR]) && this.matrix[Location.INTERIOR][Location.EXTERIOR] === Dimension.FALSE && this.matrix[Location.BOUNDARY][Location.EXTERIOR] === Dimension.FALSE && this.matrix[Location.EXTERIOR][Location.INTERIOR] === Dimension.FALSE && this.matrix[Location.EXTERIOR][Location.BOUNDARY] === Dimension.FALSE;
};
IntersectionMatrix.prototype.toString = function () {
	var buf = new StringBuffer("123456789");
	for (var ai = 0; ai < 3; ai++) {
		for (var bi = 0; bi < 3; bi++) {
			buf.setCharAt(3 * ai + bi, Dimension.toDimensionSymbol(this.matrix[ai][bi]));
		}
	}
	return buf.toString();
};
IntersectionMatrix.prototype.setAll = function (dimensionValue) {
	for (var ai = 0; ai < 3; ai++) {
		for (var bi = 0; bi < 3; bi++) {
			this.matrix[ai][bi] = dimensionValue;
		}
	}
};
IntersectionMatrix.prototype.get = function (row, column) {
	return this.matrix[row][column];
};
IntersectionMatrix.prototype.transpose = function () {
	var temp = this.matrix[1][0];
	this.matrix[1][0] = this.matrix[0][1];
	this.matrix[0][1] = temp;
	temp = this.matrix[2][0];
	this.matrix[2][0] = this.matrix[0][2];
	this.matrix[0][2] = temp;
	temp = this.matrix[2][1];
	this.matrix[2][1] = this.matrix[1][2];
	this.matrix[1][2] = temp;
	return this;
};
IntersectionMatrix.prototype.matches = function (requiredDimensionSymbols) {
	if (requiredDimensionSymbols.length() !== 9) {
		throw new IllegalArgumentException("Should be length 9: " + requiredDimensionSymbols);
	}
	for (var ai = 0; ai < 3; ai++) {
		for (var bi = 0; bi < 3; bi++) {
			if (!IntersectionMatrix.matches(this.matrix[ai][bi], requiredDimensionSymbols.charAt(3 * ai + bi))) {
				return false;
			}
		}
	}
	return true;
};
IntersectionMatrix.prototype.add = function (im) {
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			this.setAtLeast(i, j, im.get(i, j));
		}
	}
};
IntersectionMatrix.prototype.isDisjoint = function () {
	return this.matrix[Location.INTERIOR][Location.INTERIOR] === Dimension.FALSE && this.matrix[Location.INTERIOR][Location.BOUNDARY] === Dimension.FALSE && this.matrix[Location.BOUNDARY][Location.INTERIOR] === Dimension.FALSE && this.matrix[Location.BOUNDARY][Location.BOUNDARY] === Dimension.FALSE;
};
IntersectionMatrix.prototype.isCrosses = function (dimensionOfGeometryA, dimensionOfGeometryB) {
	if (dimensionOfGeometryA === Dimension.P && dimensionOfGeometryB === Dimension.L || dimensionOfGeometryA === Dimension.P && dimensionOfGeometryB === Dimension.A || dimensionOfGeometryA === Dimension.L && dimensionOfGeometryB === Dimension.A) {
		return IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.INTERIOR]) && IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.EXTERIOR]);
	}
	if (dimensionOfGeometryA === Dimension.L && dimensionOfGeometryB === Dimension.P || dimensionOfGeometryA === Dimension.A && dimensionOfGeometryB === Dimension.P || dimensionOfGeometryA === Dimension.A && dimensionOfGeometryB === Dimension.L) {
		return IntersectionMatrix.isTrue(this.matrix[Location.INTERIOR][Location.INTERIOR]) && IntersectionMatrix.isTrue(this.matrix[Location.EXTERIOR][Location.INTERIOR]);
	}
	if (dimensionOfGeometryA === Dimension.L && dimensionOfGeometryB === Dimension.L) {
		return this.matrix[Location.INTERIOR][Location.INTERIOR] === 0;
	}
	return false;
};
IntersectionMatrix.matches = function (...args) {
	switch (args.length) {
		case 2:
			if (Number.isInteger(args[0]) && args[1] instanceof char) {
				return ((...args) => {
					let [actualDimensionValue, requiredDimensionSymbol] = args;
					if (requiredDimensionSymbol === Dimension.SYM_DONTCARE) {
						return true;
					}
					if (requiredDimensionSymbol === Dimension.SYM_TRUE && (actualDimensionValue >= 0 || actualDimensionValue === Dimension.TRUE)) {
						return true;
					}
					if (requiredDimensionSymbol === Dimension.SYM_FALSE && actualDimensionValue === Dimension.FALSE) {
						return true;
					}
					if (requiredDimensionSymbol === Dimension.SYM_P && actualDimensionValue === Dimension.P) {
						return true;
					}
					if (requiredDimensionSymbol === Dimension.SYM_L && actualDimensionValue === Dimension.L) {
						return true;
					}
					if (requiredDimensionSymbol === Dimension.SYM_A && actualDimensionValue === Dimension.A) {
						return true;
					}
					return false;
				})(...args);
			} else if (args[0] instanceof String && args[1] instanceof String) {
				return ((...args) => {
					let [actualDimensionSymbols, requiredDimensionSymbols] = args;
					var m = new IntersectionMatrix(actualDimensionSymbols);
					return m.matches(requiredDimensionSymbols);
				})(...args);
			}
	}
};
IntersectionMatrix.isTrue = function (actualDimensionValue) {
	if (actualDimensionValue >= 0 || actualDimensionValue === Dimension.TRUE) {
		return true;
	}
	return false;
};

