function KdNode(...args) {
	this.p = null;
	this.data = null;
	this.left = null;
	this.right = null;
	this.count = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [p, data] = args;
				this.p = new Coordinate(p);
				this.left = null;
				this.right = null;
				this.count = 1;
				this.data = data;
			})(...args);
		case 3:
			return ((...args) => {
				let [_x, _y, data] = args;
				this.p = new Coordinate(_x, _y);
				this.left = null;
				this.right = null;
				this.count = 1;
				this.data = data;
			})(...args);
	}
}
module.exports = KdNode
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
KdNode.prototype.isRepeated = function () {
	return this.count > 1;
};
KdNode.prototype.getRight = function () {
	return this.right;
};
KdNode.prototype.getCoordinate = function () {
	return this.p;
};
KdNode.prototype.setLeft = function (_left) {
	this.left = _left;
};
KdNode.prototype.getX = function () {
	return this.p.x;
};
KdNode.prototype.getData = function () {
	return this.data;
};
KdNode.prototype.getCount = function () {
	return this.count;
};
KdNode.prototype.getLeft = function () {
	return this.left;
};
KdNode.prototype.getY = function () {
	return this.p.y;
};
KdNode.prototype.increment = function () {
	this.count = this.count + 1;
};
KdNode.prototype.setRight = function (_right) {
	this.right = _right;
};

