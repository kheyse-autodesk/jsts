function CoordinateList(...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [coord, allowRepeated] = args;
				this.ensureCapacity(coord.length);
				this.add(coord, allowRepeated);
			})(...args);
		case 1:
			return ((...args) => {
				let [coord] = args;
				this.ensureCapacity(coord.length);
				this.add(coord, true);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				CoordinateList.super_.call(this);
			})(...args);
	}
}
module.exports = CoordinateList
var ArrayList = require('java/util/ArrayList');
var util = require('util');
util.inherits(CoordinateList, ArrayList)
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
CoordinateList.prototype.getCoordinate = function (i) {
	return this.get(i);
};
CoordinateList.prototype.addAll = function (coll, allowRepeated) {
	var isChanged = false;
	for (var i = coll.iterator(); i.hasNext(); ) {
		this.add(i.next(), allowRepeated);
		isChanged = true;
	}
	return isChanged;
};
CoordinateList.prototype.clone = function () {
	var clone = CoordinateList.super_.prototype.clone.call(this);
	for (var i = 0; i < this.size(); i++) {
		clone.add(i, this.get(i).clone());
	}
	return clone;
};
CoordinateList.prototype.toCoordinateArray = function () {
	return this.toArray(CoordinateList.coordArrayType);
};
CoordinateList.prototype.add = function (...args) {
	switch (args.length) {
		case 2:
			if (args[0] instanceof Array && args[1] instanceof boolean) {
				return ((...args) => {
					let [coord, allowRepeated] = args;
					this.add(coord, allowRepeated, true);
					return true;
				})(...args);
			} else if (args[0] instanceof Object && args[1] instanceof boolean) {
				return ((...args) => {
					let [obj, allowRepeated] = args;
					this.add(obj, allowRepeated);
					return true;
				})(...args);
			} else if (args[0] instanceof Coordinate && args[1] instanceof boolean) {
				return ((...args) => {
					let [coord, allowRepeated] = args;
					if (!allowRepeated) {
						if (this.size() >= 1) {
							var last = this.get(this.size() - 1);
							if (last.equals2D(coord)) return null;
						}
					}
					CoordinateList.super_.prototype.add.call(this, coord);
				})(...args);
			}
		case 4:
			return ((...args) => {
				let [coord, allowRepeated, start, end] = args;
				var inc = 1;
				if (start > end) inc = -1;
				for (var i = start; i !== end; i += inc) {
					this.add(coord[i], allowRepeated);
				}
				return true;
			})(...args);
		case 3:
			if (args[2] instanceof boolean && args[0] instanceof Array && args[1] instanceof boolean) {
				return ((...args) => {
					let [coord, allowRepeated, direction] = args;
					if (direction) {
						for (var i = 0; i < coord.length; i++) {
							this.add(coord[i], allowRepeated);
						}
					} else {
						for (var i = coord.length - 1; i >= 0; i--) {
							this.add(coord[i], allowRepeated);
						}
					}
					return true;
				})(...args);
			} else if (args[2] instanceof boolean && Number.isInteger(args[0]) && args[1] instanceof Coordinate) {
				return ((...args) => {
					let [i, coord, allowRepeated] = args;
					if (!allowRepeated) {
						var size = this.size();
						if (size > 0) {
							if (i > 0) {
								var prev = this.get(i - 1);
								if (prev.equals2D(coord)) return null;
							}
							if (i < size) {
								var next = this.get(i);
								if (next.equals2D(coord)) return null;
							}
						}
					}
					CoordinateList.super_.prototype.add.call(this, i, coord);
				})(...args);
			}
	}
};
CoordinateList.prototype.closeRing = function () {
	if (this.size() > 0) this.add(new Coordinate(this.get(0)), false);
};
CoordinateList.coordArrayType = [];

