function GeometryCollectionIterator(parent) {
	this.parent = null;
	this.atStart = null;
	this.max = null;
	this.index = null;
	this.subcollectionIterator = null;
	if (arguments.length === 0) return;
	this.parent = parent;
	this.atStart = true;
	this.index = 0;
	this.max = parent.getNumGeometries();
}
module.exports = GeometryCollectionIterator
var NoSuchElementException = require('java/util/NoSuchElementException');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
GeometryCollectionIterator.prototype.next = function () {
	if (this.atStart) {
		this.atStart = false;
		if (GeometryCollectionIterator.isAtomic(this.parent)) this.index++;
		return this.parent;
	}
	if (this.subcollectionIterator !== null) {
		if (this.subcollectionIterator.hasNext()) {
			return this.subcollectionIterator.next();
		} else {
			this.subcollectionIterator = null;
		}
	}
	if (this.index >= this.max) {
		throw new NoSuchElementException();
	}
	var obj = this.parent.getGeometryN(this.index++);
	if (obj instanceof GeometryCollection) {
		this.subcollectionIterator = new GeometryCollectionIterator(obj);
		return this.subcollectionIterator.next();
	}
	return obj;
};
GeometryCollectionIterator.prototype.remove = function () {
	throw new UnsupportedOperationException(this.getClass().getName());
};
GeometryCollectionIterator.prototype.hasNext = function () {
	if (this.atStart) {
		return true;
	}
	if (this.subcollectionIterator !== null) {
		if (this.subcollectionIterator.hasNext()) {
			return true;
		}
		this.subcollectionIterator = null;
	}
	if (this.index >= this.max) {
		return false;
	}
	return true;
};
GeometryCollectionIterator.isAtomic = function (geom) {
	return !(geom instanceof GeometryCollection);
};

