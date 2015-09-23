function WKBReader(...args) {
	this.factory = null;
	this.csFactory = null;
	this.precisionModel = null;
	this.inputDimension = 2;
	this.hasSRID = false;
	this.SRID = 0;
	this.isStrict = false;
	this.dis = new ByteOrderDataInStream();
	this.ordValues = null;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [geometryFactory] = args;
				this.factory = geometryFactory;
				this.precisionModel = this.factory.getPrecisionModel();
				this.csFactory = this.factory.getCoordinateSequenceFactory();
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				WKBReader.call(this, new GeometryFactory());
			})(...args);
	}
}
module.exports = WKBReader
var LineString = require('com/vividsolutions/jts/geom/LineString');
var WKBConstants = require('com/vividsolutions/jts/io/WKBConstants');
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var Point = require('com/vividsolutions/jts/geom/Point');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var ByteArrayInStream = require('com/vividsolutions/jts/io/ByteArrayInStream');
var Character = require('java/lang/Character');
var InStream = require('com/vividsolutions/jts/io/InStream');
var CoordinateSequences = require('com/vividsolutions/jts/geom/CoordinateSequences');
var ParseException = require('com/vividsolutions/jts/io/ParseException');
var ByteOrderValues = require('com/vividsolutions/jts/io/ByteOrderValues');
var RuntimeException = require('java/lang/RuntimeException');
var IOException = require('java/io/IOException');
var ByteOrderDataInStream = require('com/vividsolutions/jts/io/ByteOrderDataInStream');
WKBReader.prototype.read = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Array) {
				return ((...args) => {
					let [bytes] = args;
					try {
						return this.read(new ByteArrayInStream(bytes));
					} catch (e) {
						if (e instanceof IOException) {
							throw new RuntimeException("Unexpected IOException caught: " + ex.getMessage());
						}
					} finally {}
				})(...args);
			} else if (args[0] instanceof InStream) {
				return ((...args) => {
					let [is] = args;
					this.dis.setInStream(is);
					var g = this.readGeometry();
					return g;
				})(...args);
			}
	}
};
WKBReader.prototype.readCoordinate = function () {
	for (var i = 0; i < this.inputDimension; i++) {
		if (i <= 1) {
			this.ordValues[i] = this.precisionModel.makePrecise(this.dis.readDouble());
		} else {
			this.ordValues[i] = this.dis.readDouble();
		}
	}
};
WKBReader.prototype.readCoordinateSequenceRing = function (size) {
	var seq = this.readCoordinateSequence(size);
	if (this.isStrict) return seq;
	if (CoordinateSequences.isRing(seq)) return seq;
	return CoordinateSequences.ensureValidRing(this.csFactory, seq);
};
WKBReader.prototype.readGeometry = function () {
	var byteOrderWKB = this.dis.readByte();
	if (byteOrderWKB === WKBConstants.wkbNDR) {
		this.dis.setOrder(ByteOrderValues.LITTLE_ENDIAN);
	} else if (byteOrderWKB === WKBConstants.wkbXDR) {
		this.dis.setOrder(ByteOrderValues.BIG_ENDIAN);
	} else if (this.isStrict) {
		throw new ParseException("Unknown geometry byte order (not NDR or XDR): " + byteOrderWKB);
	}
	var typeInt = this.dis.readInt();
	var geometryType = typeInt & 0xff;
	var hasZ = (typeInt & 0x80000000) !== 0;
	this.inputDimension = hasZ ? 3 : 2;
	this.hasSRID = (typeInt & 0x20000000) !== 0;
	var SRID = 0;
	if (this.hasSRID) {
		SRID = this.dis.readInt();
	}
	if (this.ordValues === null || this.ordValues.length < this.inputDimension) this.ordValues = [];
	var geom = null;
	switch (geometryType) {
		case WKBConstants.wkbPoint:
			geom = this.readPoint();
			break;
		case WKBConstants.wkbLineString:
			geom = this.readLineString();
			break;
		case WKBConstants.wkbPolygon:
			geom = this.readPolygon();
			break;
		case WKBConstants.wkbMultiPoint:
			geom = this.readMultiPoint();
			break;
		case WKBConstants.wkbMultiLineString:
			geom = this.readMultiLineString();
			break;
		case WKBConstants.wkbMultiPolygon:
			geom = this.readMultiPolygon();
			break;
		case WKBConstants.wkbGeometryCollection:
			geom = this.readGeometryCollection();
			break;
		default:
			throw new ParseException("Unknown WKB type " + geometryType);
	}
	this.setSRID(geom, SRID);
	return geom;
};
WKBReader.prototype.readGeometryCollection = function () {
	var numGeom = this.dis.readInt();
	var geoms = [];
	for (var i = 0; i < numGeom; i++) {
		geoms[i] = this.readGeometry();
	}
	return this.factory.createGeometryCollection(geoms);
};
WKBReader.prototype.readCoordinateSequenceLineString = function (size) {
	var seq = this.readCoordinateSequence(size);
	if (this.isStrict) return seq;
	if (seq.size() === 0 || seq.size() >= 2) return seq;
	return CoordinateSequences.extend(this.csFactory, seq, 2);
};
WKBReader.prototype.readLinearRing = function () {
	var size = this.dis.readInt();
	var pts = this.readCoordinateSequenceRing(size);
	return this.factory.createLinearRing(pts);
};
WKBReader.prototype.readMultiPolygon = function () {
	var numGeom = this.dis.readInt();
	var geoms = [];
	for (var i = 0; i < numGeom; i++) {
		var g = this.readGeometry();
		if (!(g instanceof Polygon)) throw new ParseException(WKBReader.INVALID_GEOM_TYPE_MSG + "MultiPolygon");
		geoms[i] = g;
	}
	return this.factory.createMultiPolygon(geoms);
};
WKBReader.prototype.readPolygon = function () {
	var numRings = this.dis.readInt();
	var holes = null;
	if (numRings > 1) holes = [];
	var shell = this.readLinearRing();
	for (var i = 0; i < numRings - 1; i++) {
		holes[i] = this.readLinearRing();
	}
	return this.factory.createPolygon(shell, holes);
};
WKBReader.prototype.readMultiLineString = function () {
	var numGeom = this.dis.readInt();
	var geoms = [];
	for (var i = 0; i < numGeom; i++) {
		var g = this.readGeometry();
		if (!(g instanceof LineString)) throw new ParseException(WKBReader.INVALID_GEOM_TYPE_MSG + "MultiLineString");
		geoms[i] = g;
	}
	return this.factory.createMultiLineString(geoms);
};
WKBReader.prototype.setSRID = function (g, SRID) {
	if (SRID !== 0) g.setSRID(SRID);
	return g;
};
WKBReader.prototype.readPoint = function () {
	var pts = this.readCoordinateSequence(1);
	return this.factory.createPoint(pts);
};
WKBReader.prototype.readMultiPoint = function () {
	var numGeom = this.dis.readInt();
	var geoms = [];
	for (var i = 0; i < numGeom; i++) {
		var g = this.readGeometry();
		if (!(g instanceof Point)) throw new ParseException(WKBReader.INVALID_GEOM_TYPE_MSG + "MultiPoint");
		geoms[i] = g;
	}
	return this.factory.createMultiPoint(geoms);
};
WKBReader.prototype.readCoordinateSequence = function (size) {
	var seq = this.csFactory.create(size, this.inputDimension);
	var targetDim = seq.getDimension();
	if (targetDim > this.inputDimension) targetDim = this.inputDimension;
	for (var i = 0; i < size; i++) {
		this.readCoordinate();
		for (var j = 0; j < targetDim; j++) {
			seq.setOrdinate(i, j, this.ordValues[j]);
		}
	}
	return seq;
};
WKBReader.prototype.readLineString = function () {
	var size = this.dis.readInt();
	var pts = this.readCoordinateSequenceLineString(size);
	return this.factory.createLineString(pts);
};
WKBReader.hexToInt = function (hex) {
	var nib = Character.digit(hex, 16);
	if (nib < 0) throw new IllegalArgumentException("Invalid hex digit: '" + hex + "'");
	return nib;
};
WKBReader.hexToBytes = function (hex) {
	var byteLen = hex.length() / 2;
	var bytes = [];
	for (var i = 0; i < hex.length() / 2; i++) {
		var i2 = 2 * i;
		if (i2 + 1 > hex.length()) throw new IllegalArgumentException("Hex string has odd length");
		var nib1 = WKBReader.hexToInt(hex.charAt(i2));
		var nib0 = WKBReader.hexToInt(hex.charAt(i2 + 1));
		var b = (nib1 << 4) + nib0;
		bytes[i] = b;
	}
	return bytes;
};
WKBReader.INVALID_GEOM_TYPE_MSG = "Invalid geometry type encountered in ";

