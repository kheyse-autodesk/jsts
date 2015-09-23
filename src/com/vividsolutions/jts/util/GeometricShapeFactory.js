function GeometricShapeFactory(...args) {
	this.geomFact = null;
	this.precModel = null;
	this.dim = new Dimensions();
	this.nPts = 100;
	this.rotationAngle = 0.0;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [geomFact] = args;
				this.geomFact = geomFact;
				this.precModel = geomFact.getPrecisionModel();
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				GeometricShapeFactory.call(this, new GeometryFactory());
			})(...args);
	}
}
module.exports = GeometricShapeFactory
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var AffineTransformation = require('com/vividsolutions/jts/geom/util/AffineTransformation');
GeometricShapeFactory.prototype.createSupercircle = function (power) {
	var recipPow = 1.0 / power;
	var radius = this.dim.getMinSize() / 2;
	var centre = this.dim.getCentre();
	var r4 = Math.pow(radius, power);
	var y0 = radius;
	var xyInt = Math.pow(r4 / 2, recipPow);
	var nSegsInOct = this.nPts / 8;
	var totPts = nSegsInOct * 8 + 1;
	var pts = [];
	var xInc = xyInt / nSegsInOct;
	for (var i = 0; i <= nSegsInOct; i++) {
		var x = 0.0;
		var y = y0;
		if (i !== 0) {
			x = xInc * i;
			var x4 = Math.pow(x, power);
			y = Math.pow(r4 - x4, recipPow);
		}
		pts[i] = this.coordTrans(x, y, centre);
		pts[2 * nSegsInOct - i] = this.coordTrans(y, x, centre);
		pts[2 * nSegsInOct + i] = this.coordTrans(y, -x, centre);
		pts[4 * nSegsInOct - i] = this.coordTrans(x, -y, centre);
		pts[4 * nSegsInOct + i] = this.coordTrans(-x, -y, centre);
		pts[6 * nSegsInOct - i] = this.coordTrans(-y, -x, centre);
		pts[6 * nSegsInOct + i] = this.coordTrans(-y, x, centre);
		pts[8 * nSegsInOct - i] = this.coordTrans(-x, y, centre);
	}
	pts[pts.length - 1] = new Coordinate(pts[0]);
	var ring = this.geomFact.createLinearRing(pts);
	var poly = this.geomFact.createPolygon(ring, null);
	return this.rotate(poly);
};
GeometricShapeFactory.prototype.setNumPoints = function (nPts) {
	this.nPts = nPts;
};
GeometricShapeFactory.prototype.setBase = function (base) {
	this.dim.setBase(base);
};
GeometricShapeFactory.prototype.setRotation = function (radians) {
	this.rotationAngle = radians;
};
GeometricShapeFactory.prototype.setWidth = function (width) {
	this.dim.setWidth(width);
};
GeometricShapeFactory.prototype.createEllipse = function () {
	var env = this.dim.getEnvelope();
	var xRadius = env.getWidth() / 2.0;
	var yRadius = env.getHeight() / 2.0;
	var centreX = env.getMinX() + xRadius;
	var centreY = env.getMinY() + yRadius;
	var pts = [];
	var iPt = 0;
	for (var i = 0; i < this.nPts; i++) {
		var ang = i * 2 * Math.PI / this.nPts;
		var x = xRadius * Math.cos(ang) + centreX;
		var y = yRadius * Math.sin(ang) + centreY;
		pts[iPt++] = this.coord(x, y);
	}
	pts[iPt] = new Coordinate(pts[0]);
	var ring = this.geomFact.createLinearRing(pts);
	var poly = this.geomFact.createPolygon(ring, null);
	return this.rotate(poly);
};
GeometricShapeFactory.prototype.coordTrans = function (x, y, trans) {
	return this.coord(x + trans.x, y + trans.y);
};
GeometricShapeFactory.prototype.createSquircle = function () {
	return this.createSupercircle(4);
};
GeometricShapeFactory.prototype.setEnvelope = function (env) {
	this.dim.setEnvelope(env);
};
GeometricShapeFactory.prototype.setCentre = function (centre) {
	this.dim.setCentre(centre);
};
GeometricShapeFactory.prototype.createArc = function (startAng, angExtent) {
	var env = this.dim.getEnvelope();
	var xRadius = env.getWidth() / 2.0;
	var yRadius = env.getHeight() / 2.0;
	var centreX = env.getMinX() + xRadius;
	var centreY = env.getMinY() + yRadius;
	var angSize = angExtent;
	if (angSize <= 0.0 || angSize > 2 * Math.PI) angSize = 2 * Math.PI;
	var angInc = angSize / (this.nPts - 1);
	var pts = [];
	var iPt = 0;
	for (var i = 0; i < this.nPts; i++) {
		var ang = startAng + i * angInc;
		var x = xRadius * Math.cos(ang) + centreX;
		var y = yRadius * Math.sin(ang) + centreY;
		pts[iPt++] = this.coord(x, y);
	}
	var line = this.geomFact.createLineString(pts);
	return this.rotate(line);
};
GeometricShapeFactory.prototype.rotate = function (geom) {
	if (this.rotationAngle !== 0.0) {
		var trans = AffineTransformation.rotationInstance(this.rotationAngle, this.x, this.y);
		geom.apply(trans);
	}
	return geom;
};
GeometricShapeFactory.prototype.coord = function (x, y) {
	var pt = new Coordinate(x, y);
	this.precModel.makePrecise(pt);
	return pt;
};
GeometricShapeFactory.prototype.createArcPolygon = function (startAng, angExtent) {
	var env = this.dim.getEnvelope();
	var xRadius = env.getWidth() / 2.0;
	var yRadius = env.getHeight() / 2.0;
	var centreX = env.getMinX() + xRadius;
	var centreY = env.getMinY() + yRadius;
	var angSize = angExtent;
	if (angSize <= 0.0 || angSize > 2 * Math.PI) angSize = 2 * Math.PI;
	var angInc = angSize / (this.nPts - 1);
	var pts = [];
	var iPt = 0;
	pts[iPt++] = this.coord(centreX, centreY);
	for (var i = 0; i < this.nPts; i++) {
		var ang = startAng + angInc * i;
		var x = xRadius * Math.cos(ang) + centreX;
		var y = yRadius * Math.sin(ang) + centreY;
		pts[iPt++] = this.coord(x, y);
	}
	pts[iPt++] = this.coord(centreX, centreY);
	var ring = this.geomFact.createLinearRing(pts);
	var poly = this.geomFact.createPolygon(ring, null);
	return this.rotate(poly);
};
GeometricShapeFactory.prototype.createRectangle = function () {
	var i = null;
	var ipt = 0;
	var nSide = this.nPts / 4;
	if (nSide < 1) nSide = 1;
	var XsegLen = this.dim.getEnvelope().getWidth() / nSide;
	var YsegLen = this.dim.getEnvelope().getHeight() / nSide;
	var pts = [];
	var env = this.dim.getEnvelope();
	for (i = 0; i < nSide; i++) {
		var x = env.getMinX() + i * XsegLen;
		var y = env.getMinY();
		pts[ipt++] = this.coord(x, y);
	}
	for (i = 0; i < nSide; i++) {
		var x = env.getMaxX();
		var y = env.getMinY() + i * YsegLen;
		pts[ipt++] = this.coord(x, y);
	}
	for (i = 0; i < nSide; i++) {
		var x = env.getMaxX() - i * XsegLen;
		var y = env.getMaxY();
		pts[ipt++] = this.coord(x, y);
	}
	for (i = 0; i < nSide; i++) {
		var x = env.getMinX();
		var y = env.getMaxY() - i * YsegLen;
		pts[ipt++] = this.coord(x, y);
	}
	pts[ipt++] = new Coordinate(pts[0]);
	var ring = this.geomFact.createLinearRing(pts);
	var poly = this.geomFact.createPolygon(ring, null);
	return this.rotate(poly);
};
GeometricShapeFactory.prototype.createCircle = function () {
	return this.createEllipse();
};
GeometricShapeFactory.prototype.setHeight = function (height) {
	this.dim.setHeight(height);
};
GeometricShapeFactory.prototype.setSize = function (size) {
	this.dim.setSize(size);
};

