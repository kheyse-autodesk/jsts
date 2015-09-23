function PrecisionModel(...args) {
	this.modelType = null;
	this.scale = null;
	switch (args.length) {
		case 1:
			if (args[0] instanceof Type) {
				return ((...args) => {
					let [modelType] = args;
					this.modelType = modelType;
					if (modelType === PrecisionModel.FIXED) {
						this.setScale(1.0);
					}
				})(...args);
			} else if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [scale] = args;
					this.modelType = PrecisionModel.FIXED;
					this.setScale(scale);
				})(...args);
			} else if (args[0] instanceof PrecisionModel) {
				return ((...args) => {
					let [pm] = args;
					this.modelType = pm.modelType;
					this.scale = pm.scale;
				})(...args);
			}
		case 3:
			return ((...args) => {
				let [scale, offsetX, offsetY] = args;
				this.modelType = PrecisionModel.FIXED;
				this.setScale(scale);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				this.modelType = PrecisionModel.FLOATING;
			})(...args);
	}
}
module.exports = PrecisionModel
var HashMap = require('java/util/HashMap');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Double = require('java/lang/Double');
PrecisionModel.prototype.toInternal = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [external, internal] = args;
				if (this.isFloating()) {
					internal.x = external.x;
					internal.y = external.y;
				} else {
					internal.x = this.makePrecise(external.x);
					internal.y = this.makePrecise(external.y);
				}
				internal.z = external.z;
			})(...args);
		case 1:
			return ((...args) => {
				let [external] = args;
				var internal = new Coordinate(external);
				this.makePrecise(internal);
				return internal;
			})(...args);
	}
};
PrecisionModel.prototype.equals = function (other) {
	if (!(other instanceof PrecisionModel)) {
		return false;
	}
	var otherPrecisionModel = other;
	return this.modelType === otherPrecisionModel.modelType && this.scale === otherPrecisionModel.scale;
};
PrecisionModel.prototype.getOffsetY = function () {
	return 0;
};
PrecisionModel.prototype.compareTo = function (o) {
	var other = o;
	var sigDigits = this.getMaximumSignificantDigits();
	var otherSigDigits = other.getMaximumSignificantDigits();
	return new Integer(sigDigits).compareTo(new Integer(otherSigDigits));
};
PrecisionModel.prototype.getScale = function () {
	return this.scale;
};
PrecisionModel.prototype.isFloating = function () {
	return this.modelType === PrecisionModel.FLOATING || this.modelType === PrecisionModel.FLOATING_SINGLE;
};
PrecisionModel.prototype.toExternal = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [internal, external] = args;
				external.x = internal.x;
				external.y = internal.y;
			})(...args);
		case 1:
			return ((...args) => {
				let [internal] = args;
				var external = new Coordinate(internal);
				return external;
			})(...args);
	}
};
PrecisionModel.prototype.getType = function () {
	return this.modelType;
};
PrecisionModel.prototype.getOffsetX = function () {
	return 0;
};
PrecisionModel.prototype.toString = function () {
	var description = "UNKNOWN";
	if (this.modelType === PrecisionModel.FLOATING) {
		description = "Floating";
	} else if (this.modelType === PrecisionModel.FLOATING_SINGLE) {
		description = "Floating-Single";
	} else if (this.modelType === PrecisionModel.FIXED) {
		description = "Fixed (Scale=" + this.getScale() + ")";
	}
	return description;
};
PrecisionModel.prototype.makePrecise = function (...args) {
	switch (args.length) {
		case 1:
			if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [val] = args;
					if (Double.isNaN(val)) return val;
					if (this.modelType === PrecisionModel.FLOATING_SINGLE) {
						var floatSingleVal = val;
						return floatSingleVal;
					}
					if (this.modelType === PrecisionModel.FIXED) {
						return Math.round(val * this.scale) / this.scale;
					}
					return val;
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [coord] = args;
					if (this.modelType === PrecisionModel.FLOATING) return null;
					coord.x = this.makePrecise(coord.x);
					coord.y = this.makePrecise(coord.y);
				})(...args);
			}
	}
};
PrecisionModel.prototype.getMaximumSignificantDigits = function () {
	var maxSigDigits = 16;
	if (this.modelType === PrecisionModel.FLOATING) {
		maxSigDigits = 16;
	} else if (this.modelType === PrecisionModel.FLOATING_SINGLE) {
		maxSigDigits = 6;
	} else if (this.modelType === PrecisionModel.FIXED) {
		maxSigDigits = 1 + Math.ceil(Math.log(this.getScale()) / Math.log(10));
	}
	return maxSigDigits;
};
PrecisionModel.prototype.setScale = function (scale) {
	this.scale = Math.abs(scale);
};
PrecisionModel.mostPrecise = function (pm1, pm2) {
	if (pm1.compareTo(pm2) >= 0) return pm1;
	return pm2;
};
function Type(name) {
	this.name = null;
	if (arguments.length === 0) return;
	this.name = name;
	Type.nameToTypeMap.put(name, this);
}
Type.prototype.readResolve = function () {
	return Type.nameToTypeMap.get(this.name);
};
Type.prototype.toString = function () {
	return this.name;
};
Type.serialVersionUID = -5528602631731589822;
Type.nameToTypeMap = new HashMap();
PrecisionModel.Type = Type;
PrecisionModel.serialVersionUID = 7777263578777803835;
PrecisionModel.FIXED = new Type("FIXED");
PrecisionModel.FLOATING = new Type("FLOATING");
PrecisionModel.FLOATING_SINGLE = new Type("FLOATING SINGLE");
PrecisionModel.maximumPreciseValue = 9007199254740992.0;

