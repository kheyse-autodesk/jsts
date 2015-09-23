function PointPairDistance() {
	this.pt = [new Coordinate(), new Coordinate()];
	this.distance = Double.NaN;
	this.isNull = true;
	if (arguments.length === 0) return;
}
module.exports = PointPairDistance
var WKTWriter = require('com/vividsolutions/jts/io/WKTWriter');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Double = require('java/lang/Double');
PointPairDistance.prototype.getCoordinates = function () {
	return this.pt;
};
PointPairDistance.prototype.getCoordinate = function (i) {
	return this.pt[i];
};
PointPairDistance.prototype.setMinimum = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [p0, p1] = args;
				if (this.isNull) {
					this.initialize(p0, p1);
					return null;
				}
				var dist = p0.distance(p1);
				if (dist < this.distance) this.initialize(p0, p1, dist);
			})(...args);
		case 1:
			return ((...args) => {
				let [ptDist] = args;
				this.setMinimum(ptDist.pt[0], ptDist.pt[1]);
			})(...args);
	}
};
PointPairDistance.prototype.initialize = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [p0, p1] = args;
				this.pt[0].setCoordinate(p0);
				this.pt[1].setCoordinate(p1);
				this.distance = p0.distance(p1);
				this.isNull = false;
			})(...args);
		case 3:
			return ((...args) => {
				let [p0, p1, distance] = args;
				this.pt[0].setCoordinate(p0);
				this.pt[1].setCoordinate(p1);
				this.distance = distance;
				this.isNull = false;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				this.isNull = true;
			})(...args);
	}
};
PointPairDistance.prototype.toString = function () {
	return WKTWriter.toLineString(this.pt[0], this.pt[1]);
};
PointPairDistance.prototype.getDistance = function () {
	return this.distance;
};
PointPairDistance.prototype.setMaximum = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [p0, p1] = args;
				if (this.isNull) {
					this.initialize(p0, p1);
					return null;
				}
				var dist = p0.distance(p1);
				if (dist > this.distance) this.initialize(p0, p1, dist);
			})(...args);
		case 1:
			return ((...args) => {
				let [ptDist] = args;
				this.setMaximum(ptDist.pt[0], ptDist.pt[1]);
			})(...args);
	}
};

