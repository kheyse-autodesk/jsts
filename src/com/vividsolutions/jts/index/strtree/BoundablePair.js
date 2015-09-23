function BoundablePair(boundable1, boundable2, itemDistance) {
	this.boundable1 = null;
	this.boundable2 = null;
	this.distance = null;
	this.itemDistance = null;
	if (arguments.length === 0) return;
	this.boundable1 = boundable1;
	this.boundable2 = boundable2;
	this.itemDistance = itemDistance;
	this.distance = this.distance();
}
module.exports = BoundablePair
var AbstractNode = require('com/vividsolutions/jts/index/strtree/AbstractNode');
BoundablePair.prototype.expandToQueue = function (priQ, minDistance) {
	var isComp1 = BoundablePair.isComposite(this.boundable1);
	var isComp2 = BoundablePair.isComposite(this.boundable2);
	if (isComp1 && isComp2) {
		if (BoundablePair.area(this.boundable1) > BoundablePair.area(this.boundable2)) {
			this.expand(this.boundable1, this.boundable2, priQ, minDistance);
			return null;
		} else {
			this.expand(this.boundable2, this.boundable1, priQ, minDistance);
			return null;
		}
	} else if (isComp1) {
		this.expand(this.boundable1, this.boundable2, priQ, minDistance);
		return null;
	} else if (isComp2) {
		this.expand(this.boundable2, this.boundable1, priQ, minDistance);
		return null;
	}
	throw new IllegalArgumentException("neither boundable is composite");
};
BoundablePair.prototype.isLeaves = function () {
	return !(BoundablePair.isComposite(this.boundable1) || BoundablePair.isComposite(this.boundable2));
};
BoundablePair.prototype.compareTo = function (o) {
	var nd = o;
	if (this.distance < nd.distance) return -1;
	if (this.distance > nd.distance) return 1;
	return 0;
};
BoundablePair.prototype.expand = function (bndComposite, bndOther, priQ, minDistance) {
	var children = bndComposite.getChildBoundables();
	for (var i = children.iterator(); i.hasNext(); ) {
		var child = i.next();
		var bp = new BoundablePair(child, bndOther, this.itemDistance);
		if (bp.getDistance() < minDistance) {
			priQ.add(bp);
		}
	}
};
BoundablePair.prototype.getBoundable = function (i) {
	if (i === 0) return this.boundable1;
	return this.boundable2;
};
BoundablePair.prototype.getDistance = function () {
	return this.distance;
};
BoundablePair.prototype.distance = function () {
	if (this.isLeaves()) {
		return this.itemDistance.distance(this.boundable1, this.boundable2);
	}
	return this.boundable1.getBounds().distance(this.boundable2.getBounds());
};
BoundablePair.area = function (b) {
	return b.getBounds().getArea();
};
BoundablePair.isComposite = function (item) {
	return item instanceof AbstractNode;
};

