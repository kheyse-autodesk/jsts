function ScaledNoder(...args) {
	this.noder = null;
	this.scaleFactor = null;
	this.offsetX = null;
	this.offsetY = null;
	this.isScaled = false;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [noder, scaleFactor] = args;
				ScaledNoder.call(this, noder, scaleFactor, 0, 0);
			})(...args);
		case 4:
			return ((...args) => {
				let [noder, scaleFactor, offsetX, offsetY] = args;
				this.noder = noder;
				this.scaleFactor = scaleFactor;
				this.isScaled = !this.isIntegerPrecision();
			})(...args);
	}
}
module.exports = ScaledNoder
var Collection = require('java/util/Collection');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var CollectionUtil = require('com/vividsolutions/jts/util/CollectionUtil');
ScaledNoder.prototype.rescale = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Collection) {
				return ((...args) => {
					let [segStrings] = args;
					CollectionUtil.apply(segStrings, new CollectionUtil.Function());
				})(...args);
			} else if (args[0] instanceof Array) {
				return ((...args) => {
					let [pts] = args;
					var p0 = null;
					var p1 = null;
					if (pts.length === 2) {
						p0 = new Coordinate(pts[0]);
						p1 = new Coordinate(pts[1]);
					}
					for (var i = 0; i < pts.length; i++) {
						this.x = this.x / this.scaleFactor + this.offsetX;
						this.y = this.y / this.scaleFactor + this.offsetY;
					}
					if (pts.length === 2 && pts[0].equals2D(pts[1])) {
						System.out.println(pts);
					}
				})(...args);
			}
	}
};
ScaledNoder.prototype.scale = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Collection) {
				return ((...args) => {
					let [segStrings] = args;
					return CollectionUtil.transform(segStrings, new CollectionUtil.Function());
				})(...args);
			} else if (args[0] instanceof Array) {
				return ((...args) => {
					let [pts] = args;
					var roundPts = [];
					for (var i = 0; i < pts.length; i++) {
						roundPts[i] = new Coordinate(Math.round((this.x - this.offsetX) * this.scaleFactor), Math.round((this.y - this.offsetY) * this.scaleFactor), this.z);
					}
					var roundPtsNoDup = CoordinateArrays.removeRepeatedPoints(roundPts);
					return roundPtsNoDup;
				})(...args);
			}
	}
};
ScaledNoder.prototype.isIntegerPrecision = function () {
	return this.scaleFactor === 1.0;
};
ScaledNoder.prototype.getNodedSubstrings = function () {
	var splitSS = this.noder.getNodedSubstrings();
	if (this.isScaled) this.rescale(splitSS);
	return splitSS;
};
ScaledNoder.prototype.computeNodes = function (inputSegStrings) {
	var intSegStrings = inputSegStrings;
	if (this.isScaled) intSegStrings = this.scale(inputSegStrings);
	this.noder.computeNodes(intSegStrings);
};

