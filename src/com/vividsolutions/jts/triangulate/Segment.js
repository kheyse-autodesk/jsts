function Segment(...args) {
	this.ls = null;
	this.data = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [p0, p1] = args;
				this.ls = new LineSegment(p0, p1);
			})(...args);
		case 7:
			return ((...args) => {
				let [x1, y1, z1, x2, y2, z2, data] = args;
				Segment.call(this, new Coordinate(x1, y1, z1), new Coordinate(x2, y2, z2), data);
			})(...args);
		case 3:
			return ((...args) => {
				let [p0, p1, data] = args;
				this.ls = new LineSegment(p0, p1);
				this.data = data;
			})(...args);
		case 6:
			return ((...args) => {
				let [x1, y1, z1, x2, y2, z2] = args;
				Segment.call(this, new Coordinate(x1, y1, z1), new Coordinate(x2, y2, z2));
			})(...args);
	}
}
module.exports = Segment
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var LineSegment = require('com/vividsolutions/jts/geom/LineSegment');
Segment.prototype.getLineSegment = function () {
	return this.ls;
};
Segment.prototype.getEndZ = function () {
	var p = this.ls.getCoordinate(1);
	return p.z;
};
Segment.prototype.getStartZ = function () {
	var p = this.ls.getCoordinate(0);
	return p.z;
};
Segment.prototype.intersection = function (s) {
	return this.ls.intersection(s.getLineSegment());
};
Segment.prototype.getStart = function () {
	return this.ls.getCoordinate(0);
};
Segment.prototype.getEnd = function () {
	return this.ls.getCoordinate(1);
};
Segment.prototype.getEndY = function () {
	var p = this.ls.getCoordinate(1);
	return p.y;
};
Segment.prototype.getStartX = function () {
	var p = this.ls.getCoordinate(0);
	return p.x;
};
Segment.prototype.equalsTopo = function (s) {
	return this.ls.equalsTopo(s.getLineSegment());
};
Segment.prototype.getStartY = function () {
	var p = this.ls.getCoordinate(0);
	return p.y;
};
Segment.prototype.setData = function (data) {
	this.data = data;
};
Segment.prototype.getData = function () {
	return this.data;
};
Segment.prototype.getEndX = function () {
	var p = this.ls.getCoordinate(1);
	return p.x;
};
Segment.prototype.toString = function () {
	return this.ls.toString();
};

