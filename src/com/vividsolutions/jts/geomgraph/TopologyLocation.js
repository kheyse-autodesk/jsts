function TopologyLocation(...args) {
	this.location = null;
	switch (args.length) {
		case 1:
			if (args[0] instanceof Array) {
				return ((...args) => {
					let [location] = args;
					this.init(location.length);
				})(...args);
			} else if (Number.isInteger(args[0])) {
				return ((...args) => {
					let [on] = args;
					this.init(1);
					this.location[Position.ON] = on;
				})(...args);
			} else if (args[0] instanceof TopologyLocation) {
				return ((...args) => {
					let [gl] = args;
					this.init(gl.location.length);
					if (gl !== null) {
						for (var i = 0; i < this.location.length; i++) {
							this.location[i] = gl.location[i];
						}
					}
				})(...args);
			}
		case 3:
			return ((...args) => {
				let [on, left, right] = args;
				this.init(3);
				this.location[Position.ON] = on;
				this.location[Position.LEFT] = left;
				this.location[Position.RIGHT] = right;
			})(...args);
	}
}
module.exports = TopologyLocation
var Location = require('com/vividsolutions/jts/geom/Location');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
TopologyLocation.prototype.setAllLocations = function (locValue) {
	for (var i = 0; i < this.location.length; i++) {
		this.location[i] = locValue;
	}
};
TopologyLocation.prototype.isNull = function () {
	for (var i = 0; i < this.location.length; i++) {
		if (this.location[i] !== Location.NONE) return false;
	}
	return true;
};
TopologyLocation.prototype.setAllLocationsIfNull = function (locValue) {
	for (var i = 0; i < this.location.length; i++) {
		if (this.location[i] === Location.NONE) this.location[i] = locValue;
	}
};
TopologyLocation.prototype.isLine = function () {
	return this.location.length === 1;
};
TopologyLocation.prototype.merge = function (gl) {
	if (gl.location.length > this.location.length) {
		var newLoc = [];
		newLoc[Position.ON] = this.location[Position.ON];
		newLoc[Position.LEFT] = Location.NONE;
		newLoc[Position.RIGHT] = Location.NONE;
		this.location = newLoc;
	}
	for (var i = 0; i < this.location.length; i++) {
		if (this.location[i] === Location.NONE && i < gl.location.length) this.location[i] = gl.location[i];
	}
};
TopologyLocation.prototype.getLocations = function () {
	return this.location;
};
TopologyLocation.prototype.flip = function () {
	if (this.location.length <= 1) return null;
	var temp = this.location[Position.LEFT];
	this.location[Position.LEFT] = this.location[Position.RIGHT];
	this.location[Position.RIGHT] = temp;
};
TopologyLocation.prototype.toString = function () {
	var buf = new StringBuffer();
	if (this.location.length > 1) buf.append(Location.toLocationSymbol(this.location[Position.LEFT]));
	buf.append(Location.toLocationSymbol(this.location[Position.ON]));
	if (this.location.length > 1) buf.append(Location.toLocationSymbol(this.location[Position.RIGHT]));
	return buf.toString();
};
TopologyLocation.prototype.setLocations = function (on, left, right) {
	this.location[Position.ON] = on;
	this.location[Position.LEFT] = left;
	this.location[Position.RIGHT] = right;
};
TopologyLocation.prototype.get = function (posIndex) {
	if (posIndex < this.location.length) return this.location[posIndex];
	return Location.NONE;
};
TopologyLocation.prototype.isArea = function () {
	return this.location.length > 1;
};
TopologyLocation.prototype.isAnyNull = function () {
	for (var i = 0; i < this.location.length; i++) {
		if (this.location[i] === Location.NONE) return true;
	}
	return false;
};
TopologyLocation.prototype.setLocation = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [locIndex, locValue] = args;
				this.location[locIndex] = locValue;
			})(...args);
		case 1:
			return ((...args) => {
				let [locValue] = args;
				this.setLocation(Position.ON, locValue);
			})(...args);
	}
};
TopologyLocation.prototype.init = function (size) {
	this.location = [];
	this.setAllLocations(Location.NONE);
};
TopologyLocation.prototype.isEqualOnSide = function (le, locIndex) {
	return this.location[locIndex] === le.location[locIndex];
};
TopologyLocation.prototype.allPositionsEqual = function (loc) {
	for (var i = 0; i < this.location.length; i++) {
		if (this.location[i] !== loc) return false;
	}
	return true;
};

