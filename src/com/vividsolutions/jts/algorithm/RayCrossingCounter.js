function RayCrossingCounter(p) {
	this.p = null;
	this.crossingCount = 0;
	this.isPointOnSegment = false;
	if (arguments.length === 0) return;
	this.p = p;
}
module.exports = RayCrossingCounter
var Location = require('com/vividsolutions/jts/geom/Location');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
var RobustDeterminant = require('com/vividsolutions/jts/algorithm/RobustDeterminant');
RayCrossingCounter.prototype.countSegment = function (p1, p2) {
	if (p1.x < this.p.x && p2.x < this.p.x) return null;
	if (this.p.x === p2.x && this.p.y === p2.y) {
		this.isPointOnSegment = true;
		return null;
	}
	if (p1.y === this.p.y && p2.y === this.p.y) {
		var minx = p1.x;
		var maxx = p2.x;
		if (minx > maxx) {
			minx = p2.x;
			maxx = p1.x;
		}
		if (this.p.x >= minx && this.p.x <= maxx) {
			this.isPointOnSegment = true;
		}
		return null;
	}
	if (p1.y > this.p.y && p2.y <= this.p.y || p2.y > this.p.y && p1.y <= this.p.y) {
		var x1 = p1.x - this.p.x;
		var y1 = p1.y - this.p.y;
		var x2 = p2.x - this.p.x;
		var y2 = p2.y - this.p.y;
		var xIntSign = RobustDeterminant.signOfDet2x2(x1, y1, x2, y2);
		if (xIntSign === 0.0) {
			this.isPointOnSegment = true;
			return null;
		}
		if (y2 < y1) xIntSign = -xIntSign;
		if (xIntSign > 0.0) {
			this.crossingCount++;
		}
	}
};
RayCrossingCounter.prototype.isPointInPolygon = function () {
	return this.getLocation() !== Location.EXTERIOR;
};
RayCrossingCounter.prototype.getLocation = function () {
	if (this.isPointOnSegment) return Location.BOUNDARY;
	if (this.crossingCount % 2 === 1) {
		return Location.INTERIOR;
	}
	return Location.EXTERIOR;
};
RayCrossingCounter.prototype.isOnSegment = function () {
	return this.isPointOnSegment;
};
RayCrossingCounter.locatePointInRing = function (...args) {
	switch (args.length) {
		case 2:
			if (args[0] instanceof Coordinate && args[1] instanceof Array) {
				return ((...args) => {
					let [p, ring] = args;
					var counter = new RayCrossingCounter(p);
					for (var i = 1; i < ring.length; i++) {
						var p1 = ring[i];
						var p2 = ring[i - 1];
						counter.countSegment(p1, p2);
						if (counter.isOnSegment()) return counter.getLocation();
					}
					return counter.getLocation();
				})(...args);
			} else if (args[0] instanceof Coordinate && args[1] instanceof CoordinateSequence) {
				return ((...args) => {
					let [p, ring] = args;
					var counter = new RayCrossingCounter(p);
					var p1 = new Coordinate();
					var p2 = new Coordinate();
					for (var i = 1; i < ring.size(); i++) {
						ring.getCoordinate(i, p1);
						ring.getCoordinate(i - 1, p2);
						counter.countSegment(p1, p2);
						if (counter.isOnSegment()) return counter.getLocation();
					}
					return counter.getLocation();
				})(...args);
			}
	}
};

