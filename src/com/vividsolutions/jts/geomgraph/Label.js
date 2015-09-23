function Label(...args) {
	this.elt = [];
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geomIndex, onLoc] = args;
				this.elt[0] = new TopologyLocation(Location.NONE);
				this.elt[1] = new TopologyLocation(Location.NONE);
				this.elt[geomIndex].setLocation(onLoc);
			})(...args);
		case 4:
			return ((...args) => {
				let [geomIndex, onLoc, leftLoc, rightLoc] = args;
				this.elt[0] = new TopologyLocation(Location.NONE, Location.NONE, Location.NONE);
				this.elt[1] = new TopologyLocation(Location.NONE, Location.NONE, Location.NONE);
				this.elt[geomIndex].setLocations(onLoc, leftLoc, rightLoc);
			})(...args);
		case 1:
			if (Number.isInteger(args[0])) {
				return ((...args) => {
					let [onLoc] = args;
					this.elt[0] = new TopologyLocation(onLoc);
					this.elt[1] = new TopologyLocation(onLoc);
				})(...args);
			} else if (args[0] instanceof Label) {
				return ((...args) => {
					let [lbl] = args;
					this.elt[0] = new TopologyLocation(lbl.elt[0]);
					this.elt[1] = new TopologyLocation(lbl.elt[1]);
				})(...args);
			}
		case 3:
			return ((...args) => {
				let [onLoc, leftLoc, rightLoc] = args;
				this.elt[0] = new TopologyLocation(onLoc, leftLoc, rightLoc);
				this.elt[1] = new TopologyLocation(onLoc, leftLoc, rightLoc);
			})(...args);
	}
}
module.exports = Label
var Location = require('com/vividsolutions/jts/geom/Location');
var Position = require('com/vividsolutions/jts/geomgraph/Position');
var TopologyLocation = require('com/vividsolutions/jts/geomgraph/TopologyLocation');
Label.prototype.getGeometryCount = function () {
	var count = 0;
	if (!this.elt[0].isNull()) count++;
	if (!this.elt[1].isNull()) count++;
	return count;
};
Label.prototype.setAllLocations = function (geomIndex, location) {
	this.elt[geomIndex].setAllLocations(location);
};
Label.prototype.isNull = function (geomIndex) {
	return this.elt[geomIndex].isNull();
};
Label.prototype.setAllLocationsIfNull = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geomIndex, location] = args;
				this.elt[geomIndex].setAllLocationsIfNull(location);
			})(...args);
		case 1:
			return ((...args) => {
				let [location] = args;
				this.setAllLocationsIfNull(0, location);
				this.setAllLocationsIfNull(1, location);
			})(...args);
	}
};
Label.prototype.isLine = function (geomIndex) {
	return this.elt[geomIndex].isLine();
};
Label.prototype.merge = function (lbl) {
	for (var i = 0; i < 2; i++) {
		if (this.elt[i] === null && lbl.elt[i] !== null) {
			this.elt[i] = new TopologyLocation(lbl.elt[i]);
		} else {
			this.elt[i].merge(lbl.elt[i]);
		}
	}
};
Label.prototype.flip = function () {
	this.elt[0].flip();
	this.elt[1].flip();
};
Label.prototype.getLocation = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geomIndex, posIndex] = args;
				return this.elt[geomIndex].get(posIndex);
			})(...args);
		case 1:
			return ((...args) => {
				let [geomIndex] = args;
				return this.elt[geomIndex].get(Position.ON);
			})(...args);
	}
};
Label.prototype.toString = function () {
	var buf = new StringBuffer();
	if (this.elt[0] !== null) {
		buf.append("A:");
		buf.append(this.elt[0].toString());
	}
	if (this.elt[1] !== null) {
		buf.append(" B:");
		buf.append(this.elt[1].toString());
	}
	return buf.toString();
};
Label.prototype.isArea = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [geomIndex] = args;
				return this.elt[geomIndex].isArea();
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				return this.elt[0].isArea() || this.elt[1].isArea();
			})(...args);
	}
};
Label.prototype.isAnyNull = function (geomIndex) {
	return this.elt[geomIndex].isAnyNull();
};
Label.prototype.setLocation = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geomIndex, location] = args;
				this.elt[geomIndex].setLocation(Position.ON, location);
			})(...args);
		case 3:
			return ((...args) => {
				let [geomIndex, posIndex, location] = args;
				this.elt[geomIndex].setLocation(posIndex, location);
			})(...args);
	}
};
Label.prototype.isEqualOnSide = function (lbl, side) {
	return this.elt[0].isEqualOnSide(lbl.elt[0], side) && this.elt[1].isEqualOnSide(lbl.elt[1], side);
};
Label.prototype.allPositionsEqual = function (geomIndex, loc) {
	return this.elt[geomIndex].allPositionsEqual(loc);
};
Label.prototype.toLine = function (geomIndex) {
	if (this.elt[geomIndex].isArea()) this.elt[geomIndex] = new TopologyLocation(this.location[0]);
};
Label.toLineLabel = function (label) {
	var lineLabel = new Label(Location.NONE);
	for (var i = 0; i < 2; i++) {
		lineLabel.setLocation(i, label.getLocation(i));
	}
	return lineLabel;
};

