function OctagonalEnvelope(...args) {
	this.minX = Double.NaN;
	this.maxX = null;
	this.minY = null;
	this.maxY = null;
	this.minA = null;
	this.maxA = null;
	this.minB = null;
	this.maxB = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [p0, p1] = args;
				this.expandToInclude(p0);
				this.expandToInclude(p1);
			})(...args);
		case 1:
			if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [p] = args;
					this.expandToInclude(p);
				})(...args);
			} else if (args[0] instanceof Envelope) {
				return ((...args) => {
					let [env] = args;
					this.expandToInclude(env);
				})(...args);
			} else if (args[0] instanceof OctagonalEnvelope) {
				return ((...args) => {
					let [oct] = args;
					this.expandToInclude(oct);
				})(...args);
			} else if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [geom] = args;
					this.expandToInclude(geom);
				})(...args);
			}
		case 0:
			return ((...args) => {
				let [] = args;
			})(...args);
	}
}
module.exports = OctagonalEnvelope
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Double = require('java/lang/Double');
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
OctagonalEnvelope.prototype.toGeometry = function (geomFactory) {
	if (this.isNull()) {
		return geomFactory.createPoint(null);
	}
	var px00 = new Coordinate(this.minX, this.minA - this.minX);
	var px01 = new Coordinate(this.minX, this.minX - this.minB);
	var px10 = new Coordinate(this.maxX, this.maxX - this.maxB);
	var px11 = new Coordinate(this.maxX, this.maxA - this.maxX);
	var py00 = new Coordinate(this.minA - this.minY, this.minY);
	var py01 = new Coordinate(this.minY + this.maxB, this.minY);
	var py10 = new Coordinate(this.maxY + this.minB, this.maxY);
	var py11 = new Coordinate(this.maxA - this.maxY, this.maxY);
	var pm = geomFactory.getPrecisionModel();
	pm.makePrecise(px00);
	pm.makePrecise(px01);
	pm.makePrecise(px10);
	pm.makePrecise(px11);
	pm.makePrecise(py00);
	pm.makePrecise(py01);
	pm.makePrecise(py10);
	pm.makePrecise(py11);
	var coordList = new CoordinateList();
	coordList.add(px00, false);
	coordList.add(px01, false);
	coordList.add(py10, false);
	coordList.add(py11, false);
	coordList.add(px11, false);
	coordList.add(px10, false);
	coordList.add(py01, false);
	coordList.add(py00, false);
	if (coordList.size() === 1) {
		return geomFactory.createPoint(px00);
	}
	if (coordList.size() === 2) {
		var pts = coordList.toCoordinateArray();
		return geomFactory.createLineString(pts);
	}
	coordList.add(px00, false);
	var pts = coordList.toCoordinateArray();
	return geomFactory.createPolygon(geomFactory.createLinearRing(pts), null);
};
OctagonalEnvelope.prototype.getMinA = function () {
	return this.minA;
};
OctagonalEnvelope.prototype.getMaxB = function () {
	return this.maxB;
};
OctagonalEnvelope.prototype.isValid = function () {
	if (this.isNull()) return true;
	return this.minX <= this.maxX && this.minY <= this.maxY && this.minA <= this.maxA && this.minB <= this.maxB;
};
OctagonalEnvelope.prototype.isNull = function () {
	return Double.isNaN(this.minX);
};
OctagonalEnvelope.prototype.getMaxX = function () {
	return this.maxX;
};
OctagonalEnvelope.prototype.intersects = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof OctagonalEnvelope) {
				return ((...args) => {
					let [other] = args;
					if (this.isNull() || other.isNull()) {
						return false;
					}
					if (this.minX > other.maxX) return false;
					if (this.maxX < other.minX) return false;
					if (this.minY > other.maxY) return false;
					if (this.maxY < other.minY) return false;
					if (this.minA > other.maxA) return false;
					if (this.maxA < other.minA) return false;
					if (this.minB > other.maxB) return false;
					if (this.maxB < other.minB) return false;
					return true;
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [p] = args;
					if (this.minX > p.x) return false;
					if (this.maxX < p.x) return false;
					if (this.minY > p.y) return false;
					if (this.maxY < p.y) return false;
					var A = OctagonalEnvelope.computeA(p.x, p.y);
					var B = OctagonalEnvelope.computeB(p.x, p.y);
					if (this.minA > A) return false;
					if (this.maxA < A) return false;
					if (this.minB > B) return false;
					if (this.maxB < B) return false;
					return true;
				})(...args);
			}
	}
};
OctagonalEnvelope.prototype.getMinY = function () {
	return this.minY;
};
OctagonalEnvelope.prototype.getMinX = function () {
	return this.minX;
};
OctagonalEnvelope.prototype.expandToInclude = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [x, y] = args;
				var A = OctagonalEnvelope.computeA(x, y);
				var B = OctagonalEnvelope.computeB(x, y);
				if (this.isNull()) {
					this.minX = x;
					this.maxX = x;
					this.minY = y;
					this.maxY = y;
					this.minA = A;
					this.maxA = A;
					this.minB = B;
					this.maxB = B;
				} else {
					if (x < this.minX) this.minX = x;
					if (x > this.maxX) this.maxX = x;
					if (y < this.minY) this.minY = y;
					if (y > this.maxY) this.maxY = y;
					if (A < this.minA) this.minA = A;
					if (A > this.maxA) this.maxA = A;
					if (B < this.minB) this.minB = B;
					if (B > this.maxB) this.maxB = B;
				}
				return this;
			})(...args);
		case 1:
			if (args[0] instanceof Geometry) {
				return ((...args) => {
					let [g] = args;
					g.apply(new BoundingOctagonComponentFilter());
				})(...args);
			} else if (args[0] instanceof CoordinateSequence) {
				return ((...args) => {
					let [seq] = args;
					for (var i = 0; i < seq.size(); i++) {
						var x = seq.getX(i);
						var y = seq.getY(i);
						this.expandToInclude(x, y);
					}
					return this;
				})(...args);
			} else if (args[0] instanceof OctagonalEnvelope) {
				return ((...args) => {
					let [oct] = args;
					if (oct.isNull()) return this;
					if (this.isNull()) {
						this.minX = oct.minX;
						this.maxX = oct.maxX;
						this.minY = oct.minY;
						this.maxY = oct.maxY;
						this.minA = oct.minA;
						this.maxA = oct.maxA;
						this.minB = oct.minB;
						this.maxB = oct.maxB;
						return this;
					}
					if (oct.minX < this.minX) this.minX = oct.minX;
					if (oct.maxX > this.maxX) this.maxX = oct.maxX;
					if (oct.minY < this.minY) this.minY = oct.minY;
					if (oct.maxY > this.maxY) this.maxY = oct.maxY;
					if (oct.minA < this.minA) this.minA = oct.minA;
					if (oct.maxA > this.maxA) this.maxA = oct.maxA;
					if (oct.minB < this.minB) this.minB = oct.minB;
					if (oct.maxB > this.maxB) this.maxB = oct.maxB;
					return this;
				})(...args);
			} else if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [p] = args;
					this.expandToInclude(p.x, p.y);
					return this;
				})(...args);
			} else if (args[0] instanceof Envelope) {
				return ((...args) => {
					let [env] = args;
					this.expandToInclude(env.getMinX(), env.getMinY());
					this.expandToInclude(env.getMinX(), env.getMaxY());
					this.expandToInclude(env.getMaxX(), env.getMinY());
					this.expandToInclude(env.getMaxX(), env.getMaxY());
					return this;
				})(...args);
			}
	}
};
OctagonalEnvelope.prototype.getMinB = function () {
	return this.minB;
};
OctagonalEnvelope.prototype.setToNull = function () {
	this.minX = Double.NaN;
};
OctagonalEnvelope.prototype.expandBy = function (distance) {
	if (this.isNull()) return null;
	var diagonalDistance = OctagonalEnvelope.SQRT2 * distance;
	this.minX -= distance;
	this.maxX += distance;
	this.minY -= distance;
	this.maxY += distance;
	this.minA -= diagonalDistance;
	this.maxA += diagonalDistance;
	this.minB -= diagonalDistance;
	this.maxB += diagonalDistance;
	if (!this.isValid()) this.setToNull();
};
OctagonalEnvelope.prototype.getMaxA = function () {
	return this.maxA;
};
OctagonalEnvelope.prototype.contains = function (other) {
	if (this.isNull() || other.isNull()) {
		return false;
	}
	return other.minX >= this.minX && other.maxX <= this.maxX && other.minY >= this.minY && other.maxY <= this.maxY && other.minA >= this.minA && other.maxA <= this.maxA && other.minB >= this.minB && other.maxB <= this.maxB;
};
OctagonalEnvelope.prototype.getMaxY = function () {
	return this.maxY;
};
OctagonalEnvelope.octagonalEnvelope = function (geom) {
	return new OctagonalEnvelope(geom).toGeometry(geom.getFactory());
};
OctagonalEnvelope.computeB = function (x, y) {
	return x - y;
};
OctagonalEnvelope.computeA = function (x, y) {
	return x + y;
};
OctagonalEnvelope.SQRT2 = Math.sqrt(2.0);

