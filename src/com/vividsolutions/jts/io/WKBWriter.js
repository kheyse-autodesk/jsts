function WKBWriter(...args) {
	this.outputDimension = 2;
	this.byteOrder = null;
	this.includeSRID = false;
	this.byteArrayOS = new ByteArrayOutputStream();
	this.byteArrayOutStream = new OutputStreamOutStream(this.byteArrayOS);
	this.buf = [];
	switch (args.length) {
		case 2:
			if (Number.isInteger(args[0]) && args[1] instanceof boolean) {
				return ((...args) => {
					let [outputDimension, includeSRID] = args;
					WKBWriter.call(this, outputDimension, ByteOrderValues.BIG_ENDIAN, includeSRID);
				})(...args);
			} else if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
				return ((...args) => {
					let [outputDimension, byteOrder] = args;
					WKBWriter.call(this, outputDimension, byteOrder, false);
				})(...args);
			}
		case 1:
			return ((...args) => {
				let [outputDimension] = args;
				WKBWriter.call(this, outputDimension, ByteOrderValues.BIG_ENDIAN);
			})(...args);
		case 3:
			return ((...args) => {
				let [outputDimension, byteOrder, includeSRID] = args;
				this.outputDimension = outputDimension;
				this.byteOrder = byteOrder;
				this.includeSRID = includeSRID;
				if (outputDimension < 2 || outputDimension > 3) throw new IllegalArgumentException("Output dimension must be 2 or 3");
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				WKBWriter.call(this, 2, ByteOrderValues.BIG_ENDIAN);
			})(...args);
	}
}
module.exports = WKBWriter
var LineString = require('com/vividsolutions/jts/geom/LineString');
var WKBConstants = require('com/vividsolutions/jts/io/WKBConstants');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Point = require('com/vividsolutions/jts/geom/Point');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var MultiPoint = require('com/vividsolutions/jts/geom/MultiPoint');
var OutputStreamOutStream = require('com/vividsolutions/jts/io/OutputStreamOutStream');
var MultiPolygon = require('com/vividsolutions/jts/geom/MultiPolygon');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var ByteOrderValues = require('com/vividsolutions/jts/io/ByteOrderValues');
var ByteArrayOutputStream = require('java/io/ByteArrayOutputStream');
var RuntimeException = require('java/lang/RuntimeException');
var Assert = require('com/vividsolutions/jts/util/Assert');
var IOException = require('java/io/IOException');
var MultiLineString = require('com/vividsolutions/jts/geom/MultiLineString');
WKBWriter.prototype.writeGeometryCollection = function (geometryType, gc, os) {
	this.writeByteOrder(os);
	this.writeGeometryType(geometryType, gc, os);
	this.writeInt(gc.getNumGeometries(), os);
	for (var i = 0; i < gc.getNumGeometries(); i++) {
		this.write(gc.getGeometryN(i), os);
	}
};
WKBWriter.prototype.writePoint = function (pt, os) {
	if (pt.getCoordinateSequence().size() === 0) throw new IllegalArgumentException("Empty Points cannot be represented in WKB");
	this.writeByteOrder(os);
	this.writeGeometryType(WKBConstants.wkbPoint, pt, os);
	this.writeCoordinateSequence(pt.getCoordinateSequence(), false, os);
};
WKBWriter.prototype.writeCoordinateSequence = function (seq, writeSize, os) {
	if (writeSize) this.writeInt(seq.size(), os);
	for (var i = 0; i < seq.size(); i++) {
		this.writeCoordinate(seq, i, os);
	}
};
WKBWriter.prototype.writeInt = function (intValue, os) {
	ByteOrderValues.putInt(intValue, this.buf, this.byteOrder);
	os.write(this.buf, 4);
};
WKBWriter.prototype.writeGeometryType = function (geometryType, g, os) {
	var flag3D = this.outputDimension === 3 ? 0x80000000 : 0;
	var typeInt = geometryType | flag3D;
	typeInt |= this.includeSRID ? 0x20000000 : 0;
	this.writeInt(typeInt, os);
	if (this.includeSRID) {
		this.writeInt(g.getSRID(), os);
	}
};
WKBWriter.prototype.writeLineString = function (line, os) {
	this.writeByteOrder(os);
	this.writeGeometryType(WKBConstants.wkbLineString, line, os);
	this.writeCoordinateSequence(line.getCoordinateSequence(), true, os);
};
WKBWriter.prototype.writeByteOrder = function (os) {
	if (this.byteOrder === ByteOrderValues.LITTLE_ENDIAN) this.buf[0] = WKBConstants.wkbNDR; else this.buf[0] = WKBConstants.wkbXDR;
	os.write(this.buf, 1);
};
WKBWriter.prototype.writeCoordinate = function (seq, index, os) {
	ByteOrderValues.putDouble(seq.getX(index), this.buf, this.byteOrder);
	os.write(this.buf, 8);
	ByteOrderValues.putDouble(seq.getY(index), this.buf, this.byteOrder);
	os.write(this.buf, 8);
	if (this.outputDimension >= 3) {
		var ordVal = Coordinate.NULL_ORDINATE;
		if (seq.getDimension() >= 3) ordVal = seq.getOrdinate(index, 2);
		ByteOrderValues.putDouble(ordVal, this.buf, this.byteOrder);
		os.write(this.buf, 8);
	}
};
WKBWriter.prototype.writePolygon = function (poly, os) {
	this.writeByteOrder(os);
	this.writeGeometryType(WKBConstants.wkbPolygon, poly, os);
	this.writeInt(poly.getNumInteriorRing() + 1, os);
	this.writeCoordinateSequence(poly.getExteriorRing().getCoordinateSequence(), true, os);
	for (var i = 0; i < poly.getNumInteriorRing(); i++) {
		this.writeCoordinateSequence(poly.getInteriorRingN(i).getCoordinateSequence(), true, os);
	}
};
WKBWriter.prototype.write = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geom, os] = args;
				if (geom instanceof Point) this.writePoint(geom, os); else if (geom instanceof LineString) this.writeLineString(geom, os); else if (geom instanceof Polygon) this.writePolygon(geom, os); else if (geom instanceof MultiPoint) this.writeGeometryCollection(WKBConstants.wkbMultiPoint, geom, os); else if (geom instanceof MultiLineString) this.writeGeometryCollection(WKBConstants.wkbMultiLineString, geom, os); else if (geom instanceof MultiPolygon) this.writeGeometryCollection(WKBConstants.wkbMultiPolygon, geom, os); else if (geom instanceof GeometryCollection) this.writeGeometryCollection(WKBConstants.wkbGeometryCollection, geom, os); else {
					Assert.shouldNeverReachHere("Unknown Geometry type");
				}
			})(...args);
		case 1:
			return ((...args) => {
				let [geom] = args;
				try {
					this.byteArrayOS.reset();
					this.write(geom, this.byteArrayOutStream);
				} catch (e) {
					if (e instanceof IOException) {
						throw new RuntimeException("Unexpected IO exception: " + ex.getMessage());
					}
				} finally {}
				return this.byteArrayOS.toByteArray();
			})(...args);
	}
};
WKBWriter.toHexDigit = function (n) {
	if (n < 0 || n > 15) throw new IllegalArgumentException("Nibble value out of range: " + n);
	if (n <= 9) return '0' + n;
	return 'A' + n - 10;
};
WKBWriter.toHex = function (bytes) {
	var buf = new StringBuffer();
	for (var i = 0; i < bytes.length; i++) {
		var b = bytes[i];
		buf.append(WKBWriter.toHexDigit(b >> 4 & 0x0F));
		buf.append(WKBWriter.toHexDigit(b & 0x0F));
	}
	return buf.toString();
};
WKBWriter.bytesToHex = function (bytes) {
	return WKBWriter.toHex(bytes);
};

